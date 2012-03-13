class Tag < ActiveRecord::Base

   belongs_to     :author, :class_name => "User"
   belongs_to     :activity_word

   belongs_to     :summary

   belongs_to     :activity

   validates_existence_of  :author_id, :activity_word_id,:activity_id
   validates_existence_of  :summary_id, :allow_nil => true

   validates_presence_of :name,  :source_name, :status


  class << self
    def create_tag(params)

      Rails.logger.info("[MODEL] [TAG] [CREATE_TAG] Entering #{params.inspect}")

      #set defaults if missing
      params[:status] = AppConstants.status_public if params[:status].nil?
      params[:status_at_source] = AppConstants.status_public_at_source if params[:status_at_source].nil?
      params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?
      params[:source_created_at] = Time.now.utc if params[:source_created_at].blank?

      #created_at and updated_at will take input value only when ActiveRecord::Base.record_timestamps is false
      #ootherwise default
      obj = Tag.create(:author_id => params[:author_id], :activity_id => params[:activity_id],:summary_id => params[:summary_id],
                 :activity_word_id => params[:activity_word_id],:name => params[:name],
                 :status => params[:status],
                 :source_name =>params[:source_name], :source_msg_id =>params[:source_msg_id],
                 :status_at_source=> params[:status_at_source], :source_created_at => params[:source_created_at])

      Rails.logger.info("[MODEL] [TAG] [CREATE_TAG] Leaving #{params.inspect}")

      obj
    rescue => e
      Rails.logger.error("[MODEL] [TAG] [CREATE_TAG] **** RESCUE ****=> Failed =>  #{e.message} for #{params.inspect} ")
      nil
    end
  end
end













# == Schema Information
#
# Table name: tags
#
#  id                :integer         not null, primary key
#  author_id         :integer         not null
#  activity_word_id  :integer         not null
#  summary_id        :integer
#  activity_id       :integer         not null
#  name              :text            not null
#  source_name       :text            not null
#  source_msg_id     :text
#  status_at_source  :integer
#  status            :integer         not null
#  source_created_at :datetime        default(1970-01-01 00:00:00 UTC)
#  created_at        :datetime        not null
#  updated_at        :datetime        not null
#

