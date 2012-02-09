class Tag < ActiveRecord::Base

   belongs_to     :author, :class_name => "User"
   belongs_to     :activity_word

   belongs_to     :summary

   belongs_to     :activity, :counter_cache => true

   validates_existence_of  :author_id, :activity_word_id,:activity_id
   validates_existence_of  :summary_id, :allow_nil => true

   validates_presence_of :name, :tag_type, :source_name, :status

   validates_length_of :name, :in => 1..AppConstants.tag_length
   validates_length_of :source_name, :in => 1..AppConstants.source_name_length

   validates_inclusion_of :tag_type, :in => 1..3

  class << self
    def create_tag(params)

      params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?
      params[:tag_type] = AppConstants.tag_type_blog if params[:tag_type].nil?

      #set defaults if missing
      params[:status] = AppConstants.status_public if params[:status].nil?

      #created_at and updated_at will take input value only when ActiveRecord::Base.record_timestamps is false
      #ootherwise default
      Tag.create(:author_id => params[:author_id], :activity_id => params[:activity_id],:summary_id => params[:summary_id],
                 :activity_word_id => params[:activity_word_id], :source_name => params[:source_name],:name => params[:name],
                 :tag_type => params[:tag_type],  :status => params[:status],
                 :source_name =>params[:source_name], :source_msg_id =>params[:source_msg_id],
                 :status_at_source=> params[:status_at_source], :created_at => params[:created_at],
                 :updated_at => params[:updated_at])
    rescue => e
      Rails.logger.error("[MODEL] [TAG] [create_document] **** RESCUE ****=> Failed =>  #{e.message} #{name} ")
      nil
    end
  end
end








# == Schema Information
#
# Table name: tags
#
#  id                       :integer         not null, primary key
#  author_id                :integer         not null
#  activity_word_id         :integer         not null
#  summary_id               :integer
#  activity_id              :integer         not null
#  name                     :text            not null
#  tag_type                 :integer         not null
#  source_name              :text            not null
#  source_msg_id            :text
#  status_at_source         :integer
#  status                   :integer         not null
#  backup_created_timestamp :datetime        default(2012-02-09 11:32:04 UTC)
#  created_at               :datetime
#  updated_at               :datetime
#

