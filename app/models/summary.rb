class Summary < ActiveRecord::Base

  serialize :entity_array,   Array
  serialize :document_array, Array
  serialize :activity_array, Array
  serialize :location_array, Array
  serialize :tag_array,       Array
  serialize :social_counters_array, Array
  serialize :theme_data,      Hash

  has_many    :activities, :order => "updated_at DESC"

  has_many    :entities,   :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :locations,  :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :documents,  :order => "updated_at DESC"

  has_many    :tags,       :order => "updated_at DESC"

  has_one     :theme

  has_many    :summary_subscribes

  belongs_to  :user, :touch => true
  belongs_to  :activity_word, :touch => true
  belongs_to  :theme

  validates_existence_of  :user_id, :activity_word_id

  validates_presence_of :activity_name
  validates_length_of   :activity_name , :in => 1..AppConstants.activity_name_length

  validates_uniqueness_of :user_id, :scope => :activity_word_id

  before_destroy :ensure_safe_destroy

  after_destroy  :ensure_destroy_of_theme_and_summary_subscribe


  public

    #need to destroy the associations this way as summary deletion is reference counter based. So  if summary
    #does not get deleted, associations will be deleted with dependent => destroy/delete. So using after_destroy
    def ensure_destroy_of_theme_and_summary_subscribe
      Rails.logger.info("[MODEL] [SUMMARY] [ensure_destroy_of_theme_and_summary_subscribe] entering #{self.inspect}")
      SummarySubscribe.destroy_all(:summary_id => self.id)
      Theme.delete_all(:summary_id => self.id)
      Rails.logger.info("[MODEL] [SUMMARY] [ensure_destroy_of_theme_and_summary_subscribe] Leaving")
    end


  def rebuild_a_summary

    s = self

    if self.nil?
      return
    end

    Rails.logger.info("[MODEL] [SUMMARY] [rebuild_a_summary] resetting summary #{self.inspect}")

    #Recreate Document Array for given summary
    s.activity_array = []
    a = Activity.where(:summary_id => self.id, :blank_text => false).group(:id).
            limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
    s.activity_array = a.keys if !a.blank?


    #Recreate Document Array for given summary
    s.document_array = []
    a = Document.where(:summary_id => self.id).group(:id).
            limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
    s.document_array = a.keys if !a.blank?

    #Recreate Location Array for given summary
    s.location_array = []
    a = Activity.where(:summary_id => self.id, :base_location_id.not_eq => nil).group(:base_location_id).
           limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
    s.location_array = a.keys if !a.blank?

    #Recreate Entity Array for given summary
    s.entity_array = []
    a = Hub.where(:summary_id => self.id, :entity_id.not_eq => nil).group(:entity_id).
            limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
    s.entity_array = a.keys if !a.blank?

    #Recreate Entity Array for given summary
    s.tag_array = []
    a = Tag.where(:summary_id => self.id).group(:id).
            limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
    s.tag_array = a.keys if !a.blank?

    #Recreate Social Counter Array for given summary
    s.social_counters_array = []
    SocialCounter.where(:summary_id => self.id).group(:source_name, :action).count.each do |k,v|
      s.social_counters_array << {:source_name => k[0], :action => k[1], :count => v}
    end

    s.update_attributes(s.attributes)

    Summary.reset_counters(self.id,:activities, :tags, :documents)

    Rails.logger.info("[MODEL] [SUMMARY] [rebuild_a_summary] leaving")

  end


  def ensure_safe_destroy
      puts "before summary destroy #{self.activities.size} "
      #this case of activities.size  == 1 can come only when a summary destroy is called from activity destroy.
      #as activity destroy will be in transaction so count will still be 1
      #For rest of cases of direct summary destroy, always the destruction should happen when activities.size == 0.
      #SO BE CAREFUL
      if self.activities.size <= 1
        Rails.logger.info("Summary Getting Deleted #{self.inspect}")
      else
        Rails.logger.info("Summary Safe #{self.inspect}")
        #cant call rebuild_a_summary from here as this is making the transaction itself false
        false
      end
    end

  public
    include RingBuffer

    #INPUT => {"document" => [1,2,3]},
    #         {"location" => [1,2,3]},
    #         {"activity" => [2]}.
    #         {"entity" => [2,4,5]}
    #         {"tag"  => [2,3,4]}
    def serialize_data(params)
        array = []
        hash = {}

        params.keys.each do |attr|
          serial = "#{attr}_array"

          if self[serial].nil?
            self[serial] = []
          end

          array = self[serial]

          #removes duplicates from params
          common = array & params[attr]
          params[attr] = params[attr] - common

          array = ring_buffer(array, AppConstants.max_number_of_a_type_in_summmary, params[attr])

          hash[serial.to_sym] = array
        end

        self.update_attributes(hash)
    end
    def deserialize_data

    end
    class << self

      include TextFormatter
      include QueryPlanner

      #INPUT => :activity_word_id => 123, :user_id => 123, :activity_name => "eating""
      def create_summary(params)

         summary = Summary.create!(:activity_word_id => params[:activity_word_id], :user_id => params[:user_id],
                             :activity_name => params[:activity_name],:document_array => [],
                             :activity_array => [], :location_array => [], :entity_array => [], :tag_array => [])

         a = Theme.create_theme(:theme_type => AppConstants.theme_default,
                                :summary_id => summary.id,
                                :author_id => summary.user_id
                                )
         summary.theme_data = format_theme(a) if !a.nil?
         return summary
      rescue => e

         Rails.logger.info("Summary => create_summary => Rescue " +  e.message )
         summary = nil

         #Validation Uniqueness fails
         if /has already been taken/ =~ e.message

           params.delete(:activity_name)

           params = pq_summary_filter(params)
           summary = Summary.where(params).first

           Rails.logger.info("Summary => create_summary => Rescue => Uniq index found " + params.to_s)
         end
        return summary
      end

      #INPUT => summary_id => 123 , :user_id => 123
      def delete_summary(params)
        Rails.logger.info("[MODEL] [SUMMARY] [delete_summary] entering  " + params.to_s)

        s = Summary.where(:id => params[:summary_id]).first

        if s.blank?
          Rails.logger.info("[MODEL] [SUMMARY] [delete_summary] invalid summary  " )
          return {}
        end

        if s.user_id != params[:user_id]
          Rails.logger.info("[MODEL] [SUMMARY] [delete_summary] invalid user  " )
          return {}
        end

        Activity.destroy_all(:summary_id => params[:summary_id])

        Rails.logger.info("[MODEL] [SUMMARY] [delete_summary] leaving  " + params.to_s)
        {}
      end

      #INPUT => summary_id => 123, :new_name => "foodie", :user_id => 123
      def update_summary(params)
        Rails.logger.info("[MODEL] [SUMMARY] [update_summary] entering  " + params.to_s)

        if params[:new_name].blank?
          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => NLANK summary name given  " )
          return {}
        end

        summary_old= Summary.where(:id => params[:summary_id]).first

        if summary_old.blank?
          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => no such summary exist  " )
          return {}
        end

        if summary_old.user_id != params[:user_id]
          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => invalid user" )
          return {}
        end

        if summary_old.activity_name == params[:new_name]
          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => same summary name given  " )
          return s.attributes
        end

        #if new name is also a new summary, create the activity word and just update the name
        summary = Summary.where(:user_id => summary_old.user_id, :activity_name => params[:new_name]).first

        if summary.blank?
          #Create Activity Word
          word_obj = ActivityWord.create_activity_word(params[:new_name], "verb-form")

          update_word_in_models(params[:new_name], word_obj.id, summary_old)

          summary = Summary.where(:id => summary_old.id).first

          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => new name is new summary for user " )
        else
          #if new name is existing summary, the merge all data of summary to existing summary
          update_word_summary_in_models(summary_old,summary)

          #rebuild and reload to return properly. counter reset is happening in rebuild
          summary.rebuild_a_summary
          summary.reload

           #reset needed otherwise destroy will not happen
          Summary.reset_counters(summary_old.id,:activities)

          #reload & destroy old summary
          summary_old.reload
          if summary_old.activities.size == 0
          summary_old.destroy
          else
           #this part should not be executed
           summary_old.rebuild_a_summary
         end

          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => merging with old summary " )
        end

        summary.attributes
      end

      #INPUT => :activity_id => 123, :new_name => "foodie", :user_id > 123
      def rename_activity_name(params)
         Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name] entering")

         if params[:new_name].blank?
          Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name]  => BLANK activity name given  " )
          return {}
         end

         a = Activity.where(:id => params[:activity_id]).first

         if a.blank?
          Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name]  => invalid activity  " )
          return {}
         end

         if params[:new_name] == a.activity_name
          Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name]  => same activity name given  " )
          return {}
         end

         if params[:user_id] != a.author_id
          Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name]  => invalid user  " )
          return {}
         end

         summary_new = Summary.where(:user_id => a.author_id, :activity_name => params[:new_name]).first
         if summary_new.blank?
           Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name] => summary name for this user does not exist " )
           return {}
         end

         summary_old = Summary.where(:id => a.summary_id).first
         if summary_old.blank?
           Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name] => ERROR old summary is blank how come " )
           return {}
         end

         Activity.update_all({:activity_name => params[:new_name], :activity_word_id =>summary_new.activity_word_id,
                              :summary_id => summary_new.id}, { :id => params[:activity_id] })
         Document.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                             { :activity_id => params[:activity_id] })
         Tag.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                        { :activity_id => params[:activity_id] })
         Hub.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                        { :activity_id => params[:activity_id] })

         summary_new.rebuild_a_summary

         #reset needed otherwise destroy will not happen
         Summary.reset_counters(summary_old.id,:activities)

         #reload & destroy old summary. If activities count is 0
         summary_old.reload
         if summary_old.activities.size == 0
          summary_old.destroy
         else
           summary_old.rebuild_a_summary
         end

         #as we are returning activity so no need to reload
         #summary_new.reload
         #summary_new.attributes

        a.reload
        a.attributes
      end

      private
        def update_word_in_models(word, word_id, summary)
          Summary.update_all({:activity_name => word, :activity_word_id => word_id},
                             {:id => summary.id })
          Activity.update_all({:activity_name => word, :activity_word_id =>word_id},{ :summary_id => summary.id })
          Document.update_all({:activity_word_id =>word_id},{ :summary_id => summary.id })
          Tag.update_all({:activity_word_id =>word_id},{ :summary_id => summary.id })
          Hub.update_all({:activity_word_id =>word_id},{ :summary_id => summary.id })
        end
        def update_word_summary_in_models(summary_old, summary_new)

          Activity.update_all({:activity_name => summary_new.activity_name, :activity_word_id =>summary_new.activity_word_id,
                               :summary_id => summary_new.id}, { :summary_id => summary_old.id })
          Document.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                              { :summary_id => summary_old.id })
          Tag.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                         { :summary_id => summary_old.id })
          Hub.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                         { :summary_id => summary_old.id })
          SocialCounter.update_all({:summary_id => summary_new.id}, {:summary_id =>summary_old.id})
        end
    end
end






# == Schema Information
#
# Table name: summaries
#
#  id                    :integer         not null, primary key
#  user_id               :integer         not null
#  activity_word_id      :integer         not null
#  activity_name         :string(255)     not null
#  activities_count      :integer         default(0)
#  documents_count       :integer         default(0)
#  tags_count            :integer         default(0)
#  location_array        :text
#  entity_array          :text
#  activity_array        :text
#  document_array        :text
#  tag_array             :text
#  social_counters_array :text
#  theme_data            :text
#  created_at            :datetime
#  updated_at            :datetime
#

