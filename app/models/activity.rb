# == Schema Information
# Schema version: 20110616040229
#
# Table name: activities
#
#  id                   :integer         not null, primary key
#  activity_word_id     :integer         not null
#  activity_text        :text            not null
#  activity_name        :string(255)     not null
#  author_id            :integer         not null
#  author_full_name     :string(255)     not null
#  author_profile_photo :string(255)     not null
#  parent_id            :integer
#  base_location_id     :integer
#  base_location_data   :text
#  ancestry             :string(255)
#  ancestry_depth       :integer         default(0)
#  created_at           :datetime
#  updated_at           :datetime
#

require "query_manager"
#TODO add i18n error messages in all validations
#TODO move all constants to environments
class Activity < ActiveRecord::Base

  has_ancestry   :cache_depth => 3

  serialize :base_location_data, Hash

  belongs_to :author, :class_name => "User" #, :touch => true
   #:touch => true can be un-optimal for deep nested threading
  belongs_to     :parent, :class_name => "Activity",  :foreign_key => "parent_id"#, :touch => true
  belongs_to      :activity_word

  #destroy will happen from activity
  has_many      :hubs, :dependent => :destroy

  has_many      :entities, :through => :hubs
  has_many      :locations,:through => :hubs

  has_many    :mentions, :dependent => :destroy #destroy will happen from activity
  has_many    :campaigns, :dependent => :destroy
  has_many    :documents, :dependent => :nullify # documents have life time more than activity

  belongs_to     :base_location, :class_name => "Location"

  #:delete instead of :destroy to stop circular effect
  has_one      :father_campaign, :foreign_key => :father_id, :class_name => "Campaign", :dependent => :delete



  before_save       :ensure_valid_parent_and_author
  before_destroy    :ensure_before_destroyed
  after_save        :ensure_tables_setup_at_save

  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id
  validates_existence_of  :base_location_id, :allow_nil => true

  validates_presence_of   :activity_name, :author_full_name, :author_profile_photo

  validates_length_of     :activity_text , :maximum => 2048

  validates_length_of     :activity_name,   :in => 1..255



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
    include LocationRoutines

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

      base_location_hash = nil
      base_location_data = nil

      #get user details
      u = User.find(params[:author_id])
      if u.nil?
        raise ActiveRecord::RecordNotSaved.new(self)
      end

      #create the activity word
      word_obj = ActivityWord.create_activity_word(params[:activity], relation = "verb-form")

      #Add activity_word to params hash for hub creation
      params[:activity_word_hash] = {:word => params[:activity], :id => word_obj.id}


      #create location
      if !params[:location].blank?
       loc= Location.create_location(params[:location])
       if !loc.nil?
          #Add location to params hash for hub creation
          base_location_id = params[:location_hash] = loc.id
          base_location_hash = location_hash(loc)
       end
      end

      #create activity => either root or child
      if params[:parent_id].blank?

        obj = Activity.create!(:activity_word_id => word_obj.id,:activity_text => params[:text] , :activity_name => params[:activity],
                               :author_id => params[:author_id],:author_full_name => u.full_name,
                               :author_profile_photo => u.photo_small_url,:base_location_id => base_location_id,
                               :base_location_data => base_location_hash,:parent_id => nil)


      else
         act = Activity.find(params[:parent_id])
         if !act.blank?
            obj = act.children.create!(:activity_word_id => word_obj.id,:activity_text => params[:text] ,
                                 :activity_name => params[:activity], :author_id => params[:author_id],
                                 :author_full_name => u.full_name, :author_profile_photo => u.photo_small_url,
                                 :parent => act)
         end
      end

      puts obj.inspect
      #Generate Mentions
      #TODO - not very optimal as create_mention saves the the activity text with flatten_mentions. if we move this
      #TODO - function before Activity.create! then mention create is not valid..so going with less optimal way
      params[:text] = Mention.create_mentions(params[:text], obj)


      #Add activity to params hash for hub creation
      params[:activity_hash] = obj.id

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

    if !params[:location_hash].nil?
      hubs_hash[:location_id] = params[:location_hash]
    end

    if !params[:entity_hash].nil?
      params[:entity_hash].each do |key, value|
        #hubs_hash[:entity_name] = key
        hubs_hash[:entity_id] = value
        Hub.create!(hubs_hash)
      end
    else
      Hub.create!(hubs_hash)
    end

    obj = Activity.where(:id => params[:activity_hash]).first
    obj.update_attributes(:activity_text => params[:text])
#    puts obj.inspect
#    puts obj.activity_text

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
     if !params[:entity_hash].nil?
       params[:text] = mark_entities(params[:text],params[:entity_hash])
     end

     create_hub_entries(params)

     #TODO Create_Documents

     Rails.logger.error("Activity => PostProcActivity Enrich =>  #{params.to_s}")
  end
   handle_asynchronously :post_proc_activity
  end

end
