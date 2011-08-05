#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  confirmation_token   :string(255)
#  confirmed_at         :datetime
#  confirmation_sent_at :datetime
#  failed_attempts      :integer         default(0)
#  unlock_token         :string(255)
#  locked_at            :datetime
#  authentication_token :string(255)
#  username             :string(255)
#  show_help            :boolean
#  disable_email        :boolean
#  full_name            :string(255)
#  photo_small_url      :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#  invitation_token     :string(60)
#  invitation_sent_at   :datetime
#  invitation_limit     :integer
#  invited_by_id        :integer
#  invited_by_type      :string(255)
#

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable,:token_authenticatable,
         :lockable,:confirmable , :omniauthable
          #,:devise_create_users

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :full_name

  # relations #
  has_one :profile

  has_many :contacts
  has_many :friends, :foreign_key => :friend_id, :class_name => 'Contact' #these are the friends in the contacts table

  has_many :authentications


##### ALOK changed it  ##########################
  has_many :activities, :foreign_key => :author_id , :dependent => :destroy
  has_many :documents, :foreign_key => :owner_id, :dependent => :destroy

  #CREATE & DESTROY for hub, hub association, mentions, campaigns, entity_ownerships,summaries location_ownerships  will happen from activity create & destroy
  #no explicit create & destroy is called by user for all these
  has_many :summaries #destroy will happen through activity

  has_many :hubs
  has_many :entities, :through => :hubs, :uniq => true
  has_many :locations, :through => :hubs, :uniq => true
  has_many  :activity_words, :through => :hubs, :uniq => true

  has_many :mentions
  has_many :campaigns,:foreign_key => :author_id

  #Though it only removes the user foreign key in entity ownership. But User ID  &  Entities
  # will not be deleted as of now. Only user's docs and activities
  has_many :entity_ownerships, :foreign_key => :owner_id, :dependent => :nullify

  ##### ALOK changes ends here #####################



  # Validations #
  before_validation :strip_fields, :on => :create

  validates :email, :email_format => true
  validates_presence_of :profile, :unless => proc {|user| user.confirmed_at.nil?}

  # profile related api

  def password_required?
    (authentications.empty? || !password.blank?) && super
  end

  def get_pending_request_contacts
    users_list=nil
    friends_id_list = friends.select("user_id").where(:status =>
                                                  Contact.statusStringToKey['New']).map(&:user_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list
  end

  def get_raised_contact_requests_raised
    users_list=nil
    new_friends_id_list = contacts.select("user_id").where(:status =>
                                                  Contact.statusStringToKey['New']).map(&:user_id)

    if !new_friends_id_list.nil? && new_friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", new_friends_id_list )
    end
    return users_list
  end

  def get_contacts
    users_list=nil
    friends_id_list = contacts.select("friend_id").where(:status =>
                                                  Contact.statusStringToKey['Connected']).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list
  end

  def new_contact_request (friend_id)
    Contact.request_new(id, friend_id)
  end

  def accept_a_contact_request (friend_id)
    Contact.accept_new(id, friend_id)
  end

  def reject_a_contact_request(friend_id)
    Contact.reject_new(id, friend_id)
  end

  def disconnect_a_contact(friend_id)
   Contact.delete_contacts_from_both_ends(id, friend_id)
  end


  def get_provider_uids_of_friends(provider, uid_list)
   friends_id_list = contacts.select("friend_id").map(&:friend_id)

   Authentication.all(:select => "uid",:conditions=> ['user_id in (?) and uid in (?)',
                                                       friends_id_list, uid_list]).map(&:uid)

  end


  def get_uid_follow_status(provider, uid_list)

    auths = Authentication.all(:select => "uid, user_id", :conditions=> ['uid in (?)',
                                                                            uid_list])

    #TODO : Fix this properly
    uid_based_list = Hash.new
    user_id_list = Hash.new
    auths.each do |auth|
         uid_based_list[auth.uid] = {:user_id => auth.user.id, :following => 0}
         user_id_list[auth.user_id] = auth.uid
    end

    friends_list = Contact.all(:select => "friend_id", :conditions=> ['user_id = ? and friend_id in (?)',
                                                                            id,
                                                                            user_id_list.keys]).map(&:friend_id)



    friends_list.each do |friend|
         uid_based_list[user_id_list[friend]][:following] = 1
    end

    puts  uid_based_list
    return uid_based_list

  end



  def follow(friend_id)
    Contact.follow(id, friend_id)
  end

  def unfollow(friend_id)
    Contact.unfollow(id, friend_id)
  end

  def followers_count()
     friends.count()
  end

  def followings_count()
    contacts.count()
  end

  def check_follower(friend_id)
    contact=Contact.find_by_user_id_and_friend_id(id, friend_id)
    if contact.nil?

      return false
    else
      return true
    end
  end

  def get_followers
    users_list = []
    friends_id_list = Contact.select("user_id").where(:friend_id => id).map(&:user_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list ).index_by(&:id)

      followings_as_well_list = Contact.select("friend_id").where("friend_id in (?)
                                                                and user_id = ?",
                                                                friends_id_list,
                                                                id ).map(&:friend_id)

      followings_as_well_list.each { |user_id|
                                      puts "USER ID => " + user_id.to_s
                                      unless users_list[user_id].nil?
                                        users_list[user_id]["following"] = 1
                                      end
                                    }


    end
    return users_list
  end

  def get_followings
    users_list=[]
    friends_id_list = Contact.select("friend_id").where(:user_id => id).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list

  end

  def self.search(search)
    if search
      select("id,full_name,photo_small_url").order("full_name").
                  where( ['users.email = ?
                            or full_name ILIKE ?', search,
                                                   "%#{search}%"])
    else
      select("id,full_name,photo_small_url").order("full_name")
    end
  end


  #sort_order => 1 (lexicographical)
  #sort_order => 2 (based on updated)
  #returns hash of : {:name => "eating" ,:id => 123 }
  def get_user_activities( sort_order)

     h = Activity.where(:author_id => self.id).group(:activity_word_id, :activity_name).
         order("MAX(updated_at)  DESC").count

     word_hash = []

     h.each do |k,v|
        word_hash << {:name => k[1], :id => k[0]}
     end

     if !sort_order.blank?  and sort_order == 1
        word_hash = word_hash.sort {|x, y| x[:name] <=> y[:name] }
     end
        word_hash
     end

  #sort_order => 1 (lexicographical)
  #sort_order => 2 (based on updated)
  #returns hash of : {:name => "pizza" , :id => 123, :image =>  }
  def get_user_entities(sort_order)

    entity_hash = []

    h = entities.order("updated_at DESC").each do |attr|
      entity_hash <<  {:name => attr.entity_name,:id => attr.id, :image =>AppConstants.entity_base_url + attr.entity_image}
    end

    if !sort_order.blank?  and sort_order == 1
      entity_hash = entity_hash.sort {|x, y| x[:name] <=> y[:name] }
    end
    entity_hash
  end


  include TextFormatter

  #sort_order => 1 (lexicographical)
  #sort_order => 2 (based on updated)
  #returns: array of :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
  #                                                      OR
  #                 :type => 2, :name => "John's home"]

  def get_user_locations( sort_order)

    lh = []

    h = locations.order("updated_at DESC").each do |attr|
      l = location_hash(attr)
      l[:id] = attr.id
      lh <<  l
    end

    if !sort_order.blank?  and sort_order == 1
      lh = lh.sort {|x, y| x[:name] <=> y[:name] }
    end

    lh
    end

  #always current_user's id (logged in)
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #returns array of {:id => 123, :name => "samarth" , :image => "images/234"}
  def get_related_friends(filter = {})

    friend_objs = {}

    users = get_followings
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

  #user_id => 123
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #returns array of {:id => 123, :name => "pizza" , :image => "entity/234"}
  def get_related_entities(user_id, filter = {})
    h = {}
    h = process_filter(filter)
    h[:user_id] = user_id

    h = Hub.where(h).group(:entity_id).order("MAX(updated_at) DESC").count
    e = Entity.where(:id => h.keys).group(:id, :entity_name, :entity_image).order("MAX(updated_at) DESC").count

    entity_hash = []

    e.each do |k,v|
      entity_hash << {:id => k[0], :name => k[1], :image  => AppConstants.entity_base_url + k[2]}
    end

    entity_hash
  end

  #user_id => 123
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #returns array of :id => 1234, :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :id => 1234, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
  #                                                      OR
  #                 :id => 1234, :type => 2, :name => "John's home"
  def get_related_locations(user_id, filter = {})
    h = {}
    h = process_filter(filter)
    h[:user_id] = user_id

    lh = []

    h = Hub.where(h).group(:location_id).order("MAX(updated_at) DESC").count

    Location.where(:id => h.keys).order("updated_at DESC").all.each do |attr|
      l = location_hash(attr)
      l[:id] = attr.id
      lh <<  l
    end

    lh
  end


  #INPUT => AN array of activity_ids for which enriched is false
  def get_enriched_activities(activity_ids)
    en = []

    Activity.includes(:author, :base_location).where(:id => activity_ids, :enriched => true).all.each do |attr|
      a = format_activity(attr)
      en << a
    end

    puts en
    en
  end


  #Removes all occurrences of an entity from an activity
  #INPUT => activity_id => 123, entity_id => 234
  #OUTPUT => Activity Blob
  def remove_entity_from_activity(activity_id, entity_id)

    activity = Activity.where(:id => activity_id).first

    if !activity.activity_text.blank?
      activity.activity_text = unlink_an_entity(activity.activity_text,  entity_id)
      activity.update_attributes(:activity_text => activity.activity_text)
    end

    activity = format_activity(activity)
    activity

  rescue => e
    Rails.logger.error("User => remove_entity_from_activity => failed => #{e.message}")
    {}
  end

  # INPUT
  #    :word => activity word or phrase in activity box  [MANDATORY]
  #    :text =>   ""entity box + @@ + location box" or nil [OPTIONAL]
  #    :location => {
  #                  :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
  #                                      OR
  #                  :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
  #                                      OR
  #                  :unresolved_location =>{:unresolved_location_name => "xyxzw"}
  #                                      OR
  #                                     nil
  #                 } [OPTIONAL]
  #
  #    :documents => [{:caption => "abcd", :thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",
  #                   :url => "https://s3.amazonaws.com/xyz.jpg" } ]#caption and thumb_url is optional in document
  #                  [OPTIONAL]
  #
  #    :campaign_types => 1 to 7  #  Need to set by client. At present each bit represent on campaign type.
  #                         bit 0 => like, bit 1=>support,bit 2=> :join  #defualt is 1 ( like).
  #                        Check CAMPAIGN_TYPES in constant.yml
  #                        [MANDATORY]
  #
  #    :status => 0 or 1   # 0 => saved, 1 => public share, #default => 1
  #                        #Need to set by client.
  #                        Check STATUS in constant.yml
  #                        [MANDATORY]
  #
  #    :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
  #                      or custom email or mobile number #defualt is actwitty. Need to set by client.
  #                      Check SOURCE_NAME in constant.yml
  #                      [MANDATORY]
  #
  #    :sub_title => "hello sudha baby" or nil. Need to set by client.
  #                      [OPTIONAL]
  #
  #    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
  #                     [MANDATORY]
  #
  # OUTPUT => {:post=>{
  #              :text=>"pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
  #              :word=>{:id=>836, :name=>"eating"},
  #              :user=>{:id=>661, :full_name=>"lemony1 lime1",:photo=>"images/id_1"},
  #              :id=>1356,
  #              :time=>Thu, 14 Jul 2011 05:42:20 UTC +00:00},
  #              :enriched=>false,
  #              :campaign_types => 1 to 7 or nil #( as set by client) at present each bit represent on campaign type. bit 0 => like, bit 1=>support,bit 2=> :join
  #              :sub_title => "hello sudha baby" or nil
  #              :source_name => "actwitty"
  #              :status => 0 or 1 or 2 ( as set by client)
  #              :location=>{:type=>2, :lat=>#<BigDecimal:62b1fc8,'0.2345E2',18(18)>, :long=>#<BigDecimal:62b1de8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>315}
  #             }

  def create_activity(params={})

    params[:activity]= params[:word]
    params[:author_id] = self.id

    obj = Activity.create_activity(params)
    if obj.blank?
      return {}
    end
    a = format_activity(obj)
    puts a
    a

  end

  #INPUT = Array of activity ids
  #OUTPUT =
  def get_all_activity(activity_ids)
    array = []
    index = 0
    hash = {}
    Activity.includes(:author, :base_location).where(:id => activity_ids).order("updated_at DESC").all.each do |attr|
      hash[attr.id] = index
      array << format_activity(attr)
      array[index][:comments] = {:count => attr.comments.size, :array => [] }
      array[index][:documents]= {:count => attr.documents.size, :array => []}
      array[index][:campaigns]= []
      index = index + 1
    end

    #Commenting this whole blob. As per New UX only count is needed
#    Comment.includes(:author).where(:activity_id => activity_ids).all.each do |attr|
#       h = format_comment(attr)
#       array[hash[attr.activity_id]][:comments][:array] << h[:comment]
#    end

    Document.where(:activity_id => activity_ids).all.each do |attr|
       h = format_document(attr)
       array[hash[attr.activity_id]][:documents][:array] << h[:document]
    end


    campaign_hash = {}
    temp_hash = {}
    index = 0
    #Get all the campaigns grouped for those activity
    Campaign.where(:activity_id => activity_ids).group(:activity_id, :name).count.each do |k,v|

       h = {:name => k[1], :count => v , :user => false}
       campaign_hash[k[0]].nil? ? campaign_hash[k[0]] = [h] : campaign_hash[k[0]] << h
       temp_hash[{:id => k[0], :name => k[1]}] = campaign_hash[k[0]].count -1

    end

    #Get all the campaigns grouped for those activity by current user
    #Set user_id if user has acted on  campaign
    Campaign.where(:activity_id => activity_ids, :author_id => self.id).group(:activity_id, :name).count.
        each do |k,v|
        if !campaign_hash[k[0]].nil?
          campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user] =  true
          campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user_id] =  self.id
       end
    end


    campaign_hash.each do |k,v|
      v.each do |entry|
       array[hash[k]][:campaigns] << entry
      end
    end
    array
  end

  #INPUT
  #:user_id => 123
  #:friend => true/false
  #:filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT
  #[
  # {
  # :post=>
  #  {
  #   :id=>11, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
  #   :word=>{:id=>10, :name=>"eating"}, :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
  #   :text=>"<a href=# value=11 class=js_activity_entity>pizza</a>  with <a href=# value=5 class=js_activity_mention>Alok Srivastava</a>",
  #   :enriched=>true, :summary_id=>9, :sub_title=>nil, :source_name=>"actwitty", :status=>1, :campaign_types=>1
  #  },
  # :location=>
  #  {
  #   :type=>2, :lat=>#<BigDecimal:9de78e0,'0.2345E2',18(18)>, :long=>#<BigDecimal:9de77c8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>8
  #  },
  #  :comments=>
  #  {
  #   :count=>5, :array=>[]
  #  },

  ## COMMENT - In documents these fields are added and they will be returned too in streams
  ## COMMENT - :caption=> "abcds", :source_name=>"actwitty", :status=>1, :uploaded=>true
  ## COMMENT  uploaded field tells that document is uploaded doc or mentioned document. It is boolean
  #
  # :documents=>
  #  {
  #   :count=>2,
  #   :array=>[
  #           {:id=>1, :name=>"xyz.jpg", :url=>"https://s3.amazonaws.com/xyz.jpg", :caption=>nil, :source_name=>"actwitty", :status=>1, :uploaded=>true},
  #           {:id=>2, :name=>"abc.jpg", :url=>"https://s3.amazonaws.com/abc.jpg", :caption=>nil, :source_name=>"actwitty", :status=>1, :uploaded=>true}
  #           ]
  #  },
  # :campaigns=>
  #     [{:name=>"support", :count=>1, :user=>true, :user_id=>5}, {:name=>"like", :count=>2, :user=>false}]
  #}
  #]
  def get_stream(params ={})

    if params[:user_id] == self.id
      if params[:friend] == true
        Rails.logger.debug("[MODEL] [USER] [GET STREAM] Requesting friends stream")
        #user =  contacts.select("friend_id").where(:status => Contact.statusStringToKey['Connected']).map(&:friend_id)
        user = Contact.select("friend_id").where(:user_id => self.id).map(&:friend_id)
        user.blank? ? user = [self.id] : user << self.id
      else
        Rails.logger.debug("[MODEL] [USER] [GET STREAM] Requesting self stream #{self.inspect}")
        user = self.id
      end
    else
        Rails.logger.debug("[MODEL] [USER] [GET STREAM] Foreign user trying to access #{self.inspect}")
        user = params[:user_id]
        params[:friend] = false
    end

    h = {}

    #use HUB only if entity filter is there
    if !params[:filter].nil? && !params[:filter][:entity_id].blank?
      h = process_filter(params[:filter])
      h[:user_id] = user
      h[:updated_at.lt] = params[:updated_at].to_time.utc if !params[:updated_at].blank?
      activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count
    else
      h = process_filter(params[:filter])
      h[:author_id] = user
      h[:updated_at.lt] = params[:updated_at].to_time.utc if !params[:updated_at].blank?
      activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count
    end

    puts activity.keys
    array = get_all_activity(activity.keys)
    puts array.to_json
    array
  end

  #INPUT
  #user_id => 123 #If same as current use then mix streams with friends other wise only user
  #:friend => true/false
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT
  #[
  # {:id=>24, :word=>{:word_id=>44, :name=>"eating"}, :time=>Thu, 21 Jul 2011 14:44:26 UTC +00:00,
  # :user=>{:id=>39, :full_name=>"lemony3 lime3", :photo=>"images/id_3"}, :count=>1, :locations=>[],
  # :documents=>[{:id=>30, :name=>"ddd.jpg", :url=>"https://s3.amazonaws.com/ddd.jpg", :thumb_url=>"https://s3.amazonaws.com/ddd_thumb.jpg"},
  # {:id=>29, :name=>"ccc.jpg", :url=>"https://s3.amazonaws.com/ccc.jpg", :thumb_url=>"https://s3.amazonaws.com/ccc_thumb.jpg"}],
  # :entities=>[{:id=>24, :name=>"rahul dravid", :image=>"/m/02cb7_j"}],
  # :recent_text=>["burger at <a href=/entities/24 class=\"activity_entity\">rahul dravid</a>"],
  # :friends=>[{:id=>38, :full_name=>"lemony2 lime2", :photo=>"images/id_2"}]
  # }
  #]
  def get_summary(params)
    h = {}
    user = nil
    if params[:user_id] == self.id
      if params[:friend] == true
        Rails.logger.debug("[MODEL] [USER] [GET SUMMARY] Requesting friends summary")
        #user =  contacts.select("friend_id").where(:status => Contact.statusStringToKey['Connected']).map(&:friend_id)
        user = Contact.select("friend_id").where(:user_id => self.id).map(&:friend_id)
        user.blank? ? user = [self.id] : user << self.id
      else
        Rails.logger.debug("[MODEL] [USER] [GET SUMMARY] Requesting self summary #{self.inspect}")
        user = self.id
      end
    else
        Rails.logger.debug("[MODEL] [USER] [GET SUMMARY] Foreign user trying to access #{self.inspect}")
        user = params[:user_id]
        params[:friend] = false
    end

    documents= {}
    activities = {}
    locations = {}
    entities = {}
    friends ={}
    summaries = []
    index = 0

    h[:updated_at.lt] = params[:updated_at].to_time.utc if !params[:updated_at].blank?
    h[:user_id] = user

    summary = Summary.includes(:user).where(h).limit(AppConstants.max_number_of_summmary).order("updated_at DESC").
        all.each do |attr|

        summaries[index] ={:id => attr.id,
                             :word => {:word_id => attr.activity_word_id, :name => attr.activity_name},
                             :time => attr.updated_at,
                             :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
                             :count => attr.activities.size,
                             :locations => [], :documents => [], :entities => [], :recent_text => [], :friends => []
                              }
        attr.location_array.each {|idx| locations[idx].nil? ? locations[idx] = [index] : locations[idx] <<  index }
        attr.document_array.each {|idx| documents[idx].nil? ? documents[idx] = [index] : documents[idx] <<  index }
        attr.entity_array.each {|idx| entities[idx].nil? ? entities[idx] = [index] : entities[idx] <<  index }
        attr.activity_array.each {|idx| activities[idx].nil? ? activities[idx] = [index] : activities[idx] <<  index }

        #creates the hash mapping words to respective index
        friends[attr.activity_word_id].nil? ? friends[attr.activity_word_id] = [index] : friends[attr.activity_word_id] << index
        index = index + 1
      end


    Document.where(:id => documents.keys).order("updated_at DESC").all.each do|attr|
      h = format_document(attr)
      documents[attr.id].each do |idx|
        summaries[idx][:documents] << h[:document]
      end
    end

    documents = {}
    Location.where(:id => locations.keys).order("updated_at DESC").all.each do|attr|
      h = location_hash(attr)
      h[:id] = attr.id
      locations[attr.id].each do |idx|
        summaries[idx][:locations] << h
      end
    end

    locations={}
    Entity.where(:id => entities.keys).order("updated_at DESC").all.each do|attr|
      entities[attr.id].each do |idx|
        summaries[idx][:entities] << {:id => attr.id, :name => attr.entity_name, :image =>
            AppConstants.entity_base_url + attr.entity_image }
      end
    end
    entities ={}

    Activity.where(:id => activities.keys).order("updated_at DESC").all.each do|attr|
      activities[attr.id].each do |idx|
        summaries[idx][:recent_text] << attr.activity_text
      end
    end
    activities = {}

    #FETCH RELATED FRIEND

    #friends will only be fetched current use == visited user
    if params[:friend] == true
      #user's friends are already populated in user ARRAY
      user.delete(self.id)
    else
      #other wise get the user's followings and populate the related followings
      user = Contact.select("friend_id").where(:user_id => self.id).map(&:friend_id)
    end

    Summary.includes(:user).where(:activity_word_id => friends.keys, :user_id => user).
          group(:user_id, :activity_word_id ).count.each do |k,v|
      activities[k[0]] = k[1]
    end

    User.where(:id => activities.keys).all.each do |attr|
      # activities[attr.id] => activity_word_id                                                  get
      friends[activities[attr.id]].each do |idx|

        #dont show a friend in his own summary as related friend
        if summaries[idx][:user][:id] != attr.id

          if summaries[idx][:friends].size < AppConstants.max_number_of_a_type_in_summmary
            summaries[idx][:friends] << {:id => attr.id , :full_name => attr.full_name, :photo => attr.photo_small_url}
          end

        end

      end

    end
    #FETCHING RELATED FRIEND -- DONE
    summaries
  end
  


  #INPUT
  #activity_id => 123
  def remove_activity(activity_id)
    a = Activity.where(:id => activity_id, :author_id => self.id).first
    return {} if a.blank?
    a.destroy
    a
  end

  #COMMENT => To Create a campaign
  #INPUT =>
  # :name => "like"
  # :value => any integer index .. for example like =1 super-like  = 2 etc . AT PRESENT not USED THOUGH
  # :activity_id => 234
  #                OR
  # :entity_id => 123
  #                OR
  # :location_id => 123}
  #                 OR
  # :comment_id => 234}
  #
  #OUTPUT => { :name => "like", :count => 23, :user => true, :user_id => 355}  #user_id is only present if :user => true
  #                                    OR
  #          {:name => "support", :count => 23, :user => false}
  def create_campaign(params = {})
    params[:author_id] = self.id

    obj = Campaign.create_campaign(params)
    if obj.blank?
      return {}
    end
    params.except!(:value,:author_id, :father_id )

    h= Campaign.where( params).group(:name).count

    ch = {}
    ch[:count] = h.values[0].nil? ? 0 : h.values[0]

    ch[:name] = params[:name]

    ch[:user_id] = self.id
    ch[:user] = true

    puts ch
    ch
  end

  #COMMENT => To Remove a campaign. Only for the current_user. Output is remaining count
  #INPUT => campaign_id => 1234
  #OUTPUT => { :name => "like", :count => 23, :user => false}  #user will always be false as user can only delete his campaign
                                                               #which is unique in scope of activity and campaign name
  def remove_campaign(campaign_id)

    campaign = Campaign.where(:id => campaign_id, :author_id => self.id).first

    return {} if campaign.nil?

    hash = campaign.attributes.except("value", "author_id", "father_id", "id", "created_at", "updated_at")

    campaign.father.destroy
    #group by campaign name for remaining count
    h= Campaign.where(hash).group(:name).count

    ch = {}

    #user will always be false as user can only delete his campaign
    #which is unique in scope of activity and campaign name
    ch[:user] = false
    ch[:count] = h.values[0].nil? ? 0 : h.values[0]
    ch[:name] = hash["name"]

    puts ch

    ch

  end

  #COMMENT => All types of campaigns of an activity
  #INPUT =>
  # :activity_id => 234
  #                OR
  # :entity_id = 123
  #                OR
  # :location_id => 123
  #                 OR
  # :comment_id =>  234}
  #OUTPUT => [
  #           { :name => "like", :count => 23, :user => true, :user_id => 355},  #user_id is only present if :user => true
  #           {:name => "support", :count => 23, :user => false}
  #          ]

  def get_all_campaign(params = {})
    hash = {}
    campaign = []
    all_campaigns = Campaign.where(params).group(:name).count

    params[:author_id] = self.id
    user_campaigns = Campaign.where(params).group(:name).count

    all_campaigns.each do |k,v|
      user_campaigns.has_key?(k) ? user = true : user = false
      hash = {:name => k, :count => v, :user => user }
      hash[:user_id] = self.id if user == true
      campaign << hash
    end

    puts campaign
    campaign
  end

  #COMMENT => Get users in a campaign
  #INPUT =>
  # :name =>  "like" # or support or join etc
  # :activity_id => 234
  #                OR
  # :entity_id => 123
  #                OR
  # :location_id => 123
  #                 OR
  # :comment_id =>  234}
  #OUTPUT =>[
  #           { :id => 128, :full_name => "Abc Saxena", :photo => "/images/actwitty/default_user.gif" },
  #           { :id => 129, :full_name => "BBc Saxena", :photo => "/images/actwitty/default_user.gif" }
  #         ]
  def get_users_of_campaign(params)
    user = []
    Campaign.includes(:author).where(params ).order("updated_at DESC").all.each do |attr|
      user << {:id => attr.author.id, :full_name => attr.author.full_name, :photo => attr.author.photo_small_url }
    end
    user
  end


  #COMMENT => to get a single activity of a user.
  #INPUT => activity_id = 123, :author_id => 234, :text => "helllo"
  #OUTPUT =>  {:comment=>{:id=>173, :user=>{:id=>747, :full_name=>"lemony2 lime2", :photo=>"images/id_2"},
  #                       :text=>"hello ", :time=>Thu, 14 Jul 2011 14:13:29 UTC +00:00}}
  def create_comment(params = {})
    params[:author_id] = self.id

    obj = Comment.create_comment(params)
    if obj.blank?
      return {}
    end
    a = format_comment(obj)
    puts a
    a
  end

  #COMMENT => to remove comment of current user
  #INPUT => comment_id =. 1234
  #OUTPUT =>  {:activity_id => 2345, :comment_count => 23}
  def remove_comment(comment_id)

    comment = Comment.where(:id => comment_id, :author_id => self.id).first

    activity_id = comment.activity_id

    return {} if comment.nil?

    comment.destroy

    #group by campaign name for remaining count
    h= Comment.where(:activity_id => activity_id).count

    ch = {}
    ch[:activity_id] = activity_id
    ch[:comment_count] = h
    puts ch

    ch
  end
  #INPUT => activity_id => 123
  #OUTPUT =>  [{:comment=>{:id=>173, :user=>{:id=>747, :full_name=>"lemony2 lime2", :photo=>"images/id_2"},
  #                       :text=>"hello ", :time=>Thu, 14 Jul 2011 14:13:29 UTC +00:00}}]
  def load_all_comment(activity_id)
    array = []
    Comment.includes(:author).where(:activity_id => activity_id).each do |attr|
      a = format_comment(attr)
      array << a
    end
    puts array
    array
  end

  # private methods
  private


  def strip_fields
    if self.email.present?
       self.email.strip!
       self.email.downcase!
    end
    if self.username.present?
      self.username.strip!
      self.username.downcase!
    else
       self.username = self.email
    end
  end


  def process_filter(filter)


    return {} if filter.nil?

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



end

# == Schema Information
#
# Table name: users
#
#  id                   :integer         not null, primary key
#  email                :string(255)
#  encrypted_password   :string(128)     default("")
#  reset_password_token :string(255)
#  remember_created_at  :datetime
#  sign_in_count        :integer         default(0)
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  confirmation_token   :string(255)
#  confirmed_at         :datetime
#  confirmation_sent_at :datetime
#  failed_attempts      :integer         default(0)
#  unlock_token         :string(255)
#  locked_at            :datetime
#  authentication_token :string(255)
#  username             :string(255)
#  show_help            :boolean
#  disable_email        :boolean
#  full_name            :string(255)
#  photo_small_url      :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#  invitation_token     :string(60)
#  invitation_sent_at   :datetime
#  invitation_limit     :integer
#  invited_by_id        :integer
#  invited_by_type      :string(255)
#

