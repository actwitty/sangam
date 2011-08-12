require "query_manager"

#TODO add i18n error messages in all validations
#TODO move all constants to environments
class Activity < ActiveRecord::Base

  include  ActionView::Helpers

  belongs_to      :author, :class_name => "User" #, :touch => true user is touched through summary
  belongs_to      :summary, :touch => true, :counter_cache => true, :dependent => :destroy

  belongs_to      :activity_word #, :touch => true user is touched through summary

  belongs_to      :base_location, :class_name => "Location"

  #destroy will happen from activity
  has_many         :hubs, :dependent => :destroy

  has_many         :entities, :through => :hubs
  has_many         :locations,:through => :hubs

  has_many    :mentions, :dependent => :destroy #destroy will happen from activity

  has_many    :campaigns, :dependent => :destroy, :order => "updated_at DESC"

  has_many    :comments, :dependent => :destroy, :order => "updated_at DESC"

  has_many    :tags, :dependent => :destroy, :order => "updated_at DESC"

  # documents have life time more than activity.
  # Documents will be removed from activity destroy as special handling is needed rather than usual destroy
  # UPDATE 03/07/2011 - Now we are destroying  document with post.. so we are putting dependent destroy
  has_many    :documents,  :dependent => :destroy, :order => "updated_at DESC"

  #:destroy is not causing circular effect as there is father "delete" in campaign
  has_one       :father_campaign, :foreign_key => :father_id, :class_name => "Campaign", :dependent => :destroy

   #:destroy is not causing circular effect as there is father "delete" in comment
  has_one       :father_comment, :foreign_key => :father_id, :class_name => "Comment", :dependent => :destroy


  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id

  validates_existence_of  :summary_id, :allow_nil => true
  validates_existence_of  :base_location_id, :allow_nil => true

  validates_presence_of   :activity_name,  :campaign_types, :source_name, :status

  validates_length_of     :activity_name,  :in => 1..AppConstants.activity_name_length

  validates_length_of     :source_name,    :in => 1..AppConstants.source_name_length

  validates_length_of     :sub_title,      :maximum => AppConstants.sub_title_length, :unless => Proc.new{|a| a.sub_title.nil?}

  validates_length_of     :activity_text , :maximum => AppConstants.activity_text_length, :unless => Proc.new{|a| a.activity_text.nil?}

  before_destroy          :clear_dependent_data

  before_save             :sanitize_data

  protected

    def sanitize_data
      self.activity_text = sanitize(self.activity_text, :tags => AppConstants.tag_list, :attributes => ["href", "id", "value"]) if !self.activity_text.blank?
      self.activity_name = sanitize(self.activity_name) if !self.activity_name.blank?
      self.sub_title = sanitize(self.sub_title) if !self.sub_title.blank?
      Rails.logger.debug("[MODEL] [ACTIVITY] [sanitize_data] ")
    end

    def clear_dependent_data

      if self.meta_activity == false
        #clear the documents

        # UPDATE 03/07/2011 - Now we are destroying  document with post.. so we are putting dependent destroy
        # and commenting below 3 queries

#        #First Collect all the document ids of activity
#        ids = Document.where(:activity_id => self.id, :summary_id => self.summary_id).group(:id).count

#        #delete mentioned document first
#        Document.destroy_all(:activity_id => self.id, :uploaded => false)
#
#        #then nullify uploaded document
#        Document.where(:uploaded => true,:activity_id => self.id).update_all(:activity_id => nil, :activity_word_id => nil,
#                                                                            :summary_id => nil)

        #reset summary data

        if !self.summary_id.nil?
          s = Summary.where(:id => self.summary_id).first
          puts "resetting activity summary"

          a = s.activity_array.min
          #then delete the input id form activity array
          if s.activity_array.include?(self.id)
            s.activity_array.delete(self.id)

            #find the id which is just less than minimum present in activity array
            a = Activity.where(:id.lt => a, :summary_id => self.summary_id ).first

            s.activity_array << a.id if !a.blank?
          end

          #Recreate Document Array for given summary
          s.document_array = []
          a = Document.where(:summary_id => self.summary_id).group(:id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
          s.document_array = a.keys if !a.blank?

          #Recreate Location Array for given summary
          s.location_array = []
          a = Hub.where(:summary_id => self.summary_id, :location_id.not_eq => nil).group(:location_id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
          s.location_array = a.keys if !a.blank?

          #Recreate Entity Array for given summary
          s.entity_array = []
          a = Hub.where(:summary_id => self.summary_id, :entity_id.not_eq => nil).group(:entity_id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
          s.entity_array = a.keys if !a.blank?

          #Recreate Entity Array for given summary
          s.tag_array = []
          a = Tag.where(:summary_id => self.summary_id).group(:id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
          s.tag_array = a.keys if !a.blank?

          s.update_attributes(s.attributes)
        end
      end
    end


  public

    class << self


  #    :author_id => 123
  #    :activity => activity word or phrase in activity box
  #    :text =>   ""entity box + @@ + location box" or nil
  #    :location => {
  #                  :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
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

      def create_activity(params={})

        summary = nil
        summary_hash = {}
        document_ids = []
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


        ################################### Create Activity Word ################################################

        word_obj = ActivityWord.create_activity_word(params[:activity], "verb-form")

        #################################### CREATE SUMMARY ######################################################
        #summary is processed earlier as to keep counter_cache active.
        #counter_cache only works for create & destroy methods
        #Not done for comments and campaign and saved activity

        if params[:meta_activity] == false && params[:status] != AppConstants.status_saved
          #create summary
          summary = Summary.create_summary(:user_id => params[:author_id],:activity_word_id => word_obj.id, :activity_name => params[:activity])
          if summary.nil?
            Rails.logger.error("Activity => CreateActivity => Summary Creation Failed for #{params.to_s}")
            return nil
          end
          params[:summary_id] = summary.id
        end

        ###################################### CREATE OR UPDATE ACTIVITY #################################################
        h = {:activity_word_id => word_obj.id,:activity_text => params[:text] , :activity_name => params[:activity],
             :author_id => params[:author_id], :summary_id => params[:summary_id],:enriched => false,
             :status => params[:status], :campaign_types => params[:campaign_types],:source_name => params[:source_name],
             :sub_title => params[:sub_title],:meta_activity => params[:meta_activity]}


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
          params[:text] = Mention.create_mentions(params[:text], obj)

          #Save location and Mentions too
          obj.update_attributes(:activity_text => params[:text],:base_location_id => params[:location_hash] )


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
          puts params[:tags]
          !params[:tags].blank? ? params[:tags].concat(array) :(params[:tags] = array if !array.blank?)

          if !params[:tags].blank?
            params[:tags].each do |attr|

              t =Tag.create_tag(:author_id => params[:author_id], :activity_id => obj.id,
                          :activity_word_id => word_obj.id, :source_name => params[:source_name],:name => attr[:name],
                          :tag_type => attr[:tag_type], :location_id => params[:location_hash],
                         :status => params[:status])

              tag_ids << t.id if !t.nil?

            end
            #Serialize Most recent tags
            summary_hash["tag"] = tag_ids
          end

          ################################# SERIALIZE TO SUMMARY ###################################################
          puts obj.inspect

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

        return obj

      rescue => e
        Rails.logger.error("Activity => CreateActivity failed with #{e.message} for #{params.to_s}")
        nil
      end
    end
  private

    class << self

      include QueryManager
      include TextFormatter

      def create_hub_entries(params = {})
        hubs_hash = {}
        entity = []

        hubs_hash[:activity_id] =  params[:activity_hash]
        hubs_hash[:activity_word_id] =  params[:activity_word_hash][:id]
#        hubs_hash[:activity_name] =  params[:activity_word_hash][:word]
        hubs_hash[:user_id] = params[:author_id]
        hubs_hash[:summary_id] = params[:summary_id]
        hubs_hash[:source_name] = params[:source_name]
        hubs_hash[:status]= params[:status]

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

      rescue => e
         Rails.logger.error("Activity => CreateHubEntries => Failed => #{e.message} => #{params} => hubs_hash = #{hubs_hash}")
      end

      def post_proc_activity(params={})

         temp_text = remove_mentions_and_tags(params[:text])
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

         Rails.logger.error("Activity => PostProcActivity Enrich =>  #{params.to_s}")
      end

      handle_asynchronously :post_proc_activity
    end

end












# == Schema Information
#
# Table name: activities
#
#  id               :integer         not null, primary key
#  activity_word_id :integer         not null
#  activity_text    :text
#  activity_name    :text            not null
#  author_id        :integer         not null
#  base_location_id :integer
#  comments_count   :integer
#  documents_count  :integer
#  tags_count       :integer
#  campaign_types   :integer         not null
#  status           :integer         not null
#  source_name      :text            not null
#  sub_title        :text
#  summary_id       :integer
#  enriched         :boolean
#  meta_activity    :boolean
#  created_at       :datetime
#  updated_at       :datetime
#

