class SummarySubscribe < ActiveRecord::Base

  belongs_to :summary , :touch => true
  belongs_to :subscriber, :class_name => "User" #, :touch => true
  belongs_to :owner, :class_name => "User"         #channel owner

  validates_existence_of   :summary_id, :owner_id, :subscriber_id

  validates_presence_of :summary_name
  validates_length_of   :summary_name , :in => 1..AppConstants.activity_name_length

  validates_uniqueness_of  :summary_id, :scope => :subscriber_id
  after_destroy            :clear_follow

  def clear_follow
    Rails.logger.info("[MODEL] [SUMMARY_SUBSCRIBE] [clear_follow] entering")
    cnt = SummarySubscribe.where(:subscriber_id => self.subscriber_id, :owner_id => self.owner.id).count
    if cnt == 0
      Contact.unfollow(self.subscriber_id, self.owner_id)
    end

    #also update the analytics
    update_analytics

    Rails.logger.info("[MODEL] [SUMMARY_SUBSCRIBE] [clear_follow] leaving")
  end

  class << self
    #INPUT
    # :summary_id => 123
    #OUTPUT
    # [{ :subscriber_name => "alok",:subscriber_id => 234,:subscriber_photo =>"http://a.com"}]
    def get_summary_subscribers(summary_id)
      array = []
      includes(:subscriber).where(:summary_id => summary_id).all.each do |attr|
        array <<  {:subscriber_name => attr.subscriber.full_name, :subscriber_id => attr.subscriber_id,
                   :owner_photo => attr.subscriber.photo_small_url}
      end
      array
    end
    #INPUT
    # :subscriber_id => 123
    #OUTPUT
    # [{:summary_name => "eating", :summary_id => 123, :owner_name => "alok",:owner_id => 234,:owner_photo =>"http://a.com"}]
    def get_subscriber_summary(subscriber_id)
      array = []
      includes(:owner).where(:subscriber_id => subscriber_id).all.each do |attr|
        array <<  {:summary_name => attr.summary_name, :summary_id => attr.summary_id,
                   :owner_name => attr.owner.full_name, :owner_id => attr.owner_id, :owner_photo => attr.owner.photo_small_url}
      end
      array
    end
    #INPUT
    #{
    #summary_id => 234
    #subscriber_id => 123
    #}
    #OUTPUT
    # count
    def unsubscribe_summary(params)

      obj = where(params).first
      obj.destroy

    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_SUBSCRIBER] [unsubscribe_channel] **** RESCUE **** => #{e.message} with params #{params.inspect}")
      nil
    end
    #INPUT
    #{
    #summary_id => 234
    #subscriber_id => 123
    #}
    #OUTPUT
    #objects
    def subscribe_summary(params)

      s = Summary.where(:id => params[:summary_id]).first
      if s.blank?
        Rails.logger.info("[MODEL] [SUBSCRIBE_CHANNEL] [subscribe_channel] Invalid Summary")
        return nil
      end

      #user cant subscribe its own channel
      if s.user_id == params[:subscriber_id]
        return nil
      end

      obj = where(params).first

      if obj.blank?
        params[:summary_name] = s.activity_name
        params[:owner_id] = s.user_id
        obj = create!(params)
        Contact.follow(params[:subscriber_id], params[:owner_id])
      end

      return obj

    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_SUBSCRIBER] [subscribe_channel] **** RESCUE **** => #{e.message} with params #{params.inspect}")
      nil
    end
  end
end

# == Schema Information
#
# Table name: summary_subscribes
#
#  id            :integer         not null, primary key
#  summary_id    :integer         not null
#  subscriber_id :integer         not null
#  owner_id      :integer         not null
#  summary_name  :text            not null
#  created_at    :datetime
#  updated_at    :datetime
#

