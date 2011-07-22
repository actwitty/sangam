require "query_manager"
#TODO add i18n error messages in all validations
#TODO move all constants to environments
class Activity < ActiveRecord::Base

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

  # documents have life time more than activity
  has_many    :documents, :dependent => :nullify, :order => "updated_at DESC"

  #:destroy is not causing circular effect as there is father "delete" in campaign
  has_one       :father_campaign, :foreign_key => :father_id, :class_name => "Campaign", :dependent => :destroy

   #:destroy is not causing circular effect as there is father "delete" in comment
  has_one       :father_comment, :foreign_key => :father_id, :class_name => "Comment", :dependent => :destroy


  validates_existence_of  :author_id
  validates_existence_of  :activity_word_id

  validates_existence_of  :summary_id, :allow_nil => true
  validates_existence_of  :base_location_id, :allow_nil => true

  validates_presence_of   :activity_name

  validates_length_of     :activity_text , :maximum => AppConstants.activity_text_length

  validates_length_of     :activity_name,   :in => 1..AppConstants.activity_name_length

  before_destroy    :clear_serialized_summary

  protected
    def clear_serialized_summary
      if !self.summary_id.nil?
        s=Summary.where(:id => self.summary_id).first
        if s.activity_array.include?(self.id)
          puts "deleting activity"
          s.activity_array.delete(self.id)
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
  #    :documents => [{:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "https://s3.amazonaws.com/xyz.jpg" }]
  #    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )

      def create_activity(params={})

        summary = nil
        summary_hash = {}

        #don allow space separated words
        if !params[:activity].scan(/\s+/).blank?
          return {}
        end


        #create the activity word
        word_obj = ActivityWord.create_activity_word(params[:activity], "verb-form")

        #Add activity_word to params hash for hub creation
        params[:activity_word_hash] = {:word => params[:activity], :id => word_obj.id}


        #summary is processed earlier as to keep counter_cache active.
        #counter_cache only works for create & destroy methods
        if params[:enrich] == true #Not done for comments and campaign
          #create summary
          summary = Summary.create_summary(:user_id => params[:author_id],:activity_word_id => word_obj.id, :activity_name => params[:activity])
          if summary.nil?
            Rails.logger.error("Activity => CreateActivity => Summary Creation Failed for #{params.to_s}")
            return nil
          end
          params[:summary_id] = summary.id
        end


        #create activity => either root or child
        obj = Activity.create!(:activity_word_id => word_obj.id,:activity_text => params[:text] , :activity_name => params[:activity],
                                 :author_id => params[:author_id], :summary_id => params[:summary_id],:enriched => false)

        #Add activity to params hash for hub creation
        params[:activity_hash] = obj.id


        #Not done for comments and campaign
        if params[:enrich] == true

          #Serialize Most recent activity texts
          if !obj.activity_text.blank?
            summary_hash["activity"] = [obj.id]
          end


          #create location
          if !params[:location].blank?
           loc= Location.create_location(params[:location])
           if !loc.nil?
              #Add location to params hash for hub creation
              params[:location_hash] = loc.id
              #Serialize Most recent location
              summary_hash["location"] = [loc.id]
           end
          end


          #Generate Mentions
          params[:text] = Mention.create_mentions(params[:text], obj)


          #Save location and Mentions too
          obj.update_attributes(:activity_text => params[:text],:base_location_id => params[:location_hash] )


          #create documents
          if !params[:documents].blank?
            d_array = []
            params[:documents].each do |attr|
              d = Document.create_document(:owner_id => params[:author_id], :activity_id => obj.id, :activity_word_id => word_obj.id,
                                       :summary_id => params[:summary_id], :url => attr[:url], :thumb_url => attr[:thumb_url])
              d_array << d.id if !d.nil?
            end

            #Serialize Most recent docs
            summary_hash["document"] = d_array
          end


          puts obj.inspect

          #Update Summary Data
          summary.serialize_data(summary_hash)

          params[:text].blank? ? create_hub_entries(params) : post_proc_activity(params)

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
        hubs_hash[:activity_name] =  params[:activity_word_hash][:word]
        hubs_hash[:user_id] = params[:author_id]
        hubs_hash[:summary_id] = params[:summary_id]


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
#  activity_name    :string(255)     not null
#  author_id        :integer         not null
#  base_location_id :integer
#  documents_count  :integer
#  comments_count   :integer
#  summary_id       :integer
#  enriched         :boolean
#  created_at       :datetime
#  updated_at       :datetime
#

