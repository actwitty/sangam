require 'thread'

class Summary < ActiveRecord::Base

  serialize   :analytics_snapshot, Hash
  serialize   :enabled_services, Array

  belongs_to  :user, :touch => true
  belongs_to  :activity_word

  validates_existence_of  :user_id, :activity_word_id

  validates_presence_of :activity_name

  validates_uniqueness_of :user_id, :scope => :activity_word_id

  before_destroy :ensure_safe_destroy

  after_destroy  :ensure_destroy_of_associations

  has_many :activities


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

      LocalAction.delete_all(:summary_id => self.id)  #deleta_all as no associations

      Rails.logger.info("[MODEL] [SUMMARY] [ensure_destroy_of_associations] Leaving")
    end



    def ensure_safe_destroy
      Rails.logger.info("[MODEL] [SUMMARY] [ensure_safe_destroy]  Entering before summary destroy #{self.activities.size} ")
      #this case of activities.size  == 1 can come only when a summary destroy is called from activity destroy.
      #as activity destroy will be in transaction so count will still be 1
      #For rest of cases of direct summary destroy, always the destruction should happen when activities.size == 0.
      #SO BE CAREFUL
      if self.activities.size <= 1
        Rails.logger.info("[MODEL] [SUMMARY] [ensure_safe_destroy] Summary Getting Deleted #{self.inspect}")
      else
        Rails.logger.info("[MODEL] [SUMMARY] [ensure_safe_destroy] Summary Safe #{self.inspect}")
        false
      end
    end

  public

    class << self

      #INPUT => :activity_word_id => 123, :user_id => 123, :activity_name => "eating"", :category_id => "sports"
      def create_summary(params)

         Rails.logger.info("[MODEL] [SUMMARY] [create_summary] entering #{params.inspect}")

         params[:category_id] = "stories" if params[:category_id].blank?

         params[:category_id] = params[:category_id].downcase

         category = SUMMARY_CATEGORIES[params[:category_id]]

         params[:category_id] = "stories" if category.blank?

         params[:source_created_at] = Time.now.utc if params[:source_created_at].blank?

         params[:enabled_services] = [] if params[:enabled_services].blank?

         summary = Summary.create!(:activity_word_id => params[:activity_word_id], :user_id => params[:user_id],
                             :activity_name => params[:activity_name],:category_id => params[:category_id],
                             :category_type => SUMMARY_CATEGORIES[params[:category_id]]['type'],
                             :enabled_services => params[:enabled_services],
                             :source_created_at => params[:source_created_at])

         Rails.logger.info("[MODEL] [SUMMARY] [create_summary] leaving ")
         return summary
      rescue => e

         Rails.logger.error("MODEL] [SUMMARY] [CREATE_SUMMARY] **** RESCUE **** #{e.message} For #{params.inspect}" )
         summary = nil

         #Validation Uniqueness fails
         if /has already been taken/ =~ e.message

           summary = Summary.where(:user_id => params[:user_id], :activity_word_id => params[:activity_word_id]).first

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
#  enabled_services   :text
#  created_at         :datetime        not null
#  updated_at         :datetime        not null
#

