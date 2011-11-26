require 'json'
class SocialAggregator < ActiveRecord::Base

  belongs_to :user
  belongs_to :activity
  belongs_to :summary

  validates_existence_of :user_id,   :allow_nil => false
  validates_existence_of :activity_id, :allow_nil => false
  validates_existence_of :summary_id, :allow_nil => false

  validates_presence_of  :source_name, :source_msg_id
  validates_uniqueness_of :user_id, :scope => [:source_name, :source_msg_id]


  class << self
    #INPUT => {:user_id => 123, :provider = "facebook"}

    def create_social_data(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] entering #{params}")

      new_activity = nil
      aggregator = nil

      ###########################get authentication information of provider#####################################

      auth = Authentication.where(:user_id => params[:user_id], :provider => "facebook").first
      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] #{auth.inspect}")

      ############Find whether its first time data pull from provider. Set limit of pull accordingly ############

      limit = nil
      existing_data = {}

      #check if user's data is already there. In this case we will pull only small amount of data from
      #so to do that first collect all ids of user which there in table
#      SocialAggregator.where(:user_id => params[:user_id], :source_name => auth.provider).order("created_at DESC").all.each do |attr|
#          existing_data[attr.source_msg_id] =  true
#      end

      #took last to get most recent time of provider_created_at
      existing_data = SocialAggregator.where(:user_id => params[:user_id], :source_name => auth.provider).last


      if existing_data.blank?
        limit = AppConstants.maximum_import_first_time
        time = Time.utc(1970, 7, 8, 9, 10)
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] pull data first time  #{params.inspect}")
      else
        limit = AppConstants.maximum_import_every_time
        time = last.created_at
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] pull data - regular update  #{params.inspect}")
      end

      #################################### Pull data from provider ##############################################
      data_array = SocialFetch.pull_data({:user_id => params[:user_id], :uid => auth.uid,:provider => auth.provider,
                                            :access_token => auth.token, :limit => limit} )

      if data_array.blank?
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] empty data returned #{params.inspect}")
        return nil
      end

      ########################## Convert and Categorize data ###################################################

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] now process the data
                ======================= #{data_array.size} ====================== for #{params.inspect}")

      activity = {}
      index = 0

      #convert and categorize data
      data_array.each do |attr|

        data = SocialFetch.data_adaptor({:provider => auth.provider, :blob => attr, :uid => auth.uid, :time => time})

        if !data.blank?
          activity[index] = data

          if !data[:category].blank?
            category = SocialFetch.categorize_data(data[:category])
            activity[index][:post][:word] = SUMMARY_CATEGORIES[category]['channel']
            activity[index][:post][:summary_category] = category
          end

          index += 1
        end

      end

      ############################Create Activities in DB in reverse order #####################################
      ################ As data is pulled in updated order from provider, we have create in reverse order ######


      if index > 0
        user = User.where(:id => params[:user_id]).first
        (index - 1).downto(0) do |i|

           #as of now we are not using provider's timestamp as our timestamp.
           #though we are making a record of provider's created_at time in SocialAggregator
           h =  activity[i][:post].except(:created_at, :updated_at)

           new_activity = user.create_activity(h)

           aggregator = SocialAggregator.create!({:activity_id => new_activity[:post][:id],:user_id => new_activity[:post][:user][:id],
                                      :summary_id => new_activity[:post][:summary_id],:source_name => params[:provider],
                                      :source_msg_id => new_activity[:post][:source_msg_id],
                                      :provider_created_at => activity[i][:post][:created_at] })
           new_activity = nil
           aggregator = nil
        end
      end

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] leaving #{params.inspect}")
      return activity

    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ****ERROR**** #{e.message} for #{params.inspect}")
      #destroy last new_activity or aggregator.. as they can't be valid after create as we are setting them to nil
      #so if they are non-null then they should be removed
      Activity.destroy_all(:id => new_activity[:post][:id]) if !new_activity.blank?
      SocialAggregator.destroy_all(:id => aggregator.id) if !aggregator.blank?
      nil
    end
  end
end



# == Schema Information
#
# Table name: social_aggregators
#
#  id                  :integer         not null, primary key
#  user_id             :integer         not null
#  activity_id         :integer         not null
#  summary_id          :integer         not null
#  provider_created_at :datetime        not null
#  source_name         :string(255)     not null
#  source_msg_id       :string(255)     not null
#  created_at          :datetime
#  updated_at          :datetime
#

