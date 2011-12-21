require 'thread'
require "query_manager"

class Activity < ActiveRecord::Base

  include  ActionView::Helpers

  serialize       :social_counters_array, Array

  belongs_to      :author, :class_name => "User" #, :touch => true user is touched through summary
  belongs_to      :summary, :touch => true, :counter_cache => true, :dependent => :destroy

  belongs_to      :activity_word #, :touch => true user is touched through summary

  belongs_to      :base_location, :class_name => "Location"

  belongs_to      :web_link

  #destroy will happen from activity
  has_many         :hubs, :dependent => :destroy

  has_many         :entities, :through => :hubs
  has_many         :locations,:through => :hubs

  has_many         :mentions, :dependent => :destroy #destroy will happen from activity

  has_many         :campaigns, :dependent => :destroy, :order => "updated_at DESC"

  has_many         :comments, :dependent => :destroy, :order => "updated_at DESC"

  has_many         :tags, :dependent => :destroy, :order => "updated_at DESC"

  # documents have life time more than activity.
  # Documents will be removed from activity destroy as special handling is needed rather than usual destroy
  # UPDATE 03/07/2011 - Now we are destroying  document with post.. so we are putting dependent destroy
  has_many        :documents,  :dependent => :destroy, :order => "updated_at DESC"

  #:destroy is not causing circular effect as there is father "delete" in campaign
  has_one         :father_campaign, :foreign_key => :father_id, :class_name => "Campaign", :dependent => :destroy

   #:destroy is not causing circular effect as there is father "delete" in comment
  has_one         :father_comment, :foreign_key => :father_id, :class_name => "Comment", :dependent => :destroy

  has_many        :social_counters, :dependent => :destroy

  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id

  validates_existence_of  :summary_id, :allow_nil => true
  validates_existence_of  :base_location_id, :allow_nil => true

  validates_presence_of   :activity_name,  :campaign_types, :source_name, :status

  validates_length_of     :activity_name,  :in => 1..AppConstants.activity_name_length

  validates_length_of     :source_name,    :in => 1..AppConstants.source_name_length

  validates_length_of     :sub_title,      :maximum => AppConstants.sub_title_length, :unless => Proc.new{|a| a.sub_title.nil?}

  validates_length_of     :activity_text, :maximum => AppConstants.activity_text_length, :unless => Proc.new{|a| a.activity_text.nil?}

  validates_uniqueness_of :source_msg_id, :scope => [:source_name, :author_id], :unless => Proc.new {|a| a.source_msg_id.nil?}

  before_save             :sanitize_data

  after_destroy           :rebuild_analytics

  after_save              :update_analytics

  public

    def sanitize_data

      Rails.logger.info("[MODEL] [ACTIVITY] [sanitize_data] - Before Save entering")

      self.activity_text = sanitize(self.activity_text, :tags => AppConstants.sanity_tags, :attributes => AppConstants.sanity_attributes) if !self.activity_text.blank?
      self.activity_name = sanitize(self.activity_name) if !self.activity_name.blank?
      self.sub_title = sanitize(self.sub_title) if !self.sub_title.blank?

      Rails.logger.debug("[MODEL] [ACTIVITY] [sanitize_data]- Before Save leaving")

    end

    def rebuild_analytics
      Rails.logger.info("[MODEL] [ACTIVITY] [rebuild_analytics] - After Destroy entering")

      if !self.summary_id.blank?
#        s = Summary.where(:id => self.summary_id).first
#        s.rebuild_a_summary if !s.nil?

         fields = create_fields_for_analytics
         update_analytics(fields)
      end

      Rails.logger.info("[MODEL] [ACTIVITY] [rebuild_analytics] - After Destroy leaving")
    end

    def update_analytics(fields = nil)
       Rails.logger.info("[MODEL] [ACTIVITY] [update_analytics] entering #{self.inspect}")

       #enable created_at and updated_at auto update immediately at after_save = just after Activity.create!
       ActiveRecord::Base.record_timestamps = true if ActiveRecord::Base.record_timestamps == false

       fields = ["posts"] if fields.blank?

       SummaryRank.add_analytics({:fields => fields, :summary_id => self.summary_id}) if !self.summary_id.blank?
       Rails.logger.info("[MODEL] [ACTIVITY] [update_analytics] leaving #{self.inspect}")
    end

    def create_fields_for_analytics
      fields = ["posts"]
      fields << "documents" if self.documents.size > 0
      fields << "comments" if self.comments.size > 0
      fields << "likes" if self.campaigns.size > 0
      fields << "actions" if (!self.social_counters_array.blank? and  self.social_counters_array.size > 0)
      fields
    end

  public

  class << self
    include QueryPlanner
    include TextFormatter
    include PusherSvc
    include QueryManager
    #    :author_id => 123
    #    :activity => activity word or phrase in activity box
    #    :text =>   ""entity box + @@ + location box" or nil
    #    :location => {
    #                  :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj",
    #                  :geo_city => ""bangalore", :geo_country => "india", :geo_region => "Karnataka"}
    #                                      OR
    #                  :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
    #                                      OR
    #                  :unresolved_location =>{:unresolved_location_name => "http://google.com"}
    #                                      OR
    #                                     nil
    #                 }
    #    :documents => [{:caption =-> "hello",:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "https://s3.amazonaws.com/xyz.jpg" }],
    #    :campaign_types => 1 to 7 or nil #at present each bit represent on campaign type.
    #                         bit 0 => like, bit 1=>support,bit 2=> :join  #defualt is 1 ( like)
    #    :status => 0 or 1   #0 => saved, 1 => public share, #default => 1
    #    :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
    #                       or custom email or mobile number #defualt is actwitty
    #    :sub_title => "hello sudha baby" or nil #optional
    #    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
    #    :meta_activity => true/false #true for comment, campaign father activity creation otherwise false
    #    :source_msg_id => 123
    #    :links => [{:url => "http://timesofindia.com/123.cms", :mime => AppConstants.mime_remote_link,
    #             :provider => "timesofindia.com", :description => "Manmohan singh sleeping" [OPTIONAL],
    #             :title => "indian politics"[OPTIONAL], :image_url => "http://timesofindia.com/123.jpg" [OPTIONAL]
    #             ,:image_width => 90[OPTIONAL], :image_height => 120[OPTIONAL], :url_processed => true/false [OPTIONAL][Only come from pulled data]}]


    def create_activity(params={})

        Rails.logger.info("[MODEL] [ACTIVITY] [create_activity] entering #{params}")

        summary = nil
        summary_hash = {}
        document_ids = []
        link_ids = []
        array = []
        tag_ids =[]

        #don allow space separated words
        if !params[:activity].scan(/\s+/).blank?
          return {}
        end


        #set mandatory parameters if missing
        params[:status] = AppConstants.status_public if params[:status].nil?
        params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?
        params[:campaign_types] =  AppConstants.campaign_like if params[:campaign_types].nil?
        params[:update] = false if params[:update].nil?
        params[:text].blank? ? params[:blank_text] = true : params[:blank_text] = false

        ################################### Create Activity Word ################################################

        word_obj = ActivityWord.create_activity_word(params[:activity], "verb-form")

        #################################### CREATE SUMMARY ######################################################
        #summary is processed earlier as to keep counter_cache active.
        #counter_cache only works for create & destroy methods
        #Not done for comments and campaign and saved activity

        if params[:meta_activity] == false && params[:status] != AppConstants.status_saved
          #create summary
          summary = Summary.create_summary(:user_id => params[:author_id],:activity_word_id => word_obj.id,
                                           :activity_name => params[:activity],:summary_category => params[:summary_category])
          if summary.nil?
            Rails.logger.error("Activity => CreateActivity => Summary Creation Failed for #{params.to_s}")
            return nil
          end
          params[:summary_id] = summary.id

        end

        ###################################### CREATE OR UPDATE ACTIVITY #################################################
        h = {:activity_word_id => word_obj.id,:activity_text => params[:text] , :activity_name => params[:activity],
             :author_id => params[:author_id], :summary_id => params[:summary_id],:enriched => false, :status => params[:status],
             :campaign_types => params[:campaign_types],:source_name => params[:source_name],:sub_title => params[:sub_title],
             :meta_activity => params[:meta_activity], :blank_text => params[:blank_text],:source_msg_id => params[:source_msg_id],
             }

        if !summary.blank? #blank summary is possible when saved activity
          h[:category_id] = summary.category_id
          h[:category_type] = summary.category_type
          params[:category_type] =  summary.category_type #to put in hub
        end

        #this is used to insert social data from Fb, twitter etc at their actual time stamp.
        #Auto update of time stamp is switched off. It is enabled immediately after
        #Activity,create! or update in after_save callback
        #Commented - as we are not setting creatd_at and updated_at manually..But works very neatly..
        #To enable un-comment 4 lines and also in after_save callback
        if !params[:created_at].blank? and !params[:updated_at].blank?
          h[:created_at] = params[:created_at]
          h[:updated_at] = params[:updated_at]
          h[:backup_created_timestamp] = Time.now.to_datetime
          ActiveRecord::Base.record_timestamps = false
        end

        if params[:update] == false
          #create activity => either root or child
          obj = Activity.create!(h)
        else
          obj = Activity.where(:id => params[:activity_id]).first
          obj.update_attributes!(h)
        end


        ######################################## START PROCESSING NON META ACTIVITY ###########################
        #Not done for comments and campaign
        if params[:meta_activity] == false

          #Add activity_word to params hash for hub creation
          params[:activity_word_hash] = {:word => params[:activity], :id => word_obj.id}

          #Add activity to params hash for hub creation
          params[:activity_hash] = obj.id

          #Serialize Most recent activity texts
          if !obj.activity_text.blank?
            #summary_hash["activity"] = [obj.id]
          end


          ####################################### Create Location #############################################
          if !params[:location].blank?
           loc= Location.create_location(params[:location])
           if !loc.nil?
              #Add location to params hash for hub creation
              params[:location_hash] = loc.id
              #Serialize Most recent location
              #summary_hash["location"] = [loc.id]
           end
          end

          ################################### Generate Mentions #################################################
          if !params[:text].blank?
              params[:text] = Mention.create_mentions(params[:text], obj)

              #Save location and Mentions too
              #obj.update_attributes(:activity_text => params[:text],:base_location_id => params[:location_hash] )
              Activity.update_all({:activity_text => params[:text],:base_location_id => params[:location_hash]},
                                  {:id => obj.id})
          end


          ################################## CREATE DOCUMENTS ###################################################
          #first get the mentioned document links
          array = []

          #process in-text embedded links only for check-ins in Actwitty
          #for rest process all links ( attached + in-text ) in data adaptor of provider
          #this is done so that we can categorize external posts from providers in bulk
          if params[:source_name] == AppConstants.source_actwitty
            array = get_documents(params[:text]) if !params[:text].blank?
          end

          !params[:documents].blank? ? params[:documents].concat(array) : (params[:documents] = array)
          params[:documents].concat(params[:links]) if !params[:links].blank?

          doc_hash = {}
          if !params[:documents].blank?
            params[:documents].each do |attr|

              #check if duplicate urls are there
              if doc_hash[attr[:url]].blank?
                doc_hash[attr[:url]]= true
              else
                next
              end

              d = Document.create_document(:owner_id => params[:author_id], :activity_id => obj.id, :activity_word_id => word_obj.id,
                         :source_name =>params[:source_name],:summary_id => params[:summary_id], :url => attr[:url],
                         :thumb_url => attr[:thumb_url], :provider => attr[:provider],:uploaded => attr[:uploaded],
                         :mime => attr[:mime], :caption => attr[:caption], :location_id => params[:location_hash],
                         :status => params[:status], :name => attr[:name], :description => attr[:description],
                         :image_url => attr[:image_url], :image_width => params[:image_width],:image_height => params[:image_height],
                         :url_processed => params[:url_processed])

              if !d.nil?
                #document_ids << d.id
              end
            end
            #Serialize Most recent docs
            #summary_hash["document"] = document_ids
          end

          #################################CREATE HASH TAGS######################################################
          #first get the mentioned tags
          array = []
          array = get_tags(params[:text]) if !params[:text].blank?

          !params[:tags].blank? ? params[:tags].concat(array) :(params[:tags] = array if !array.blank?)

          if !params[:tags].blank?
            params[:tags].each do |attr|

              t =Tag.create_tag(:author_id => params[:author_id], :activity_id => obj.id,
                          :activity_word_id => word_obj.id, :source_name => params[:source_name],:name => attr[:name],
                          :tag_type => attr[:tag_type], :location_id => params[:location_hash],
                         :status => params[:status], :summary_id => params[:summary_id])

              #tag_ids << t.id if !t.nil?

            end
            #Serialize Most recent tags
            #summary_hash["tag"] = tag_ids
          end

          ################################# SERIALIZE TO SUMMARY ###################################################
          #as we are calling update_all for loc amd mention.. so object will not be updated
          obj.reload

          #Update Summary Data - Dont do it for saved data
          if params[:status] != AppConstants.status_saved
            #summary.serialize_data(summary_hash)
          else
            return obj
          end

          ################################# CREATE HUB ENTRIES OR POST PROC ########################################
          #for blank text also hub entries are created. It can be removed if user's dependency on activity_word_id and
          #location is completely done through activity table. But some day if we want to give multiple locations in post
          #then this kind of processing is must as user has to be linked to hub for locations always. anyway not much
          # costly. so lets keep it

          #Dont do it for saved data
          if params[:text].blank?
              create_hub_entries(params)
          else
              post_proc_activity(params)
          end
        end

        Rails.logger.info("[MODEL] [ACTIVITY] [create_activity] leaving ")

        return obj

    rescue => e
        Rails.logger.error("[MODEL] [ACTIVITY] [create_activity] rescue => CreateActivity failed with #{e.message} for #{params.to_s}")

        #Validation Uniqueness fails  [:source_msg_id, :source_name, :author_id]
        if /has already been taken/ =~ e.message
          Rails.logger.error("[MODEL] [ACTIVITY] [create_activity] rescue => Unique Validation failed
                        [msg_id => #{params[:source_msg_id]} source_name => #{params[:source_name]}
                        author_id => #{params[:author_id]}]")
        end
        nil
    end

    #INPUT {activity_id => 123, :current_user_id => 234 } #self user -id
    #OUTPUT => attributes of deleted activity
    def remove_activity(params)

      Rails.logger.debug("[MODEL] [Activity] [remove_activity] entering ")

      a = Activity.where(:id => params[:activity_id], :author_id => params[:current_user_id]).first
      if a.blank?
        Rails.logger.debug("[MODEL] [Activity] [remove_activity] returning empty json ")
        return {}
      end
      a.destroy
      Rails.logger.debug("[MODEL] [Activity] [remove_activity] leaving ")
      a.attributes
    end


    #Removes all occurrences of an entity from an activity
    #INPUT => {activity_id => 123, entity_id => 234}
    #OUTPUT => Activity Blob

    def remove_entity_from_activity(params)

      Rails.logger.debug("[MODEL] [Activity] [remove_entity_from_activity] entering ")

      activity = Activity.where(:id => params[:activity_id]).first

      if !activity.activity_text.blank?
         text = unlink_an_entity(activity.activity_text,  params[:entity_id])
         puts text
         Activity.update_all({:activity_text=> text},{:id => params[:activity_id]})
      else
        Rails.logger.debug("[MODEL] [Activity] [remove_entity_from_activity] activity_text blank => LEAVING")
        activity = format_activity(activity)
        return activity
      end

      #Destroy Hub entries for that
      Hub.destroy_all(:activity_id =>params[:activity_id], :entity_id => params[:entity_id])

      #update analytics for entity id
      SummaryRank.add_analytics({:fields => ["posts"], :entity_id => params[:entity_id]} )

      activity.reload
      activity = format_activity(activity)

      Rails.logger.debug("[MODEL] [Activity] [remove_entity_from_activity] leaving")
      activity
    rescue => e
      Rails.logger.error("[MODEL] [Activity] [remove_entity_from_activity] [rescue] => failed => #{e.message}")
      {}
    end


    #INPUT = :current_user_id => 123 , activity_ids => Array of activity ids
    #OUTPUT =   See get_stream output in HASH :stream => {}
    def get_all_activity(params)

      Rails.logger.debug("[MODEL] [ACTIVITY] [get_all_activity] entering ")
      array = []
      index = 0
      hash = {}

      Activity.includes(:author, :base_location).where(:id => params[:activity_ids]).order("updated_at DESC").all.each do |attr|

        array << format_activity(attr)
        array[index][:comments] = {:count => attr.comments.size, :array => [] }
        array[index][:documents]= {:count => attr.documents.size, :array => []}
        array[index][:tags]=      {:count => attr.tags.size, :array => []}
        array[index][:campaigns]= [{:name=>"like", :count=>attr.campaigns.size, :user=>false}]
        hash[attr.id] = index
        index = index + 1
      end

      Document.includes(:web_link).where(:activity_id => params[:activity_ids]).all.each do |attr|
         h = format_document(attr)
         array[hash[attr.activity_id]][:documents][:array] << h[:document]
      end

      #the following block is only valid if only like campaigns are there in system
      Campaign.where(:activity_id => params[:activity_ids],:author_id => params[:current_user_id]).all.each do |attr|
        array[hash[attr.activity_id]][:campaigns][0][:user] = true
      end

#      Tag.where(:activity_id => params[:activity_ids]).all.each do |attr|
#         h = format_tag(attr)
#         array[hash[attr.activity_id]][:tags][:array] << h[:tag]
#      end


      Rails.logger.debug("[MODEL] [ACTIVITY] [get_all_activity] leaving")
      array
    end


    #COMMENT - Only returns public post which has summary
    #INPUT
    #:user_id => 123
    #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
    ##             OR 4(AppConstants.page_state_public)
    #:filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
    #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601),
    #:current_user_id => 123 #user_id for self (calling user)
    #OUTPUT
    #{
    # :stream =>
    # [
    # {
    # :post=>
    #  {
    #   :id=>11, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
    #   :word=>{:id=>10, :name=>"eating"}, :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
    #   :text=>"<a href=# value=11 class=js_activity_entity>pizza</a>  with <a href=# value=5 class=js_activity_mention>Alok Srivastava</a>",
    #   :enriched=>true, :summary_id=>9, :sub_title=>nil, :source_name=>"actwitty", :status=>1, :campaign_types=>1,:source_msg_id => "12233",
    #   :category_data => {:id => "food",:name => "food and drink",:type => "/food", :hierarchy => "/", :default_channel => "food"   }
    #  },
    # :location=>
    #  {
    #   :type=>2, :lat=>#<BigDecimal:9de78e0,'0.2345E2',18(18)>, :long=>#<BigDecimal:9de77c8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>8
    #   ,:city => "bangalore", :country => "india", :region => "karnataka"
    #  },
    #  :comments=>
    #  {
    #   :count=>5, :array=>[]
    #  },
    #
    # #COMMENT => Tag type check in constants,yml #TAG TYPE
    # :tags =>
    #  {
    #   :count => 3,
    #   array => [{:id => 1, :name => "maradona", :type => 1, :ty :source_name=>"actwitty",  :status=>1},
    #             {:id => 3, :name => "sachin tendulkar", :type => 2, :ty :source_name=>"actwitty",  :status=>1}
    #             {:id => 2, :name => "kapil dev", :type => 3, :source_name=>"actwitty",  :status=>1}
    #  }
    #
    #
    ## COMMENT - In documents these fields are added and they will be returned too in streams
    ## COMMENT - :caption=> "abcds", :source_name=>"actwitty", :status=>1, :uploaded=>true
    ## COMMENT - uploaded field tells that document is uploaded doc or mentioned document. It is boolean
    ## COMMENT - category tell whether its image/video/audio/application  application represents generic documents and other types
    #
    # :documents=>
    #  {
    #   :count=>2,
  #      :array=>[
  #           {:id=>1,:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg", :url=>"https://s3.amazonaws.com/xyz.jpg",
  #            :caption=>nil, :source_name=>"actwitty",  :status=>1, :uploaded=>true,:activity_id=>230, :summary_id=>125, :time=>Fri, 02 Dec 2011 11:32:53 UTC +00:00,
  #            :category => "image",
  #           }
  #
  #          {:id=>2, :name=>"abc.docx",:thumb_url => nil, :url=>"https://s3.amazonaws.com/abc.docx", :caption=>nil, :source_name=>"actwitty",
  #           :status=>1, :uploaded=>true, :activity_id=>230, :summary_id=>125,:time=>Fri, 02 Dec 2011 11:32:53 UTC +00:00,
  #           :category => "application",
  #          }
  #
  #          {
  #          :id=>729, :url=>"http://timeofindia.com/123/234", :thumb_url=>nil, :caption=>nil, :time=>Fri, 02 Dec 2011 11:32:53 UTC +00:00,
  #          :source_name=>"actwitty", :status=>2, :uploaded=>false, :activity_id=>230,  :summary_id=>125,
  #          :category=>"link",
  #          :url_description=>"fight of over FDI in retail intensifies at parliament",
  #          :url_category=>"politics", :url_title=>"indian politics", :url_image=>nil, :url_provider=>"timesofindia.com"
  #          }
  #
  #           ]
  #  },
  # :campaigns=>
  #     [{:name=>"support", :count=>1, :user=>true, :user_id=>5}, {:name=>"like", :count=>2, :user=>false}]
  # }
  # ]
  ##COMMENT IF CHANNEL FILTER THEN
  # :theme_data => {
  #                 :id => 123, :theme_type => theme.theme_type,# [ 1 (AppConstants.theme_default) OR 2 (AppConstants.theme_color) OR 3 (AppConstants.theme_document)],
  #                 :user_id => 123,:summary_id => 134,:time => Thu, 21 Jul 2011 14:44:26 UTC +00:00,
  #
  #                :document_id => _id, #if :theme_type => AppConstants.theme_document
  #                                                      OR
  #                 :fg_color => AppConstants.theme_default_fg_color, :bg_color => AppConstants.theme_default_bg_color
  #                         #if :theme_type => AppConstants.theme_default
  #                                                     OR
  #                 :fg_color => "0x6767623", :bg_color => "0x78787834" # :theme_type => AppConstants.theme_color
  #                 }
  # :analytics_summary => {
    #                          "posts" =>{:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45} #many new services can come this is Exemplary
    #                         "comments" => {:total => 34, :actwitty => 20, :facebook => 14 }, "likes" =>{:total => 123, :actwitty => 33, :facebook => 90 }
    #                         "actions" =>  {:share => 24, :views => 90},
    #                          "demographics" => {:total => 40,:male => 20, :female => 18, :others => 2,
    #                             :age_group => {"18-24" => {:total => 20,:male => 10, :female => 11, :others => 0},
    #                            "35-44" => {:total => 20,:male => 10, :female => 7, :others => 2}}}
    #                            See constants.yml for age_band
    #                         "subscribers" => 345, "documents" =>  {"total" => 160, "image" => 24, "video" => 90, "audio" => 46}
    #                         "channel_ranks" => 234
    #                       }
    # :category_data => {:id => "food",:name => "food and drink",:type => "/food", :hierarchy => "/", :default_channel => "food"   }
    #}
    def get_stream(params ={})

      Rails.logger.debug("[MODEL] [ACTIVITY] [get_stream] entering")

      stream = {}

      h = process_filter_modified(params)

      if h.blank?
        Rails.logger.debug("[MODEL] [ACTIVITY] [get_stream] Leaving => Blank has returned by process_filter => #{params.inspect}")
        return {}
      end

      #use HUB only if entity filter is there
      if !h[:entity_id].blank?

        # need to check this anyway  - For time being
        # we have to delete hub
        h = pq_hub_filter(h)
        Rails.logger.debug("[MODEL] [ACTIVITY] [get_stream] => Hub/Entity based filtering => #{h.inspect}")
        activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

      else

        h[:status] =  AppConstants.status_public

        h[:meta_activity] = false

        h = pq_activity_filter(h)

        Rails.logger.debug("[MODEL] [ACTIVITY] [get_stream] => Activity based filtering => #{h.inspect}")

        #show only public post.. Need to take care private and shared post
        activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count
      end

      array = get_all_activity({:activity_ids => activity.keys, :current_user_id => params[:current_user_id]})

      stream[:stream] = array

      if !h[:activity_word_id].blank?
        if params[:page_type] == AppConstants.page_state_user
          s = Summary.where(:user_id => params[:user_id],:activity_word_id => h[:activity_word_id]).first
          stream[:theme_data] = s.theme_data
          stream[:analytics_summary] = s.analytics_summary
          stream[:category_data] = format_summary_category(s.category_id)
        end
      end

      Rails.logger.debug("[MODEL][ACTIVITY] [get_stream] leaving")
      stream
    end


    #INPUT => {:activity_ids => AN array of activity_ids for which enriched is false}
    #OUTPUT =>
    def get_enriched_activities(params)
      Rails.logger.debug("[MODEL] [Activity] [get_enriched_activities] entering ")
      en = []

      Activity.includes(:author, :base_location).where(:id => params[:activity_ids], :enriched => true).all.each do |attr|
        a = format_activity(attr)
        en << a
      end
      Rails.logger.debug("[MODEL] [Activity] [get_enriched_activities] leaving ")
      en
    end

    #INPUT
    #:filter => {:word_id => 123,
    #            :source_name => "actwitty" or "twitter" or "dropbox" or "facebook" etc -CHECK constants,yml(SOURCE_NAME)
    #            :location_id => 789, :entity_id => 234,
    #            :current_user_id => 123 #self }
    #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
    #OUTPUT
    # See get_stream output in HASH :stream => {}
    def get_draft_activity(params)

      Rails.logger.debug("[MODEL] [USER] [get_draft_activity] entering")

      h = process_filter(params[:filter])

      h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

      h[:status] =  AppConstants.status_saved

      h[:meta_activity] = false

      h[:user_id] = params[:current_user_id]

      h = pq_activity_filter(h)

      activity = Activity.where(h).group(:id).order("MAX(updated_at) DESC").count

      array = get_all_activity({:activity_ids => activity.keys})

      Rails.logger.debug("[MODEL] [Activity] [get_draft_activity] leaving ")

      array

    end


    #INPUT => {:word_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601), :current_user_id => 1234}
    #OUTPUT => { :id => 12435, :name => "eating" ,
    #:stream => [{:post => .... }]# same as stream
    ##COMMENT => If updated_at parameter is sent, it means client already has entity info so, only stream part will be
    #sent.

    def get_activity_stream(params)
      h = {}

      Rails.logger.debug("[MODEL] [Activity] [get_activity_stream] entering")

      a = ActivityWord.where(:id => params[:word_id]).first

      if a.blank?
        Rails.logger.debug("[MODEL] [Activity] [get_activity_stream] returning blank JSON")
        return {}
      end

      hash ={:id => params[:word_id], :name => a.word_name }

      h[:activity_word_id] =  params[:word_id]

      h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

      h[:status]   = AppConstants.status_public

      h = pq_activity_filter(h)

      activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count

      hash[:stream] =get_all_activity({:current_user_id => params[:current_user_id], :activity_ids => activity.keys})

      Rails.logger.debug("[MODEL] [Activity] [get_activity_stream] leaving")
      hash
    end

    #INPUT => :activity_id => 123, :new_name => "foodie", :user_id > 123
    #OUPUT => returns activity object attributes as hash
    def rename_activity_name(params)
       Rails.logger.info("[MODEL] [Activity] [rename_activity_name] entering")

       if params[:new_name].blank?
         Rails.logger.info("[MODEL] [Activity] [rename_activity_name]  => BLANK activity name given  " )
         return {}
       end

       a = Activity.where(:id => params[:activity_id]).first

       if a.blank?
         Rails.logger.info("[MODEL] [Activity] [rename_activity_name]  => invalid activity  " )
         return {}
       end

       params[:new_name].capitalize!
       if params[:new_name] == a.activity_name
         Rails.logger.info("[MODEL] [Activity] [rename_activity_name]  => same activity name given  " )
         return {}
       end

       if params[:user_id] != a.author_id
         Rails.logger.info("[MODEL] [Activity] [rename_activity_name]  => invalid user  " )
         return {}
       end

       summary_new = Summary.where(:user_id => a.author_id, :activity_name => params[:new_name]).first
       if summary_new.blank?
         Rails.logger.info("[MODEL] [Activity] [rename_activity_name] => summary name for this user does not exist " )
         return {}
       end

       summary_old = Summary.where(:id => a.summary_id).first
       if summary_old.blank?
         Rails.logger.info("[MODEL] [Activity] [rename_activity_name] => ERROR old summary is blank how come " )
          return {}
       end

       update_activity_associations(params[:new_name], summary_new, params[:activity_id])

       #summary_new.rebuild_a_summary
       fields = a.create_fields_for_analytics     #get only necessary field to update
       SummaryRank.add_analytics({:fields => fields, :summary_id => summary_new.id})

       #reset needed otherwise destroy will not happen
       Summary.reset_counters(summary_new.id,:activities, :documents, :campaigns, :tags)
       Summary.reset_counters(summary_old.id,:activities, :documents, :campaigns, :tags)

       #reload & destroy old summary. If activities count is 0
       summary_old.reload
       if summary_old.activities.size == 0
         summary_old.destroy
       else
         #summary_old.rebuild_a_summary
         SummaryRank.add_analytics({:fields => fields, :summary_id => summary_old.id})
       end

       #as we are returning activity so no need to reload
       #summary_new.reload
       #summary_new.attributes

       a.reload
       Rails.logger.info("[MODEL] [Activity] [rename_activity_name] => leaving #{params.inspect}")
       a.attributes
    rescue => e
       Rails.logger.info("[MODEL] [Activity] [rename_activity_name] => Rescue ERROR #{e.message} for #{params.inspect}")
       nil
    end
  end


  private

    class << self

      def create_hub_entries(params = {})

        Rails.logger.info("[MODEL] [ACTIVITY] [create_hub_entries] entering ")

        hubs_hash = {}
        entity = []

        hubs_hash[:activity_id] =  params[:activity_hash]
        hubs_hash[:activity_word_id] =  params[:activity_word_hash][:id]
#        hubs_hash[:activity_name] =  params[:activity_word_hash][:word]
        hubs_hash[:user_id] = params[:author_id]
        hubs_hash[:summary_id] = params[:summary_id]
        hubs_hash[:source_name] = params[:source_name]
        hubs_hash[:status]= params[:status]
        hubs_hash[:category_type] = params[:category_type]

        if !params[:location_hash].nil?
          hubs_hash[:location_id] = params[:location_hash]
        end


        if !params[:entity_hash].nil?
          params[:entity_hash].each do |key, value|
            #hubs_hash[:entity_name] = key
            hubs_hash[:entity_id] = value
            entity << value
            Hub.create!(hubs_hash)
          end
        else
          Hub.create!(hubs_hash)
        end
       
        #Update Activity Data
        #obj = Activity.where(:id => params[:activity_hash]).first
        #obj.update_attributes(:activity_text => params[:text],:enriched => true)
        Activity.update_all({:activity_text => params[:text],:enriched => true}, {:id => params[:activity_hash]})

        #Update Summary's Entity Array
#        summary = Summary.where(:id => params[:summary_id]).first
#        summary.serialize_data({"entity" => entity})

        Rails.logger.info("[MODEL] [ACTIVITY] [create_hub_entries] leaving ")
      rescue => e
         Rails.logger.error("[MODEL] [ACTIVITY] [create_hub_entries] rescue failed => #{e.message} => #{params} => hubs_hash = #{hubs_hash}")
      end

      def post_proc_activity(params={})

         Rails.logger.info("[MODEL] [ACTIVITY] [post_proc_activity] entering =>  #{params.to_s}")
         #TODO may need need to remove links also
         temp_text = remove_mentions_and_tags(params[:text])

         entities=get_entities(temp_text)

         entities.each do |entity|
           obj = Entity.create_entities(params[:author_id],entity)

           if !obj.nil?
             #Add entity to params hash for hub creation
             if  params[:entity_hash].nil?
               params[:entity_hash] = {}
             end
              params[:entity_hash][obj.entity_name]  = obj.id

           end
         end


         if !params[:entity_hash].nil?
           params[:text] = mark_entities(params[:text],params[:entity_hash])
         end


         create_hub_entries(params)

         #ALOK Adding pusher support
         #Commenting for time being
#         s = Summary.where(:id => params[:summary_id]).first
#
##         (class << s; self; end).class_eval { attr_accessor :activity_id, :activity_text }
##         s.activity_id = params[:activity_hash]
##         s.activity_text = params[:text]
#         h = {}
#         h[:summary] = s.attributes
#         h[:post] = {}
#         h[:post][:activity_id] = params[:activity_hash]
#         h[:post][:activity_text] = params[:text]
#
#         pusher_event({:channel => "#{params[:author_id]}", :event => "enriched_activity", :data => h.to_json})

         Rails.logger.info("[MODEL] [ACTIVITY] [post_proc_activity] leaving ")
      end

      handle_asynchronously :post_proc_activity


        #called from rename_activity_name
      def update_activity_associations(new_name, summary_new, activity_id)

        Activity.update_all({:activity_name => new_name, :activity_word_id =>summary_new.activity_word_id,
                                :summary_id => summary_new.id}, { :id => activity_id })

        Document.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                               { :activity_id => activity_id })

        Tag.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                          { :activity_id => activity_id })

        Hub.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                          { :activity_id => activity_id })

        Campaign.update_all({:summary_id => summary_new.id},{ :activity_id => activity_id })

        Comment.update_all({:summary_id => summary_new.id}, { :activity_id => activity_id })

        SocialCounter.update_all({:summary_id => summary_new.id}, {:activity_id => activity_id})
#
#        SocialAggregator.update_all({:summary_id => summary_new.id}, {:activity_id => activity_id})
      end

    end

end


















# == Schema Information
#
# Table name: activities
#
#  id                       :integer         not null, primary key
#  activity_word_id         :integer         not null
#  activity_text            :text
#  activity_name            :text            not null
#  author_id                :integer         not null
#  base_location_id         :integer
#  comments_count           :integer         default(0)
#  documents_count          :integer         default(0)
#  tags_count               :integer         default(0)
#  activities               :integer         default(0)
#  campaigns_count          :integer         default(0)
#  campaign_types           :integer         not null
#  status                   :integer         not null
#  source_name              :text            not null
#  sub_title                :text
#  summary_id               :integer
#  enriched                 :boolean
#  meta_activity            :boolean
#  blank_text               :boolean
#  social_counters_array    :text
#  source_msg_id            :string(255)
#  category_type            :string(255)
#  category_id              :string(255)
#  backup_created_timestamp :datetime
#  created_at               :datetime
#  updated_at               :datetime
#

