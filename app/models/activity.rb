require "query_manager"

class Activity < ActiveRecord::Base

  include  ActionView::Helpers

  serialize       :social_counters_array, Array

  belongs_to      :author, :class_name => "User" #, :touch => true user is touched through summary
  belongs_to      :summary, :touch => true, :counter_cache => true, :dependent => :destroy

  belongs_to      :activity_word #, :touch => true user is touched through summary

  belongs_to      :base_location, :class_name => "Location"

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

  has_one         :social_aggregator, :dependent => :destroy

  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id

  validates_existence_of  :summary_id, :allow_nil => true
  validates_existence_of  :base_location_id, :allow_nil => true

  validates_presence_of   :activity_name,  :campaign_types, :source_name, :status

  validates_length_of     :activity_name,  :in => 1..AppConstants.activity_name_length

  validates_length_of     :source_name,    :in => 1..AppConstants.source_name_length

  validates_length_of     :sub_title,      :maximum => AppConstants.sub_title_length, :unless => Proc.new{|a| a.sub_title.nil?}

  validates_length_of     :activity_text , :maximum => AppConstants.activity_text_length, :unless => Proc.new{|a| a.activity_text.nil?}

  before_save             :sanitize_data

  after_destroy           :rebuild_summary_and_analytics

  after_save              :update_analytics

  protected

    def sanitize_data

      Rails.logger.info("[MODEL] [ACTIVITY] [sanitize_data] - Before Save entering")

      self.activity_text = sanitize(self.activity_text, :tags => AppConstants.sanity_tags, :attributes => AppConstants.sanity_attributes) if !self.activity_text.blank?
      self.activity_name = sanitize(self.activity_name) if !self.activity_name.blank?
      self.sub_title = sanitize(self.sub_title) if !self.sub_title.blank?

      Rails.logger.debug("[MODEL] [ACTIVITY] [sanitize_data]- Before Save leaving")

    end

    def rebuild_summary_and_analytics
      Rails.logger.info("[MODEL] [ACTIVITY] [rebuild_summary_and_analytics] - After Destroy entering")

      if !self.summary_id.blank?
        s = Summary.where(:id => self.summary_id).first
        s.rebuild_a_summary if !s.nil?

        #update_analytics
        update_analytics
      end

      Rails.logger.info("[MODEL] [ACTIVITY] [rebuild_summary_and_analytics] - After Destroy leaving")
    end

    def update_analytics
       Rails.logger.info("[MODEL] [ACTIVITY] [update_analytics] entering #{self.inspect}")

       #enable created_at and updated_at auto update immediately at after_save = just after Activity.create!
       #ActiveRecord::Base.record_timestamps = true if ActiveRecord::Base.record_timestamps == false

       SummaryRank.add_analytics({:fields => ["posts"], :summary_id => self.summary_id}) if !self.summary_id.blank?

       Rails.logger.info("[MODEL] [ACTIVITY] [update_analytics] leaving #{self.inspect}")
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

    def create_activity(params={})

        Rails.logger.info("[MODEL] [ACTIVITY] [create_activity] entering #{params}")

        summary = nil
        summary_hash = {}
        document_ids = []
        array = []
        tag_ids =[]

        #don allow space separated words
        if !params[:activity].scan(/\s+/).blank?
          return {}
        end

        puts params[:activity].inspect
        #set mandatory parameters if missing
        params[:status] = AppConstants.status_public if params[:status].nil?
        params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?
        params[:campaign_types] =  AppConstants.campaign_like if params[:campaign_types].nil?
        params[:update] = false if params[:update].nil?
        params[:text].blank? ? params[:blank_text] = true : params[:blank_text] = false

        ################################### Create Activity Word ################################################

        word_obj = ActivityWord.create_activity_word(params[:activity], "verb-form")
         puts params[:activity].inspect
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
#        if !params[:created_at].blank? and !params[:updated_at].blank?
#          h[:created_at] = params[:created_at]
#          h[:updated_at] = params[:updated_at]
#          ActiveRecord::Base.record_timestamps = false
#        end

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
            summary_hash["activity"] = [obj.id]
          end


          ####################################### Create Location #############################################
          if !params[:location].blank?
           loc= Location.create_location(params[:location])
           if !loc.nil?
              #Add location to params hash for hub creation
              params[:location_hash] = loc.id
              #Serialize Most recent location
              summary_hash["location"] = [loc.id]
           end
          end

          ###################################Generate Mentions#################################################
          if !params[:text].blank?
              params[:text] = Mention.create_mentions(params[:text], obj)

              #Save location and Mentions too
              obj.update_attributes(:activity_text => params[:text],:base_location_id => params[:location_hash] )
          end

          ##################################CREATE DOCUMENTS #####################################################
          #first get the mentioned document links
          array = []
          array = get_documents(params[:text]) if !params[:text].blank?
          !params[:documents].blank? ? params[:documents].concat(array) : (params[:documents] = array if !array.blank?)

          if !params[:documents].blank?
            params[:documents].each do |attr|
              d = Document.create_document(:owner_id => params[:author_id], :activity_id => obj.id, :activity_word_id => word_obj.id,
                         :source_name =>params[:source_name],:summary_id => params[:summary_id], :url => attr[:url],
                         :thumb_url => attr[:thumb_url], :provider => attr[:provider],:uploaded => attr[:uploaded],
                         :mime => attr[:mime], :caption => attr[:caption], :location_id => params[:location_hash],
                         :status => params[:status] )

              document_ids << d.id if !d.nil?
            end

            #Serialize Most recent docs
            summary_hash["document"] = document_ids
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

              tag_ids << t.id if !t.nil?

            end
            #Serialize Most recent tags
            summary_hash["tag"] = tag_ids
          end

          ################################# SERIALIZE TO SUMMARY ###################################################

          #Update Summary Data - Dont do it for saved data
          if params[:status] != AppConstants.status_saved
            summary.serialize_data(summary_hash)
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


    #INPUT { :activity_id => 123,
    #        REST ALL SAME PARAMETER AS create_activity
    #      }
    #OUTOUT => Same as create_activity
    ##COMMENT => It is used for normal edits of activities. State change can also happen BUT only from PUBLIC to
    ##           PRIVATE and VICE VERSA and NOT FROM SAVED to PUBLIC/PRIVATE
    ###          SAVED ACTIVITY CANT NOT be REVERTED back to PUBLISHED OR PRIVATE
    def update_activity(params)

      Rails.logger.debug("[MODEL] [Activity] [update_activity] entering ")

      a = Activity.where(:id => params[:activity_id], :author_id => params[:current_user_id]).first

      #false activity
      if a.blank?
        Rails.logger.debug("[MODEL] [Activity] [update_activity] [ERROR] returning empty json ")
        return {}
      end

      #store summary_id to see if summary id is not changed in update
      prev_summary_id = a.summary_id

      #delete existing documents which are not in input params
      url = []

      #collect params docs in array
      unless params[:documents].blank?
        params[:documents].each do |attr|
          url << attr[:url]
        end
      end

      #remove the existing activity docs if input params docs is blank
      destroy_ids = []
      delete_ids = []
      if url.blank?
         a.documents.clear if a.documents.size > 0
      else
        a.documents.each do |attr|
          url.include?(attr.url) ? delete_ids << attr.id : destroy_ids << attr.id
        end
        Document.destroy_all(:id => destroy_ids) if !destroy_ids.blank?
        Document.delete_all(:id => delete_ids) if !delete_ids.blank?
      end

      #delete existing tags
      a.tags.clear if a.tags.size > 0

      #delete related hubs
      a.hubs.clear

      #params.delete(:activity_id)
      params[:update] = true
      params[:activity]= params[:word]
      params[:author_id] = params[:current_user_id]
      params[:meta_activity] = false

      obj = create_activity(params)
      if obj.blank?
        Rails.logger.error("[MODEL] [Activity] [create_activity] [ERROR] returning empty json ")
        return {}
      end

      a = format_activity(obj)

      #store summary_id to see if summary id is not changed in update
      if a[:post][:summary_id] != prev_summary_id

        #update Social counter with new summary_id
        if !a[:post][:social_counters].blank?
          SocialCounter.update_all({:summary_id => a[:post][:summary_id]},{:summary_id => prev_summary_id,
                                                                          :activity_id => a[:post][:id]})

          #Recreate Social Counter Array for given summary
          s = Summary.where(:id => a[:post][:summary_id]).first
          s.social_counters_array = []
          SocialCounter.where(:summary_id =>a[:post][:summary_id]).group(:source_name, :action).count.each do |k,v|
            s.social_counters_array << {:source_name => k[0], :action => k[1], :count => v}
          end
          s.update_attributes(s.attributes)
        end

      end

      #Now rebuild the older summary. New summary will be build during create activity.
      #Only we have social counters of old summary need to migrate to new one.. this is done in upper block
      Summary.reset_counters( prev_summary_id, :activities)
      s = Summary.where(:id => prev_summary_id).first
      if s.activities.size == 0
        s.destroy
      else
        s.rebuild_a_summary
      end

      Rails.logger.debug("[MODEL] [Activity] [update_activity] leaving ")
      a
    end


    #INPUT { :activity_id => 123,
    #        :status => 1,
    #        :current_user_id => 123
    #      }
    #OUTOUT => Same as create_activity
    ##COMMENT => Changes state from saved to publish or private state. Dont use this api to change from
    ##           private to public or vice versa .. its only from saved to public state as it destroys
    ##           the previous activity and re-creates the new one.
    ###          SAVED ACTIVITY CANT NOT be REVERTED back to PUBLISHED OR PRIVATE
    #TODO fix it
    def publish_activity(params)

      Rails.logger.debug("[MODEL] [Activity] [publish_activity] entering")

      a = remove_activity({:activity_id => params[:activity_id], :current_user_id => params[:current_user_id]})

      if a.blank?
        Rails.logger.debug("[MODEL] [Activity] [publish_activity]  returning empty json ")
        return {}
      end

      params.delete(:activity_id)

      params[:activity]= params[:word]
      params[:author_id] = params[:current_user_id]
      params[:meta_activity] = false

      obj = Activity.create_activity(params)
      if obj.blank?
        Rails.logger.error("[MODEL] [Activity] [create_activity] [ERROR] returning empty json ")
        return {}
      end
      activity = format_activity(obj)

      Rails.logger.debug("[MODEL] [Activity] [publish_activity] leaving")
      activity

    end


    #Removes all occurrences of an entity from an activity
    #INPUT => {activity_id => 123, entity_id => 234}
    #OUTPUT => Activity Blob

    def remove_entity_from_activity(params)

      Rails.logger.debug("[MODEL] [Activity] [remove_entity_from_activity] entering ")

      activity = Activity.where(:id => params[:activity_id]).first

      if !activity.activity_text.blank?
         text = unlink_an_entity(activity.activity_text,  params[:entity_id])
         Activity.update_all({:activity_text=> text},{:id => params[:activity_id]})
      else
        Rails.logger.debug("[MODEL] [Activity] [remove_entity_from_activity] activity_text blank => LEAVING")
        activity = format_activity(activity)
        return activity
      end

      #Destroy Hub entries for that
      Hub.destroy_all(:activity_id =>params[:activity_id], :entity_id => params[:entity_id])

      #Reset Summary for entity id
      if !activity.summary_id.nil?

        s = Summary.where(:id => activity.summary_id).first

        #Recreate Entity Array for given summary
        s.entity_array = []
        a = Hub.where(:summary_id => activity.summary_id, :entity_id.not_eq => nil).group(:entity_id).
                limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count

        s.entity_array = a.keys if !a.blank?

        s.update_attributes(:entity_array => s.entity_array)
        #Summary.update_all({:entity_array => [s.entity_array]}, {:id => activity.summary_id})
      end
      s = Summary.where(:id => activity.summary_id).first

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
        array[index][:campaigns]= []
        hash[attr.id] = index
        index = index + 1
      end

      Document.where(:activity_id => params[:activity_ids]).all.each do |attr|
         h = format_document(attr)
         array[hash[attr.activity_id]][:documents][:array] << h[:document]
      end

      Tag.where(:activity_id => params[:activity_ids]).all.each do |attr|
         h = format_tag(attr)
         array[hash[attr.activity_id]][:tags][:array] << h[:tag]
      end

      campaign_hash = {}
      temp_hash = {}
      index = 0
      #Get all the campaigns grouped for those activity
      Campaign.where(:activity_id =>params[:activity_ids]).group(:activity_id, :name).count.each do |k,v|

         h = {:name => k[1], :count => v , :user => false}
         campaign_hash[k[0]].nil? ? campaign_hash[k[0]] = [h] : campaign_hash[k[0]] << h
         temp_hash[{:id => k[0], :name => k[1]}] = campaign_hash[k[0]].count -1

      end

      #Get all the campaigns grouped for those activity by current user
      #Set user_id if user has acted on  campaign
      Campaign.where(:activity_id => params[:activity_ids], :author_id => params[:current_user_id]).group(:activity_id, :name).count.
          each do |k,v|
          if !campaign_hash[k[0]].nil?
            campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user] =  true
            campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user_id] =  params[:current_user_id]
         end
      end


      campaign_hash.each do |k,v|
        v.each do |entry|
         array[hash[k]][:campaigns] << entry
        end
      end

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
    #   :array=>[
    #           {:id=>1, :name=>"xyz.jpg",:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg", :url=>"https://s3.amazonaws.com/xyz.jpg",
    #                               :caption=>nil, :source_name=>"actwitty",  :status=>1, :uploaded=>true, :category => "image"},
    #           {:id=>2, :name=>"abc.jpg",:thumb_url => nil, :url=>"https://s3.amazonaws.com/abc.jpg", :caption=>nil, :source_name=>"actwitty",
    #                                                                    :status=>1, :uploaded=>true, :category => "image"}
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
    #                 :document_id => _id, #if :theme_type => AppConstants.theme_document
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

      array = get_all_activity({:activity_ids => activity.keys})

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
        obj = Activity.where(:id => params[:activity_hash]).first
        obj.update_attributes(:activity_text => params[:text],:enriched => true)

        #Update Summary's Entity Array
        summary = Summary.where(:id => params[:summary_id]).first
        summary.serialize_data({"entity" => entity})

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

    end

end
















# == Schema Information
#
# Table name: activities
#
#  id                    :integer         not null, primary key
#  activity_word_id      :integer         not null
#  activity_text         :text
#  activity_name         :text            not null
#  author_id             :integer         not null
#  base_location_id      :integer
#  comments_count        :integer         default(0)
#  documents_count       :integer         default(0)
#  tags_count            :integer         default(0)
#  campaign_types        :integer         not null
#  status                :integer         not null
#  source_name           :text            not null
#  sub_title             :text
#  summary_id            :integer
#  enriched              :boolean
#  meta_activity         :boolean
#  blank_text            :boolean
#  social_counters_array :text
#  created_at            :datetime
#  updated_at            :datetime
#  source_msg_id         :string(255)
#  category_type         :string(255)
#  category_id           :string(255)
#

