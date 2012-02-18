require 'thread'

class Activity < ActiveRecord::Base

  include  ActionView::Helpers

  serialize       :actions, Hash

  belongs_to      :author, :class_name => "User" #, :touch => true user is touched through summary
  belongs_to      :summary, :touch => true, :counter_cache => true, :dependent => :destroy

  belongs_to      :activity_word #, :touch => true user is touched through summary

  belongs_to      :base_location, :class_name => "Location"

  belongs_to      :web_link

  #destroy will happen from activity
  has_many         :hubs, :dependent => :destroy

  has_many         :entities, :through => :hubs
  has_many         :locations,:through => :hubs

#  has_many         :mentions, :dependent => :destroy #destroy will happen from activity
#
#  has_many         :campaigns, :dependent => :destroy, :order => "updated_at DESC"
#
#  has_many         :comments, :dependent => :destroy, :order => "updated_at DESC"

  has_many         :tags, :dependent => :destroy, :order => "updated_at DESC"

  # documents have life time more than activity.
  # Documents will be removed from activity destroy as special handling is needed rather than usual destroy
  # UPDATE 03/07/2011 - Now we are destroying  document with post.. so we are putting dependent destroy
  has_many        :documents,  :dependent => :destroy, :order => "updated_at DESC"

#  #:destroy is not causing circular effect as there is father "delete" in campaign
#  has_one         :father_campaign, :foreign_key => :father_id, :class_name => "Campaign", :dependent => :destroy
#
#   #:destroy is not causing circular effect as there is father "delete" in comment
#  has_one         :father_comment, :foreign_key => :father_id, :class_name => "Comment", :dependent => :destroy
#
#  has_many        :social_counters, :dependent => :destroy

  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id

  validates_existence_of  :summary_id, :allow_nil => true
  validates_existence_of  :base_location_id, :allow_nil => true

  validates_presence_of   :activity_name,  :source_name, :status, :status_at_source

  validates_length_of     :activity_text, :maximum => AppConstants.activity_text_length, :unless => Proc.new{|a| a.activity_text.nil?}

  validates_uniqueness_of :source_object_id, :scope => [:source_name, :author_id], :unless => Proc.new {|a| a.source_object_id.nil?}

  before_save             :sanitize_data

  public

    def sanitize_data

      Rails.logger.info("[MODEL] [ACTIVITY] [sanitize_data] - Before Save entering")

      self.activity_text = sanitize(self.activity_text, :tags => AppConstants.sanity_tags, :attributes => AppConstants.sanity_attributes) if !self.activity_text.blank?
      self.activity_name = sanitize(self.activity_name) if !self.activity_name.blank?

      Rails.logger.debug("[MODEL] [ACTIVITY] [sanitize_data]- Before Save leaving")

    end


  public

  class << self
    include QueryPlanner
    include TextFormatter

    #    :author_id => 123
    #
    #    :word => activity word or phrase in activity box
    #
    #    :text =>   "hello world"
    #
    #    :location => {
    #                  :lat => 23.6567, :long => 120.3, :name => "sj",
    #                  :city => ""bangalore", :country => "india", :region => "Karnataka"}
    #                 }
    #    :documents => [{:url => "https://s3.amazonaws.com/xyz.jpg" }],
    #    :status => 0 or 1   #0 => saved, 1 => public share, #default => 1
    #    :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
    #                       or custom email or mobile number #defualt is actwitty
    #    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
    #    :source_object_id => 123
    #    :status_at_source => AppConstants.status_private_at_source|public_at_source
    #    :source_uid  => "123123213" #UID OF USER AT SOURCE
    #    :links => [
    #                 {
    #                    :source_object_id => "23213123", [FOR UPLOADED IMAGES AT SOURCE]
    #                    :url => "http://timesofindia.com/123.cms",
    #                    :mime => AppConstants.mime_remote_link,
    #                    :provider => "timesofindia.com",
    #                    :description => "Manmohan singh sleeping" [OPTIONAL],
    #                    :title => "indian politics"[OPTIONAL],
    #                    :image_url => "http://timesofindia.com/123.jpg" [OPTIONAL],
    #                    :image_width => 90[OPTIONAL],
    #                    :image_height => 120[OPTIONAL],
    #                    :category_id => "sports" [OPTIONAL if present "should be" Same as summary_category..]
    #                    :canonical_url => "timesofindia.com/123"[long url when url = a short url, OPTIONAL],
    #                    :cache_age => params[:cache_age][OPTIONAL will mostly come from pulled data]
    #                 }
    #             ]
    #   :actions => {
    #                 :likes => 20,
    #                 :comments => 20,
    #                 :shares => 40,
    #                 :retweets => 40,
    #               },
    #
    #   :source_object_type => "post"/"like"  AppConstants.source_object_type_post/like
    # }



    def create_activity(params={})

        Rails.logger.info("[MODEL] [ACTIVITY] [create_activity] entering #{params}")

        summary = nil
        summary_hash = {}
        document_ids = []
        link_ids = []
        array = []
        tag_ids =[]

        #don allow space separated words
        if !params[:word].scan(/\s+/).blank?
          return {}
        end


        #set mandatory parameters if missing
        params[:status] = AppConstants.status_public if params[:status].nil?  #by default we assume user has set it public
        params[:status_at_source] = AppConstants.status_public if params[:status_at_source].nil?  #by default we assume user has set it public
        params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?
        params[:update] = false if params[:update].nil?

        ################################### Create Activity Word ################################################

        word_obj = ActivityWord.create_activity_word(params[:word], "verb-form")

        #################################### CREATE SUMMARY ######################################################
        #summary is processed earlier as to keep counter_cache active.
        #counter_cache only works for create & destroy methods
        #Not done for comments and campaign and saved activity

        #create summary
        summary = Summary.create_summary(:user_id => params[:author_id],:activity_word_id => word_obj.id,
                                           :activity_name => params[:word],:category_id => params[:category_id])
        if summary.nil?
          Rails.logger.error("Activity => CreateActivity => Summary Creation Failed for #{params.to_s}")
          return nil
        end

        params[:summary_id] = summary.id

        ###################################### CREATE OR UPDATE ACTIVITY #################################################

        #dont store text for private posts
        if params[:status_at_source] == AppConstants.status_private
          text = ""
          Rails.logger.info("[MODEL] [ACTIVITY] [CREATE_ACTIVITY] Private Service.. not storing text")
        else
          text = params[:text]
        end

        h = {:activity_word_id => word_obj.id,
             :activity_text =>  text , :activity_name => params[:word],
             :author_id => params[:author_id],
             :summary_id => params[:summary_id], :status => params[:status],
             :source_name => params[:source_name],
             :source_object_id => params[:source_object_id],
             :status_at_source => params[:status_at_source],
             :source_uid => params[:source_ui],
             :actions => params[:actions]
             }

        if !summary.blank? #blank summary is possible when saved activity
          h[:category_id] = summary.category_id
          h[:category_type] = summary.category_type
          params[:category_type] =  summary.category_type #to put in hub
        end

        #default type is post .. check migration
        h[:source_object_type] = params[:source_object_type] if !params[:source_object_type].blank?

        #this is used to insert social data from Fb, twitter etc at their actual time stamp.
        #Auto update of time stamp is switched off. It is enabled immediately after
        #Activity,create! or update in after_save callback
        #Commented - as we are not setting created_at and updated_at manually..But works very neatly..
        #To enable un-comment 4 lines and also in after_save callback
        if !params[:created_at].blank? and !params[:updated_at].blank?
          h[:created_at] = params[:created_at]
          h[:updated_at] = params[:updated_at]
          h[:backup_created_timestamp] = Time.now.utc
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

        #Add activity_word to params hash for hub creation
        params[:activity_word_id] =  word_obj.id

        #Add activity to params hash for hub creation
        params[:activity_id] = obj.id

        ####################################### Create Location #############################################
        if !params[:location].blank?

          #set source name if its is not set
          #source_object_id of location will be set by service provider if applicable [FACEBOOK, TWITTER, GPLUS, FOURSQUARE etc can set]
          #Source

          params[:location][:source_name] = params[:source_name] if params[:location][:source_name].blank?

          loc= Location.create_location(params[:location])

          if !loc.nil?
            #Add location to params hash for hub creation
            params[:location_id] = loc.id
            Activity.update_all({:base_location_id => params[:location_id]},{:id => obj.id})
          end
        end

        ################################### Generate Mentions #################################################
#          if !params[:text].blank?
#              params[:text] = Mention.create_mentions(params[:text], obj)
#
#              #Save location and Mentions too
#              #obj.update_attributes(:activity_text => params[:text],:base_location_id => params[:location_id] )
#              Activity.update_all({:activity_text => params[:text],:base_location_id => params[:location_id]},
#                                  {:id => obj.id})
#          end


        ################################## CREATE DOCUMENTS ###################################################
        #first get the mentioned document links
        array = []

        #process in-text embedded links only for check-ins in Actwitty
        #for rest process all links ( attached + in-text ) in data adaptor of provider
        #this is done so that we can categorize external posts from providers in bulk

        if params[:source_name] == AppConstants.test_service
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

            d = Document.create_document({:owner_id => params[:author_id], :activity_id => obj.id, :activity_word_id => word_obj.id,
                         :summary_id => params[:summary_id], :url => attr[:url],:provider => attr[:provider],:uploaded => attr[:uploaded],
                         :mime => attr[:mime],:status => params[:status], :title => attr[:title], :description => attr[:description],
                         :image_url => attr[:image_url], :image_width => attr[:image_width],:image_height => attr[:image_height],
                         :category_id => attr[:category_id], :canonical_url => attr[:canonical_url], :cache_age => attr[:cache_age],
                         :source_name =>params[:source_name],:source_msg_id =>params[:source_object_id], :status_at_source=> params[:status_at_source],
                         :source_object_id => attr[:source_object_id],:created_at => params[:created_at],
                         :updated_at => params[:updated_at] })


          end
        end


        #################################CREATE HASH TAGS######################################################
        #first get the mentioned tags
        array = []
        array = get_tags(params[:text]) if !params[:text].blank?

        !params[:tags].blank? ? params[:tags].concat(array) :(params[:tags] = array if !array.blank?)

        if !params[:tags].blank?
          params[:tags].each do |attr|

            t =Tag.create_tag({:author_id => params[:author_id], :activity_id => obj.id,
                          :activity_word_id => word_obj.id, :source_name => params[:source_name],:name => attr[:name],
                          :tag_type => attr[:tag_type],
                          :status => params[:status], :summary_id => params[:summary_id],:source_name =>params[:source_name],
                          :source_msg_id =>params[:source_object_id], :status_at_source=> params[:status_at_source],
                          :created_at => params[:created_at], :updated_at => params[:updated_at]})


          end
        end

        ################################# CREATE ENTITIES #####################################################

        add_entities(params) if !params[:text].blank?

        ################################# FINALLY UPDATE ANALYTICS ############################################
        obj.reload

        Rails.logger.info("[MODEL] [ACTIVITY] [create_activity] leaving ")

        #enable created_at and updated_at auto update immediately at after_save = just after Activity.create!
        ActiveRecord::Base.record_timestamps = true if ActiveRecord::Base.record_timestamps == false

        return obj

    rescue => e
        Rails.logger.error("[MODEL] [ACTIVITY] [create_activity] **** RESCUE **** => CreateActivity failed with #{e.message} for #{params.to_s}")

        #enable created_at and updated_at auto update immediately at after_save = just after Activity.create!
        ActiveRecord::Base.record_timestamps = true if ActiveRecord::Base.record_timestamps == false

        #Validation Uniqueness fails  [:source_object_id, :source_name, :author_id]
        if /has already been taken/ =~ e.message
          Rails.logger.info("[MODEL] [ACTIVITY] [create_activity] Rescue => Unique Validation failed
                        [msg_id => #{params[:source_object_id]} source_name => #{params[:source_name]}
                        author_id => #{params[:author_id]}]")
        end
        nil
    end

    #INPUT {activity_id => 123, :current_user_id => 234 } #self user -id
    #OUTPUT => attributes of deleted activity
    def remove_activity(params)

      Rails.logger.info("[MODEL] [Activity] [remove_activity] entering ")

      a = Activity.where(:id => params[:activity_id], :author_id => params[:current_user_id]).first

      if a.blank?
        Rails.logger.info("[MODEL] [Activity] [remove_activity] returning empty json ")
        return {}
      end

      a.destroy

      Rails.logger.info("[MODEL] [Activity] [remove_activity] leaving ")

      a.attributes

    rescue => e
      Rails.logger.error("[MODEL] [ACTIVITY] [remove_activity] **** RESCUE **** FAILED #{e.message} for #{params.to_s}")
      {}
    end

  end


  private

    class << self

      def add_entities(params={})

         Rails.logger.info("[MODEL] [ACTIVITY] [add_entities] entering =>  #{params.to_s}")

         entities = []

         #for data coming from services like FB, Twitter .. Bulk Processed
         entities = params[:entities] if !params[:entities].blank?

         entities.each do |entity|
           obj = Entity.create_entities(entity)

           if !obj.nil?
             #Add entity to params hash for hub creation
             if  params[:entity_hash].nil?
               params[:entity_hash] = {}
             end
              params[:entity_hash][obj.entity_name]  = obj.id

           end
         end

         params[:user_id] = params[:author_id]
         Hub.create_hub(params) if !params[:entity_hash].blank?

         Rails.logger.info("[MODEL] [ACTIVITY] [add_entities] leaving ")

      rescue => e
        Rails.logger.error("[MODEL] [ACTIVITY] [add_entities] **** RESCUE **** #{e.message} for #{params.to_s}")
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
#  documents_count          :integer         default(0)
#  tags_count               :integer         default(0)
#  hubs_count               :integer         default(0)
#  status                   :integer         not null
#  summary_id               :integer
#  source_object_id         :text
#  status_at_source         :integer
#  source_name              :text            not null
#  source_uid               :text
#  source_object_type       :text            default("post")
#  category_type            :text
#  category_id              :text
#  actions                  :text
#  backup_created_timestamp :datetime        default(2012-02-09 11:31:58 UTC)
#  created_at               :datetime
#  updated_at               :datetime
#

