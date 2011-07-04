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


     def process_filter(filter)
       h = {}
       if !filter[:word_id].blank?
         h[:activity_word_id] = filter[:word_id]
       end
       if !filter[:location_id].blank?
         h[:location_id] = filter[:location_id]
       end
       if !filter[:entity_id].blank?
         h[:entity_id] = filter[:entity_id]
       end
       h
     end
     #get the user ids list based on the scope ===
     #whether current user and visited is same or different
     # return hash of user ids  ids => user_objects
     def process_scope (scope, visited_user_id)

        user_ids = {}

        user = User.where(:id =>  visited_user_id).first

        if user.nil?
          return nil
        end

        case scope
          when 0  #only user
            user_ids[user.id] = user
          when 1 #only friends
            users = user.get_contacts
            users.each do |attr|
              user_ids[attr.id] = attr
            end
          when 2  #friends and user
            users = user.get_contacts
            user_ids[user.id] = user
            users.each do |attr|
              user_ids[attr.id] = attr
            end
          else
            Rails.logger.error("Activity => get_snapshot => wrong scope")
            return nil
        end
       user_ids
     end

    #sort_order => 1 (lexicographical)
    #sort_order => 2 (based on updated)
    #returns hash of : {:name => "eating" ,:id => 123 , :count => 2}
    def get_user_activities(user_id, sort_order)

      h = Activity.where(:author_id => user_id, :parent_id => nil).group(:activity_word_id, :activity_name).
          order("MAX(updated_at) < DESC").count
      word_hash = []

      h.each do |k,v|
        word_hash << {:name => k[1], :id => k[0], :count => v}
      end

      if !sort_order.blank?  and sort_order == 1
        word_hash = word_hash.sort {|x, y| x[:name] <=> y[:name] }
      end
      word_hash
    end

    #sort_order => 1 (lexicographical)
    #sort_order => 2 (based on updated)
    #returns hash of : "eating" => {:entity_id => 123 , :count => 2}
    def get_user_entities(user_id, sort_order)

      user = User.where(:id => user_id).first
      if user.blank?
        return {}
      end
      h = user.entities.group(:entity_id, :entity_name).count
      entity_hash = []

      h.each do |k,v|
        entity_hash <<  {:name => k[1],:id => k[0], :count => v}
      end

      if !sort_order.blank?  and sort_order == 1
        entity_hash = entity_hash.sort {|x, y| x[:name] <=> y[:name] }
      end
      entity_hash
    end
    #sort_order => 1 (lexicographical)
    #sort_order => 2 (based on updated)
    #returns: array of [:id => 123,
    #location_data => :type => 1, :url => loc.location_url, :name => loc.location_name}
    #                                                      OR
    #                                  , :count => 2}
    def get_user_locations(user_id, sort_order)

      h = Activity.where(:author_id => user_id, :parent_id => nil).group(:base_location_id, :base_location_data).
          order("MAX(updated_at) < DESC").count

      location_hash = []

      h.each do |k,v|
        k[1][:id] = k[0]
        k[1][:count] = v
        location_hash <<  k[1]
      end

      if !sort_order.blank?  and sort_order == 1
        location_hash = location_hash.sort {|x, y| x[:name] <=> y[:name] }
      end
      location_hash
    end

    #always current_user's id (logged in)
    def get_related_friends(user_id, filter = {})

      friend_objs = {}
      user = User.where(:id => user_id).first

      if user.nil?
        return {}
      end

      users = user.get_contacts
      users.each do |attr|
        friend_objs[attr.id] = attr
      end
      h = {}
      h = process_filter(filter)
      h[:user_id] = friend_objs.keys

      h = Hub.where(h).group(:user_id).order("MAX(updated_at) DESC").count

      friends = []
      h.each do |k,v|
        friends << {:id => friend_objs[k].id, :name => friend_objs[k].full_name,
                    :image => friend_objs[k].photo_small_url}
      end
      friends
    end

    def get_related_entities(user_id, filter = {})

      user = User.where(:id => user_id).first

      if user.nil?
        return {}
      end

      h = {}
      h = process_filter(filter)
      h[:user_id] = user_id

      h = Hub.where(h).group(:entity_id).order("MAX(updated_at) DESC").count
      e = Entity.where(:id => h.keys).group(:entity_id, :entity_name).order("MAX(updated_at DESC").count

      entity_hash = []
      e.each do |k,v|
        entity_hash << {:id => k[0], :name => k[1]}
      end
      entity_hash
    end

    def get_related_locations(user_id, filter = {})
      user = User.where(:id => user_id).first

      if user.nil?
        return {}
      end

      h = {}
      h = process_filter(filter)
      h[:user_id] = user_id

      h = Hub.where(h).group(:activity_id).order("MAX(updated_at) DESC").count
      l = Activity.where(:id => h.keys).group(:base_location_id, :base_location_data).order("MAX(updated_at DESC").count

      location_hash = []
      l.each do |k,v|
        k[1][:id] = k[0]
        location_hash << k[0]
      end
      location_hash
    end
    #params => {:user_id => visited_user_id
    #           :current_user => logged in user
    #           :scope => 0(only users data) or 1(only friends data)
    #           :offset =>  "2011-07-01T07:28:56Z"  ISO8601  #time from which summary needed
    def board (params)

      #if logged in user is not same as visited user => no freind data is returned
      if params[:current_user].id !=  params[:user_id]
        if params[:scope] != 0
          return {}
        end
      end

      user_ids = process_scope(params[:scope], params[:user_id])
      puts  user_ids.inspect

      a = Activity.includes(:campaigns, :documents).where(:author_id => params[:user_id], :parent_id => nil).
          order("updated_at DESC").limit(AppConstants.stream_max_count ).all

      # TODO Add Campaigns to each activity
      # TODO Add user name and photograph Id to each activity

       h = Hash[*a.collect { |v|
                [v, v.subtree.from_depth(1).arrange]
              }.flatten]
      puts h
    end

    #params => {:user_id => visited_user_id
    #           :current_user => logged in user
    #           :scope => 0(only users data) or 1(only friends data)
    #           :offset =>  "2011-07-01T07:28:56Z"  ISO8601  #time from which summary needed

    def get_snapshots(params)
      json = []
      words = []


      #if logged in user is not same as visited user => no freind data is returned
      if params[:current_user].id !=  params[:user_id]
        if params[:scope] != 0
          return json
        end
      end

      user_ids = process_scope(params[:scope],  params[:user_id])
      if user_ids.nil?
        return json.to_json
      end


      #get the update time sent by the client
      params[:order].nil? ? offset = Time.now : offset = params[:order].to_time
      puts offset

      json_keys = {}
      selected_words = []
      selected_users = []
      index = 0

      Activity.where(:author_id => user_ids.keys, :parent_id => nil).group(:author_id, :activity_word_id, :activity_name).
            having(["MAX(updated_at) < ?", offset]).order("MAX(updated_at) DESC").count.map do |k,v|

         #used to track a valid combination, data counts for that combination and tracking indexes
         json_keys[{:user_id => k[0], :activity_word_id => k[1]}] = {:index => index, :documents => 0, :friends => 0,
                                                                     :entities => 0, :locations => 0, :text => 0}
         #Actual data based on order
         json[index] = {  :word => {:id => k[1], :name => k[2]},
                          :count => v,
                          :user => {:id => k[0], :name => user_ids[k[0]].full_name,
                                     :image => user_ids[k[0]].photo_small_url},
                          :documents => [],
                          :entities => [],
                          :locations => [],
                          :friends => [],
                          :text => [],
                          :updated_at => ""
                       }

         selected_words << k[1]
         selected_users << k[0]
         index = index + 1
         break if index  == AppConstants.summary_word_count
      end
      selected_words =  selected_words.uniq
      selected_users = selected_users.uniq

      puts json.inspect
      puts json_keys.inspect
      puts selected_words
      puts selected_users

      a = Hub.count
      puts a
      index = 0
      #updated_at is not needed in where.. pick the latest relevant document
      d = Document.where(:owner_id => selected_users, :activity_word_id => selected_words,:updated_at.lt => offset).
          order("updated_at DESC").all.map do |attr|
           h = json_keys[{:user_id => attr.owner_id, :activity_word_id => attr.activity_word_id}]
           if h.nil? or h[:documents] >= AppConstants.summary_document_count
              next
           end
           json[h[:index]][:documents] << {:id => attr.id, :name => attr.document_name,
                                          :type => attr.document_type, :url => attr.document_data.thumb.url}
           h[:documents] = h[:documents] + 1
           index = index + 1
           break if index  == AppConstants.summary_loop_count
      end
      puts "docs"
      puts json.inspect
      puts json_keys.inspect

      index = 0
      #updated_at is not needed in where.. pick the latest relevant entity
      e = Hub.includes(:entity).where(:user_id => selected_users,
              :activity_word_id => selected_words, :entity_id.not_eq => nil).order("updated_at DESC").all.map do |attr|

           h = json_keys[{:user_id => attr.user_id, :activity_word_id => attr.activity_word_id}]
           puts h
           if h.nil? || (h[:entities] >= AppConstants.summary_entity_count)
              puts "no"
              next
           end
           puts "yes"
           json[h[:index]][:entities] << {:id => attr.entity.id, :name => attr.entity.entity_name,
                                          :image => attr.entity.entity_image}
           h[:entities] = h[:entities] + 1
           index = index + 1
           break if index  == AppConstants.summary_loop_count
      end
      puts "entity"
      puts json.inspect
      puts json_keys.inspect
      index = 0
      #updated_at is not needed in where.. pick the latest relevant location
      l = Activity.where(:author_id => selected_users, :activity_word_id => selected_words, :base_location_id.not_eq =>nil).
          order("updated_at DESC").all.map do |attr|
             h = json_keys[{:user_id => attr.author_id, :activity_word_id => attr.activity_word_id}]
             if h.nil?  or (h[:locations] >= AppConstants.summary_location_count)
                next
             end
             lh = attr.base_location_data
             lh[:id] = attr.base_location_id
             json[h[:index]][:locations] << lh
             h[:locations] = h[:locations] + 1
          index = index + 1
          break if index  == AppConstants.summary_loop_count
      end
      puts "location"
      puts json.inspect
      puts json_keys.inspect

      #FRIENDS of current_user (logged in user). Also they should not be relative to time
      #TODO remove this loop.. not needed
      friend_ids = []
      if params[:scope] == 0
        friends = params[:current_user].get_contacts
        friends.each do |attr|
          friend_ids << attr.id
        end
      else
        #This case will always have current user only due to check at top of fucntion
        #Scope other than 0 is allowed only for current user
        friend_ids = user_ids.keys
      end
      puts friends.inspect
      f =  Activity.where(:author_id => friend_ids, :activity_word_id => selected_words).
          group(:author_id, :author_full_name, :author_profile_photo, :activity_word_id).
          order("MAX(updated_at) DESC").count.map do |k,v|

        h = json_keys[{:user_id => k[0], :activity_word_id => k[3]}]

        if h.nil? or (h[:friends] >= AppConstants.summary_friend_count)
          next
        end
        json[h[:index]][:friends] << {:id => k[0], :name => k[1],
                                          :image => k[2]}
        h[:friends] = h[:friends] + 1

      end
      puts "related friends"
      puts json.inspect
      puts json_keys.inspect

      index = 0
      #updated_at is not needed in where.. pick the latest relevant posts
      t = Activity.where(:author_id => selected_users, :activity_word_id => selected_words, :activity_text.not_eq => nil, :parent_id => nil).
          order("updated_at DESC").all.map do |attr|
          h = json_keys[{:user_id => attr.author_id, :activity_word_id => attr.activity_word_id}]
           if h.nil? or (h[:text] >= AppConstants.summary_text_count)
              next
           end
           json[h[:index]][:text] << {:text => attr.activity_text}
           h[:text] = h[:text] + 1
           index = index + 1
           break if index  == AppConstants.summary_loop_count
      end
      puts "text"
      puts json.inspect
      puts json_keys.inspect

      index = 0
      Activity.where(:author_id => selected_users, :activity_word_id => selected_words).group(:author_id,:activity_word_id, :updated_at).
            having(["MAX(updated_at) < ?", offset]).order("MAX(updated_at) DESC").count.map do |k,v|
          h = json_keys[{:user_id => k[0], :activity_word_id => k[1]}]

          if h.nil?
            next
          end

          json[h[:index]][:updated_at] = k[2]
          index = index + 1
          break if index  == AppConstants.summary_word_count
      end
      json
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

