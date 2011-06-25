require "query_manager"
# == Schema Information
# Schema version: 20110609094335
#
# Table name: activities
#
#  id               :integer         not null, primary key
#  activity_word_id :integer         not null
#  activity_text    :text            not null
#  activity_name    :string(255)     not null
#  author_id        :integer         not null
#  parent_id        :integer
#  ancestry         :string(255)
#  ancestry_depth   :integer         default(0)
#  created_at       :datetime
#  updated_at       :datetime
#

#TODO add i18n error messages in all validations
#TODO move all constants to environments
class Activity < ActiveRecord::Base

  has_ancestry   :cache_depth => 3


  belongs_to :author, :class_name => "User" #, :touch => true
   #:touch => true can be un-optimal for deep nested threading
  belongs_to     :parent, :class_name => "Activity",  :foreign_key => "parent_id"#, :touch => true
  belongs_to      :activity_word

  #destroy will happen from activity
  has_many      :hubs, :dependent => :destroy

  has_many      :entities, :through => :hubs
  has_one        :location,:through => :hubs

  has_many    :mentions, :dependent => :destroy #destroy will happen from activity
  has_many    :campaigns, :dependent => :destroy
  has_many    :documents, :dependent => :nullify # documents have life time more than activity

  #:delete instead of :destroy to stop circular effect
  has_one      :father_campaign, :foreign_key => :father_id, :class_name => "Campaign", :dependent => :delete



  before_save       :ensure_valid_parent_and_author
  before_destroy    :ensure_before_destroyed
  after_save        :ensure_tables_setup_at_save

  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id

  validates_presence_of     :activity_name, :activity_text

  validates_length_of       :activity_text , :in => 1..2048

  validates_length_of   :activity_name,   :in => 1..255

  protected

    def  ensure_tables_setup_at_save
      #TODO all tables setup - hub, mentions, campaigns
    end
    def ensure_before_destroyed
      puts "activity deleted #{self.id} #{self.activity_name}"
      #TODO all tables CLEANUP - hub, mentions, campaigns
    end

    def ensure_valid_parent_and_author

      if !new_record?
        if self.author_id_changed? || self.parent_id_changed?
          puts "changing author"
          Rails.logger.info("Trying to edit" + (self.author_id_changed? ? " author":" parent" ))
          raise ActiveRecord::RecordNotSaved.new(self)
        end

      else
        if self.parent_id.nil?
          Rails.logger.info("Root Activity created by #{self.author}")
          puts "nil parent"
        else
          if !Activity.unscoped.exists?(self.parent)
            puts "invalid parent"
            Rails.logger.error("Invalid Parent of Activity created by #{self.author}")
            errors[:parent] << "Invalid parent of activity is being created"
            raise ActiveRecord::RecordInvalid.new(self)
          end
        end

      end
    end

  public
  class << self

    include QueryManager
    include ActivityTextFormatter

    def board (user, filter_activity = {})
      u = User.all #change it with users in contact
      a = Activity.where(:author_id => u, :ancestry => nil).order("updated_at DESC").limit(5)

      # TODO Add Campaigns to each activity
      # TODO Add user name and photograph Id to each activity

      h = Hash[*a.collect { |v|
                [v, v.subtree.from_depth(1).arrange]
              }.flatten]
      puts h
    end

    def page (user, filter_activity = {})
      #TODO Only users activity. if its not root then show only that activity without its parent and child
    end

    #TODO
    def top_activities (user)

    end
    #TODO
    def campaign_count (user, act_id)

    end
    #TODO
    def bookmarked_activity (user)

    end
    #TODO
    def parse_activity(xml_data)

    end
    #TODO
    def update_activity(act)

    end
    #TODO
    def delete_activity(act)

    end

    def create_mentions(text, activity)
       m = get_mentions(text)
       m.each do |attr|
         obj = Mention.create(:user_id => attr[0].to_i, :activity_id => activity.id)
         if obj.id.nil?
           text= untag_a_mention(text,attr[0].to_i )
         end
       end

       if m.length > 0
         text = flatten_mentions(text)

         #Save the updated mention if enrich is not done
         update = activity.update_attributes(:activity_text => text )

         if !update
           Rails.logger.error("Activity =. CreateMentions => Mentions Saving failed")
         end
       end
       text
    end


#    CHILD ACTIVITIES AND CAMPAIGNS WILL NOT GO TO HUB
#    :author_id => user id
#    :parent_id => id of parent activity or nil . If parent there then it should be comment. But its responsibility
#.              of client to post where Activity = <comment> location = nil

#    :activity => activity word or phrase in activity box
#    :text =>   ""entity box + @@ + location box" or nil
#    :description => NO SUPPORT .. DO WE NEED OR Entity Box is itself Description.. Can be added if every body feels so
#    :location => {
#                  :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
#                                      OR
#                  :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
#                                      OR
#                  :unresolved_location =>{:unresolved_location_name => "http://google.com"}
#                                      OR
#                                     nil
#                 }
#    :documents => ActionDispatch::HTTP::Uploader objects
#    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )

    def create_activity(params={})

      word_obj = ActivityWord.create_activity_word(params[:activity], relation = "verb-form")

      #Add activity_word to params hash for hub creation
      params[:activity_word_hash] = {:word => params[:activity], :id => word_obj.id}

      if params[:parent_id].blank?
        obj = Activity.create!(:activity_word_id => word_obj.id,:activity_text => params[:text] , :activity_name => params[:activity],
                         :author_id => params[:author_id])


      else
         act = Activity.find(params[:parent_id])
         if !act.blank?
            obj = act.children.create!(:activity_word_id => word_obj.id,:activity_text => params[:text] ,
                                 :activity_name => params[:activity], :author_id => params[:author_id], :parent => act )
         end
      end

      #Generate Mentions
      params[:text] = create_mentions(params[:text], obj)

      #Add activity to params hash for hub creation
      params[:activity_hash]  = obj.id

      if params[:enrich] == true
        post_proc_activity(params)
      end

      return obj

      rescue => e
        Rails.logger.error("Activity => CreateActivity failed with #{e.message} for #{params.to_s}")
      nil
   end

  def create_hub_entries(params = {})
    hubs_hash = {}

    hubs_hash[:activity_id] =  params[:activity_hash]
    hubs_hash[:activity_word_id] =  params[:activity_word_hash][:id]
    hubs_hash[:activity_name] =  params[:activity_word_hash][:word]
    hubs_hash[:user_id] = params[:author_id]
    hubs_hash[:location_id] = params[:location_hash]

    params[:entity_hash].each do |key, value|
      hubs_hash[:entity_name] = key
      hubs_hash[:entity_id] = value
      puts hubs_hash
      Hub.create!(hubs_hash)
    end
    obj = Activity.where(:id => params[:activity_hash]).first
    obj.update_attributes(:activity_text => params[:text])

  rescue => e
     Rails.logger.error("Activity => CreateHubEntries => Failed => #{e.message} => #{params} => hubs_hash = #{hubs_hash}")
  end

  def post_proc_activity(params={})
     temp_text = remove_all_mentions(params[:text])
     entities=get_entities(temp_text)

     entities.each do |entity|
       obj = Entity.create_entities(params[:author_id],entity)

       if !obj.nil?
         #Add entity to params hash for hub creation
         if  params[:entity_hash].nil?
           params[:entity_hash] = {}
         end
          params[:entity_hash][entity['name']]  = obj.id

       end
     end

     params[:text] = mark_entities(params[:text],params[:entity_hash])
     #puts params[:text]

     if !params[:location].blank?
       loc= Location.create_location(params[:location])
       if !loc.nil?
          #Add location to params hash for hub creation
          params[:location_hash] = loc.id
       end
     end
      #mentions
      #locations
      #Hub update
      #Activity Text Update
     create_hub_entries(params)
     Rails.logger.error("Activity => PostProcActivity Enrich =>  #{params.to_s}")
  end
   handle_asynchronously :post_proc_activity
  end
end
