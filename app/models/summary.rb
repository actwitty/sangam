require 'thread'

class Summary < ActiveRecord::Base

  serialize :entity_array,   Array
  serialize :document_array, Array
  serialize :activity_array, Array
  serialize :location_array, Array
  serialize :tag_array,       Array
  serialize :social_counters_array, Array
  serialize :theme_data,      Hash
  serialize :category_data,      Hash
  serialize :analytics_summary, Hash

  has_many    :activities, :order => "updated_at DESC"

  has_many    :entities,   :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :locations,  :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :documents,  :order => "updated_at DESC"

  has_many    :tags,       :order => "updated_at DESC"

  has_many    :campaigns,       :order => "updated_at DESC"

  has_one     :theme

  has_many    :summary_subscribes

  has_one     :summary_category

  has_one     :summary_rank

  belongs_to  :user, :touch => true
  belongs_to  :activity_word #, :touch => true
  belongs_to  :theme

  validates_existence_of  :user_id, :activity_word_id

  validates_presence_of :activity_name
  validates_length_of   :activity_name , :in => 1..AppConstants.activity_name_length

  validates_uniqueness_of :user_id, :scope => :activity_word_id

  before_destroy :ensure_safe_destroy

  after_destroy  :ensure_destroy_of_associations


  public

    #need to destroy the associations this way as summary deletion is reference counter based. So  if summary
    #does not get deleted, associations will be deleted with dependent => destroy/delete.
    #So using after_destroy rather than making the associations dependent =>destroy/delete
    def ensure_destroy_of_associations
      Rails.logger.info("[MODEL] [SUMMARY] [ensure_destroy_of_associations] entering #{self.inspect}")

      SummarySubscribe.destroy_all(:summary_id => self.id)  #destroy_all as need to update contacts

      Theme.delete_all(:summary_id => self.id)  #deleta_all as no associations

      SummaryCategory.delete_all(:summary_id => self.id)  #deleta_all as no associations

      SummaryRank.delete_all(:summary_id => self.id)  #deleta_all as no associations

      Rails.logger.info("[MODEL] [SUMMARY] [ensure_destroy_of_associations] Leaving")
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
    class << self

      include TextFormatter
      include QueryPlanner

      #INPUT => :activity_word_id => 123, :user_id => 123, :activity_name => "eating"", :summary_category => "sports"
      def create_summary(params)

         summary = Summary.create!(:activity_word_id => params[:activity_word_id], :user_id => params[:user_id],
                             :activity_name => params[:activity_name],:document_array => [],
                             :activity_array => [], :location_array => [], :entity_array => [], :tag_array => [])

         a = Theme.create_theme(:theme_type => AppConstants.theme_default,
                                :summary_id => summary.id,
                                :author_id => summary.user_id
                                )

         summary.theme_data = format_theme(a) if !a.blank?

         #create category of summary
         #there is not such need of creating separate table but it give vertical splitting for summary search and  other future ops
         if summary.category_id.blank?

           params[:summary_category] = AppConstants.default_category if params[:summary_category].blank?

           category = SummaryCategory.create_summary_category(:summary_id => summary.id,:activity_name => params[:activity_name],
                                                              :category_id => params[:summary_category])

           if category.blank?
             Rails.logger.error("[MODEL] [SUMMARY] [CREATE_SUMMARY] summary category creation failed #{params.inspect}")
             #delete summary if it is created first time
             if summary.activities.size == 0
               destroy_all(:id => summary.id)
               Rails.logger.error("[MODEL] [SUMMARY] [CREATE_SUMMARY] summary delete as category invalid")
             end
             return nil
           end
           summary.category_id = category.category_id
           summary.category_type = category.category_type
         end

         #update data here itself..dont wait to get it finished in create_activity
         summary.update_attributes!(summary.attributes)

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
      #OUPUT => returns summary object attributes as hash
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

        #delete all activities.. summary will be deleted at last
        Activity.destroy_all(:summary_id => params[:summary_id])

        Rails.logger.info("[MODEL] [SUMMARY] [delete_summary] leaving  " + params.to_s)
        {}
      end

      #INPUT => summary_id => 123, :new_name => "foodie", :user_id => 123
      def update_summary(params)
        Rails.logger.info("[MODEL] [SUMMARY] [update_summary] entering  " + params.to_s)

        if params[:new_name].blank?
          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => BLANK summary name given  " )
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

        params[:new_name].capitalize!

        if summary_old.activity_name == params[:new_name]
          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => same summary name given  " )
          return summary_old.attributes
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
          update_summary_id_in_models(summary_old,summary)

          #rebuild and reload to return properly. counter reset is happening in rebuild
          #summary.rebuild_a_summary
          SummaryRank.add_analytics({:fields => ["all"], :summary_id => summary.id})
          summary.reload

          #reset needed otherwise destroy will not happen
          Summary.reset_counters(summary_old.id,:activities, :documents, :campaigns, :tags)
          Summary.reset_counters(summary.id,:activities, :documents, :campaigns, :tags)

          #reload & destroy old summary
          summary_old.reload

          if summary_old.activities.size == 0
          summary_old.destroy
          else
           #this part should not be executed
           #summary_old.rebuild_a_summary
            SummaryRank.add_analytics({:fields => ["all"], :summary_id => summary_old.id})
          end

          Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => merging with old summary " )
        end

        Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => leaving #{params.inspect}")
        return summary.attributes

      rescue => e
       Rails.logger.info("[MODEL] [SUMMARY] [update_summary] => Rescue ERROR #{e.message} for #{params.inspect}")
       nil
      end


      #INPUT
      #user_id => 123 #If same as current use then mix streams with friends other wise only user
      #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
      ##             OR 4(AppConstants.page_state_public)
      #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
      #OUTPUT
      #[
      # {:id=>24,
      #
      # :word=>{:word_id=>44, :name=>"eating"},
      #
      # :time=>Thu, 21 Jul 2011 14:44:26 UTC +00:00,
      #
      # :user=>{:id=>39, :full_name=>"lemony3 lime3", :photo=>"images/id_3"}, :count=>1, :locations=>[],
      #
      # :activity_count => 23, :document_count =>12, :tag_count => 34,
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
      # :category_data => {
      #                      :id => "food",:name => "food and drink",:type => "/food", :hierarchy => "/", :default_channel => "food"
      #                   }
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
      #  :social_counters => [{:source_name=>"twitter", :action=>"share", :count=>1}, {:source_name=>"facebook", :action=>"share", :count=>2}]
      #
      #]
      require "social_fetch/social_fetch"

      def get_summary(params)

        Rails.logger.debug("[MODEL] [SUMMARY] [get_summary] entering")

        #Below two lines are for testing
        #Activity.destroy_all(:author_id => params[:current_user_id])
        SocialAggregator.create_social_data({:user_id => params[:current_user_id], :provider => "facebook"})

        h = process_filter_modified(params)

        if h.blank?
          Rails.logger.debug("[MODEL] [SUMMARY] [get_summary] Leaving => Blank has returned by process_filter => #{params.inspect}")
          return {}
        end

        documents= {}
        tags = {}
        activities = {}
        locations = {}
        entities = {}
        friends ={}
        subscribed = {}

        summaries = []
        index = 0

        h[:id] = h[:summary_id] if !h[:summary_id].blank?
        h.delete(:summary_id)
        user = h[:user_id]

        h = pq_summary_filter(h)

        summary = Summary.includes(:user).where(h).limit(AppConstants.max_number_of_summmary).order("updated_at DESC").
            all.each do |attr|

            summaries[index] ={:id => attr.id,
                                 :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                                 :time => attr.updated_at,
                                 :user => {:id => attr.user_id, :full_name => attr.user.full_name,
                                           :photo => attr.user.photo_small_url, :user_type => attr.user.user_type}, #user type is added for ADMIN USER
                                 :activity_count => attr.activities.size,
                                 :document_count => attr.documents.size, :tag_count => attr.tags.size,
                                 :social_counters => attr.social_counters_array, :theme_data => attr.theme_data,
                                 :category_data => format_summary_category(attr.category_id),
                                 :analytics_summary => attr.analytics_summary,
                                 #:locations => [], :documents => [], :tags => [],:entities => [], :recent_text => [], :friends => []
                                  }
#            attr.location_array.each {|idx| locations[idx].nil? ? locations[idx] = [index] : locations[idx] <<  index }
#            attr.document_array.each {|idx| documents[idx].nil? ? documents[idx] = [index] : documents[idx] <<  index }
#            attr.tag_array.each       {|idx| tags[idx].nil? ? tags[idx] = [index] : tags[idx] <<  index }
#            attr.entity_array.each {|idx| entities[idx].nil? ? entities[idx] = [index] : entities[idx] <<  index }
#            attr.activity_array.each {|idx| activities[idx].nil? ? activities[idx] = [index] : activities[idx] <<  index }

            subscribed[attr.id]  = index

            #creates the hash mapping words to respective index
            friends[attr.activity_word_id].nil? ? friends[attr.activity_word_id] = [index] : friends[attr.activity_word_id] << index
            index = index + 1
          end

        # At present blocked as we dont need it
    #    if !documents.keys.blank?
    #      Document.where(:id => documents.keys).order("updated_at DESC").all.each do|attr|
    #        h = format_document(attr)
    #        documents[attr.id].each do |idx|
    #          summaries[idx][:documents] << h[:document]
    #        end
    #      end
    #      documents = {}
    #    end
    #
    #    if !tags.keys.blank?
    #      Tag.where(:id => tags.keys).order("updated_at DESC").all.each do|attr|
    #        h = format_tag(attr)
    #        tags[attr.id].each do |idx|
    #          summaries[idx][:tags] << h[:tag]
    #        end
    #      end
    #      tags = {}
    #    end
    #
    #    if !locations.keys.blank?
    #      Location.where(:id => locations.keys).order("updated_at DESC").all.each do|attr|
    #        h = format_location(attr)
    #        #h[:id] = attr.id
    #        locations[attr.id].each do |idx|
    #          summaries[idx][:locations] << h
    #        end
    #      end
    #      locations={}
    #    end
    #
    #    if !entities.keys.blank?
    #      Entity.where(:id => entities.keys).order("updated_at DESC").all.each do|attr|
    #        entities[attr.id].each do |idx|
    #          #summaries[idx][:entities] << {:id => attr.id, :name => attr.entity_name, :image =>  attr.entity_image }
    #          summaries[idx][:entities] << format_entity(attr)
    #        end
    #      end
    #      entities ={}
    #    end
    #
    #    if !activities.keys.blank?
    #      Activity.where(:id => activities.keys).order("updated_at DESC").all.each do|attr|
    #        activities[attr.id].each do |idx|
    #          summaries[idx][:recent_text] << { :text => attr.activity_text, :time => attr.updated_at.utc}
    #        end
    #      end
    #      activities = {}
    #    end
    #
    #    # Mark Summaries which user has not subscribed. This will be only applicable if page_state == all or public
    #    #TODO => Public summary marking is blocked as of now
    #
    #    if (params[:user_id] != params[:current_user_id])||(params[:page_type] == AppConstants.page_state_all)
    #
    #      SummarySubscribe.where(:summary_id => subscribed.keys, :subscriber_id => params[:current_user_id] ).all.each do |attr|
    #        summaries[subscribed[attr.summary_id]][:subscribed] = true
    #      end
    #
    #    end
    #    subscribed = {}
    #
    #    #FETCH RELATED FRIEND
    #
    #    #friends will only be fetched current use == visited user
    #    if params[:page_type] == AppConstants.page_state_all
    #      #user's friends are already populated in user ARRAY
    #      Rails.logger.debug("[MODEL] [USER] [get_summary] getting friends related friends - OTHERS MODE" )
    #      user.delete(params[:current_user_id]) if user.blank?
    #    else
    #      Rails.logger.debug("[MODEL] [USER] [get_summary] getting friends related friends - ME MODE" )
    #      #other wise get the user's followings and populate the related followings
    #      user = Contact.select("friend_id").where(:user_id => params[:current_user_id]).map(&:friend_id)
    #    end
    #
    #    if (!user.blank?) && (!friends.keys.blank?)
    #      h  = {}
    #      h[:user_id] = user
    #      h[:activity_word_id] = friends.keys
    #      h = pq_summary_filter(h)
    #
    #      Summary.includes(:user).where(h).group(:user_id, :activity_word_id ).count.each do |k,v|
    #        activities[k[0]] = k[1]
    #      end
    #
    #      Rails.logger.debug("[MODEL] [USER] [get_summary] getting friends related friends - #{activities.keys.inspect} \n #{friends.keys.inspect}" )
    #      if !activities.keys.blank?
    #        User.where(:id => activities.keys).all.each do |attr|
    #          # activities[attr.id] => activity_word_id
    #          friends[activities[attr.id]].each do |idx|
    #
    #            #dont show a friend in his own summary as related friend
    #            if summaries[idx][:user][:id] != attr.id
    #
    #              if summaries[idx][:friends].size < AppConstants.max_number_of_a_type_in_summmary
    #                summaries[idx][:friends] << {:id => attr.id , :full_name => attr.full_name, :photo => attr.photo_small_url}
    #              end
    #
    #            end
    #
    #          end
    #
    #        end
    #      end
    #    end

        Rails.logger.debug("[MODEL] [SUMMARY] [get_summary] leaving")
        #FETCHING RELATED FRIEND -- DONE
        summaries

      end

  private
        #called from update_summary
    def update_word_in_models(word, word_id, summary)
      Summary.update_all({:activity_name => word, :activity_word_id => word_id},
                         {:id => summary.id })
      Activity.update_all({:activity_name => word, :activity_word_id =>word_id},{ :summary_id => summary.id })
      Document.update_all({:activity_word_id =>word_id},{ :summary_id => summary.id })
      Tag.update_all({:activity_word_id =>word_id},{ :summary_id => summary.id })
      Hub.update_all({:activity_word_id =>word_id},{ :summary_id => summary.id })
    end

      #called from update_summary
    def update_summary_id_in_models(summary_old, summary_new)
      Activity.update_all({:activity_name => summary_new.activity_name, :activity_word_id =>summary_new.activity_word_id,
                               :summary_id => summary_new.id}, { :summary_id => summary_old.id })
      Document.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                              { :summary_id => summary_old.id })
      Tag.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                        { :summary_id => summary_old.id })
      Hub.update_all({:activity_word_id =>summary_new.activity_word_id, :summary_id => summary_new.id},
                         { :summary_id => summary_old.id })
      SocialCounter.update_all({:summary_id => summary_new.id}, {:summary_id =>summary_old.id})

#      SocialAggregator.update_all({:summary_id => summary_new.id}, {:summary_id =>summary_old.id})

      #theme, summary_category and summary_rank has unique summary constraint so no point in replacing that
      #summary_subscribers of old summary will be removed in destroy
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
#  category_id           :string(255)
#  category_type         :string(255)
#  rank                  :string(255)
#  analytics_summary     :text
#  campaigns_count       :integer         default(0)
#  created_at            :datetime
#  updated_at            :datetime
#

