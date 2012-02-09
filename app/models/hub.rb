class Hub < ActiveRecord::Base

  belongs_to :user
  belongs_to :activity, :counter_cache => true
  belongs_to :location
  belongs_to :entity #, :touch => true
  belongs_to :activity_word
  belongs_to :summary

  validates_existence_of  :activity_id
  validates_existence_of  :activity_word_id
  validates_existence_of  :user_id
  validates_existence_of  :summary_id

  validates_existence_of  :entity_id, :allow_nil => true
  validates_existence_of  :location_id, :allow_nil => true

  validates_presence_of   :source_name, :status

  validates_length_of     :source_name,  :in => 1..AppConstants.source_name_length

  class << self

     #created only for activities which has entities
     def create_hub(params = {})

        Rails.logger.info("[MODEL] [ACTIVITY] [create_hub_entries] entering ")

        hubs_hash = {}
        entity = []

        #created_at and updated_at will take input value only when ActiveRecord::Base.record_timestamps is false
        #ootherwise default
        h = {
              :activity_id => params[:activity_id], :activity_word_id => params[:activity_word_id], :user_id => params[:user_id],
              :summary_id => params[:summary_id], :source_name => params[:source_name], :status_at_source => params[:status_at_source],
              :status => params[:status], :category_type => params[:category_type], :location_id => params[:location_id],
              :created_at => params[:created_at], :updated_at => params[:updated_at]
            }


        if !params[:entity_hash].nil?
          params[:entity_hash].each do |key, value|
            #hubs_hash[:entity_name] = key
            h[:entity_id] = value
            entity << value
            Hub.create!(h)
          end
        end

        Rails.logger.info("[MODEL] [HUB] [create_hub_entries] leaving ")
     rescue => e
        Rails.logger.error("[MODEL] [HUB] [create_hub_entries] rescue failed => #{e.message} => #{params} => hubs_hash = #{hubs_hash}")
     end
  end
end











# == Schema Information
#
# Table name: hubs
#
#  id                       :integer         not null, primary key
#  activity_id              :integer         not null
#  activity_word_id         :integer         not null
#  entity_id                :integer
#  user_id                  :integer         not null
#  location_id              :integer
#  summary_id               :integer         not null
#  source_name              :text            not null
#  status                   :integer         not null
#  source_msg_id            :text
#  status_at_source         :integer
#  category_type            :text
#  backup_created_timestamp :datetime        default(2012-02-09 11:31:59 UTC)
#  created_at               :datetime
#  updated_at               :datetime
#

