class SourceAction < ActiveRecord::Base

  serialize :meta, Hash

  belongs_to :user
  belongs_to :summary
  belongs_to :activity

  validates_existence_of :user_id, :summary_id, :activity_id
  validates_uniqueness_of :activity_id, :scope => :name

  class << self
    #INPUT => {
    #           :user_id => 123,
    #           :activity_id => 123,
    #           :source_msg_id => "3242324",
    #           :source_name =>"facebook",
    #           :source_created_at =>  ,1994-11-05T13:15:30Z
    #           :summary_id => 345, :name => "likes", :count => 25,
    #           :meta => {:friends => [{:name => "alok",:id => "23232313"}...]} #IT CAN BE DIFFERENT FOR DIFFERENT ACTIONS
    #        }
    def create_source_action(params)
      Rails.logger.info("[MODEL] [SOURCE_ACTION] [CREATE_SOURCE_ACTION] Entering #{params.inspect}")

      params[:source_name] =  AppConstants.source_actwitty if params[:source_name].blank?

      params[:source_created_at] = Time.now.utc if params[:source_created_at].blank?

      obj = create!(params)

      Rails.logger.info("[MODEL] [SOURCE_ACTION] [CREATE_SOURCE_ACTION] Leaving #{params.inspect}")
      obj

    rescue => e
      Rails.logger.error("[MODEL] [SOURCE_ACTION] [CREATE_SOURCE_ACTION] **** RESCUE ****  #{e.message} for #{params.inspect}")
      #Validation Uniqueness fails  [:activity_id, :name]
      if /has already been taken/ =~ e.message
        Rails.logger.info("[MODEL] [SOURCE_ACTION] [CREATE_SOURCE_ACTION] Rescue => Unique Validation failed
                        [msg_id => #{params[:activity_id]} source_name => #{params[:name]}")
      end
      nil
    end



    #INPUT => {
    #          :activity_id => 123,
    #          :new_source_action => {
    #                                   "likes" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
    #                                   "comments" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
    #                                   "shares" => {:count => 20,:meta => {}},
    #                                   "retweets" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
    #                               },
    #         }
    def update_source_action(params)

      Rails.logger.info("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] Entering #{params.inspect}")
      valid = false

      source_actions = SourceAction.where(:activity_id => params[:activity_id]).all

      source_actions.each do |attr|

        Rails.logger.info("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] getting #{params[:new_source_action].inspect}")

        Rails.logger.info("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] getting #{params[:new_source_action][attr.name].inspect}")
        #that action is no longer there so delete from table
        if params[:new_source_action][attr.name].blank?
          destroy_all(:activity_id => params[:activity_id], :name => attr.name)
          valid = true

        #when count is different update meta and  count
        elsif params[:new_source_action][attr.name][:count] != attr.count
          update_all({:count => params[:new_source_action][attr.name][:count], :meta => params[:new_source_action][attr.name][:meta] },
                     {:activity_id => params[:activity_id], :name => attr.name})
          valid = true

        end
        #TODO we are not handling the case when count remains same but friends changed due delete of previous and create of new action

        #now remove the action .. this is to verify if something is remained in last
        params[:new_source_action] = params[:new_source_action].except(attr.name)
      end

      #some new action is there
      if !params[:new_source_action].blank?

        #old activity new actions
        if source_actions.blank?
          a = Activity.where(:id => params[:activity_id]).first
          params[:user_id] = a.author_id
          params[:source_msg_id] = a.source_object_id
          Rails.logger.info("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] First Time Actions being added to an Activity  #{params.inspect}")

        else
          #new actions added to existing activities with actions
          a = source_actions[0]
          params[:user_id] = a.user_id
          params[:source_msg_id] = a.source_msg_id
          Rails.logger.info("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] New Actions being added to an Activity With Action #{params.inspect}")

        end

        params[:new_source_action].each do |k,v|
          SourceAction.create_source_action({:user_id => params[:user_id], :activity_id => params[:activity_id],
                                             :source_msg_id => params[:source_msg_id], :source_name =>a.source_name,
                                             :summary_id => a.summary_id,:name => k, :count => v[:count], :meta => v[:meta]})
          valid = true
        end

      end

      Rails.logger.info("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] Leaving #{params.inspect}")

      valid

    rescue => e
      Rails.logger.error("[MODEL] [SOURCE_ACTION] [UPDATE_SOURCE_ACTION] **** RESCUE ****  #{e.message} for #{params.inspect}")
      false
    end

  end
end

# == Schema Information
#
# Table name: source_actions
#
#  id            :integer         not null, primary key
#  user_id       :integer
#  summary_id    :integer
#  activity_id   :integer
#  source_name   :text
#  source_msg_id :text
#  meta          :text            default("--- {}\n\n")
#  name          :text
#  count         :integer
#  created_at    :datetime        not null
#  updated_at    :datetime        not null
#

