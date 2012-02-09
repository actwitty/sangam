class SocialCounter < ActiveRecord::Base
  include QueryPlanner

  validates_presence_of :source_name, :action


  belongs_to :summary
  belongs_to :author, :class_name => "User"
  belongs_to :activity


  validates_existence_of :summary_id, :allow_nil => true
  validates_existence_of :author_id, :allow_nil => true
  validates_existence_of :activity_id, :allow_nil => true


  class << self

    #INPUT
    #           :activity_id => 123 or nil
    #                 OR
    #           :summary_id => 123 or nil
    #OUTPUT
    #          [{:source_name=>"twitter", :action=>"share", :count=>1}
    #            {:source_name=>"facebook", :action=>"share", :count=>2}]

    def get_social_counter(params)
      result = where(params).group(:source_name, :action).count
      array = []
      result.each do |k,v|
        array << {:source_name => k[0], :action => k[1], :count => v}
      end
      array
    end
    #INPUT  => {:source_name => "facebook", or ""google" etc
    #           :action => "share" or "like" etc
    #           :author_id => 123 [OPTIONAL]
    #
    #           :activity_id => 123 or nil
    #           :summary_id => 123 or nil

    #           :description => "hello" [OPTIONAL]
    def create_social_counter(params)
      obj = create!(params)
      return obj
    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_COUNTER] [create_social_counter] **** RESCUE **** => #{e.message} #{params.inspect}")
      nil
    end
  end
end




# == Schema Information
#
# Table name: social_counters
#
#  id          :integer         not null, primary key
#  source_name :text            not null
#  action      :text            not null
#  activity_id :integer
#  document_id :integer
#  summary_id  :integer
#  location_id :integer
#  entity_id   :integer
#  author_id   :integer
#  description :text
#  created_at  :datetime
#  updated_at  :datetime
#

