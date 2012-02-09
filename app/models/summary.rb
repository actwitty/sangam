require 'thread'

class Summary < ActiveRecord::Base

  serialize :analytics_snapshot, Hash

  has_many    :activities, :order => "updated_at DESC"

  has_many    :entities,   :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :locations,  :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :documents,  :order => "updated_at DESC"

  has_many    :tags,       :order => "updated_at DESC"

  has_many    :campaigns,       :order => "updated_at DESC"

  #has_one     :theme

#  has_many    :summary_subscribes
#
#  has_one     :summary_category

  has_one     :summary_rank

  belongs_to  :user, :touch => true
  belongs_to  :activity_word #, :touch => true
#  belongs_to  :theme

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

      #SummarySubscribe.destroy_all(:summary_id => self.id)  #destroy_all as need to update contacts

      #Theme.delete_all(:summary_id => self.id)  #deleta_all as no associations

      #SummaryCategory.delete_all(:summary_id => self.id)  #deleta_all as no associations

      SummaryRank.delete_all(:summary_id => self.id)  #deleta_all as no associations

      Rails.logger.info("[MODEL] [SUMMARY] [ensure_destroy_of_associations] Leaving")
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
        false
      end
  end

  public

    class << self

      include TextFormatter
      include QueryPlanner

      #INPUT => :activity_word_id => 123, :user_id => 123, :activity_name => "eating"", :category_id => "sports"
      def create_summary(params)

         Rails.logger.info("[MODEL] [SUMMARY] [create_summary] entering #{params.inspect}")

         params[:category_id] = "stories" if params[:category_id].blank?

         params[:category_id] = params[:category_id].downcase

         category = SUMMARY_CATEGORIES[params[:category_id]]

         params[:category_id] = "stories" if category.blank?

         summary = Summary.create!(:activity_word_id => params[:activity_word_id], :user_id => params[:user_id],
                             :activity_name => params[:activity_name],:category_id => params[:category_id],
                             :category_type => SUMMARY_CATEGORIES[params[:category_id]]['type'])

         Rails.logger.info("[MODEL] [SUMMARY] [create_summary] leaving ")
         return summary
      rescue => e

         Rails.logger.error("MODEL] [SUMMARY] [CREATE_SUMMARY] **** RESCUE **** #{e.message} For #{params.inspect}" )
         summary = nil

         #Validation Uniqueness fails
         if /has already been taken/ =~ e.message

           params.delete(:activity_name)

           params = pq_summary_filter(params)
           summary = Summary.where(params).first

           Rails.logger.info("MODEL] [SUMMARY] [CREATE_SUMMARY] Rescue => Uniq index found " + params.to_s)
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


      #INPUT => {:name => "foo"}
      #OUPUT => [{:name  =>"food",  :category_id => "food", :category_name => "food and drink"}, ...]
      def search(params)
        Rails.logger.info("[MODEL] [SUMMARY] [SEARCH] entering #{params}")
        array = []
        if !params[:name].blank?

            where( ['activity_name ILIKE ?', "#{params[:name]}%"]).order("MAX(updated_at) DESC").group(:category_id,:activity_name).count.each do |attr|
              array << {:name => attr[0][1], :category_id => attr[0][0],:category_name => SUMMARY_CATEGORIES[attr[0][0]]['name']}
            end

        end
        Rails.logger.info("[MODEL] [SUMMARY] [SEARCH] leaving #{params}")
        array
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
      # :analytics_snapshot => {
      #                          "posts" =>{:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45} #many new services can come this is Exemplary
      #                         "actions" =>  {:share => 24, :views => 90},
      #                          "documents" =>  {"total" => 160, "image" => 24, "video" => 90, "audio" => 46}
      #                       }
      # :category_id => "food"
      #]

      def get_summary(params)

        Rails.logger.debug("[MODEL] [SUMMARY] [get_summary] entering")

        #Below two lines are for testing
        #Activity.destroy_all(:author_id => params[:current_user_id])
        SocialAggregator.start_social_fetch({:user_id => params[:current_user_id]})


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
                                 :category_id => attr.category_id,
                                 :time => attr.updated_at,
                                 :user => {:id => attr.user_id, :full_name => attr.user.full_name,
                                           :photo => attr.user.photo_small_url, :user_type => attr.user.user_type}, #user type is added for ADMIN USER
                                 :analytics_snapshot => attr.analytics_snapshot,
                                }

            subscribed[attr.id]  = index

            #creates the hash mapping words to respective index
            friends[attr.activity_word_id].nil? ? friends[attr.activity_word_id] = [index] : friends[attr.activity_word_id] << index
            index = index + 1
        end

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
#  id                 :integer         not null, primary key
#  user_id            :integer         not null
#  activity_word_id   :integer         not null
#  activity_name      :text            not null
#  activities_count   :integer         default(0)
#  category_id        :text
#  category_type      :text
#  analytics_snapshot :text
#  created_at         :datetime
#  updated_at         :datetime
#

