class LocalAction < ActiveRecord::Base

  serialize :meta, Hash

  belongs_to :author, :class_name => "User"
  belongs_to :summary

  validates_existence_of :author_id, :summary_id
  validates_uniqueness_of :name, :scope => [:summary_id, :author_id]

  after_save :update_analytics

  after_destroy :update_analytics

  def update_analytics
    Rails.logger.info("[MODEL] [LOCAL_ACTION] [update_analytics] Entering #{self.id}")

    SummaryRank.add_analytics(:fields => ["local_actions"], :user_id => self.author_id, :summary_id => self.summary_id)

    Rails.logger.info("[MODEL] [LOCAL_ACTION] [update_analytics] Leaving #{self.id}")
  rescue => e
    Rails.logger.error("[MODEL] [LOCAL_ACTION] [update_analytics] **** RESUCE **** #{e.message} for #{self.id}")
  end

  class << self
    #INPUT => {
    #           :author_id => 123,
    #           :summary_id => 123,
    #           :name => "vote" OR "recommend"
    #           :meta => {:text => "dksdkdsdkdfk lsdjflskdf"} #[OPTIONAL] used for recommend
    #        }
    def create_local_action(params)
      Rails.logger.info("[MODEL] [LOCAL_ACTION] [CREATE_LOCAL__ACTION] Entering #{params.inspect}")

      obj = create!(params)

      Rails.logger.info("[MODEL] [LOCAL__ACTION] [CREATE_LOCAL__ACTION] Leaving #{params.inspect}")
      obj

    rescue => e
      Rails.logger.error("[MODEL] [LOCAL_ACTION] [CREATE_LOCAL__ACTION] **** RESCUE ****  #{e.message} for #{params.inspect}")
      #Validation Uniqueness fails  [:summary_id, :name, :author_id]
      if /has already been taken/ =~ e.message
        Rails.logger.info("[MODEL] [LOCAL_ACTION] [CREATE_LOCAL__ACTION] Rescue => Unique Validation failed
                        [msg_id => #{params[:summary_id]} source_name => #{params[:name]}
                        author_id => #{params[:author_id]}]")
      end
      nil
    end
  end
end

# == Schema Information
#
# Table name: local_actions
#
#  id         :integer         not null, primary key
#  author_id  :integer
#  summary_id :integer
#  meta       :text            default("--- {}\n\n")
#  name       :text
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

