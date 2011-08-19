class SocialCounter < ActiveRecord::Base
  validates_presence_of :source_name, :action

  belongs_to :summary
  belongs_to :author, :class_name => "User"
  belongs_to :location
  belongs_to :entity
  belongs_to :activity
  belongs_to :document


  validates_existence_of :summary_id, :allow_nil => true
  validates_existence_of :document_id, :allow_nil => true
  validates_existence_of :author_id, :allow_nil => true
  validates_existence_of :location_id, :allow_nil => true
  validates_existence_of :entity_id, :allow_nil => true
  validates_existence_of :activity_id, :allow_nil => true

  validates_length_of :source_name, :in => 1..AppConstants.source_name_length
  validates_length_of :action,      :in => 1..AppConstants.action_name_length

  class << self
    #INPUT
    #           :activity_id => 123 or nil
    #                 OR
    #           :summary_id => 123 or nil
    #                 OR
    #           :location_id => 123 or nil
    #                 OR
    #           :entity_id => 234 or nil
    #                 OR
    #           :document_id => 456 or nil
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
    #                 OR
    #           :location_id => 123 or nil
    #                 OR
    #           :entity_id => 234 or nil
    #                 OR
    #           :document_id => 456 or nil
    def create_social_counter(params)
      obj = create!(params)
      if !obj.nil?

        params = params.except(:source_name, :action)
        params.delete(:author_id) if !params[:author_id].blank?

        result = SocialCounter.where(params).group(:source_name, :action).count

        if !params[:activity_id].nil?

          a = Activity.where(:id => params[:activity_id]).first
          a.social_counters = []
          result.each do |k,v|
            a.social_counters << {:source_name => k[0], :action => k[1], :count => v}
          end
          a.update_attributes(:social_counters => a.social_counters)

          s = Summary.where(:id => params[:summary_id]).first
          s.social_counters = []
          where(:summary_id => params[:summary_id]).group(:source_name, :action).count.each do |k,v|
            s.social_counters << {:source_name => k[0], :action => k[1], :count => v}
          end
          s.update_attributes(:social_counters => s.social_counters)

        elsif !params[:document_id].nil?

          d = Document.where(:id => params[:document_id]).first
          d.social_counters = []
          result.each do |k,v|
            d.social_counters << {:source_name => k[0], :action => k[1], :count => v}
          end
          d.update_attributes(:social_counters => d.social_counters)

        elsif !params[:location_id].nil?

          l = Location.where(:id => params[:document_id]).first
          l.social_counters = []
          result.each do |k,v|
            l.social_counters << {:source_name => k[0], :action => k[1], :count => v}
          end
          l.update_attributes(:social_counters => l.social_counters)

        else  !params[:entity_id].nil?

          e = Entity.where(:id => params[:entity_id]).first
          e.social_counters = []
          result.each do |k,v|
            e.social_counters << {:source_name => k[0], :action => k[1], :count => v}
          end
          e.update_attributes(:social_counters => e.social_counters)

        end

      end
      return obj
    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_COUNTER] [create_social_counter] rescue => #{params.inspect}")
      nil
    end
  end
end

# == Schema Information
#
# Table name: social_counters
#
#  id         :integer         not null, primary key
#  created_at :datetime
#  updated_at :datetime
#

