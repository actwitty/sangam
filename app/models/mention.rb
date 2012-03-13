class Mention < ActiveRecord::Base
  belongs_to     :author, :class_name => "User"
  belongs_to     :activity

  belongs_to     :summary

  validates_existence_of :summary_id, :activity_id, :author_id

  class << self
    def create_mention(params)

      Rails.logger.info("[MODEL] [MENTION] [CREATE_MENTION] Entering #{params.inspect}")

      #set defaults if missing
      params[:status] = AppConstants.status_public if params[:status].nil?
      params[:status_at_source] = AppConstants.status_public_at_source if params[:status_at_source].nil?
      params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?
      params[:source_created_at] = Time.now.utc if params[:source_created_at].blank?

      #created_at and updated_at will take input value only when ActiveRecord::Base.record_timestamps is false
      #ootherwise default
      obj = Mention.create(:author_id => params[:author_id], :activity_id => params[:activity_id],:summary_id => params[:summary_id],
                 :source_name => params[:source_name],:name => params[:name], :source_uid => params[:source_uid],
                 :status => params[:status],
                 :source_msg_id =>params[:source_msg_id],
                 :status_at_source=> params[:status_at_source], :source_created_at => params[:source_created_at])

      Rails.logger.info("[MODEL] [MENTION] [CREATE_MENTION] Leaving #{params.inspect}")

      obj
    rescue => e
      Rails.logger.error("[MODEL] [MENTION] [CREATE_MENTION] **** RESCUE ****=> Failed =>  #{e.message} for #{params.inspect} ")
      nil
    end
  end
end

# == Schema Information
#
# Table name: mentions
#
#  id                       :integer         not null, primary key
#  author_id                :integer
#  summary_id               :integer
#  activity_id              :integer
#  source_uid               :text
#  name                     :text
#  source_name              :text
#  source_msg_id            :text
#  status_at_source         :integer
#  status                   :integer
#  backup_created_timestamp :datetime        default(2012-03-06 07:49:55 UTC)
#  created_at               :datetime        not null
#  updated_at               :datetime        not null
#

