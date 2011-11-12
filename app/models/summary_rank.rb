class SummaryRank < ActiveRecord::Base

  belongs_to :user
  belongs_to :summary

  belongs_to :location
  belongs_to :entity

  validates_uniqueness_of :user_id, :scope => :summary_id
  validates_uniqueness_of :summary_id
  validates_uniqueness_of :location_id
  validates_uniqueness_of :entity_id

  serialize :posts,         Hash
  serialize :comments,      Hash
  serialize :likes,         Hash
  serialize :shares,        Hash
  serialize :demography,    Hash
  serialize :subscribers,   Hash
  serialize :documents,     Hash
  serialize :channel_ranks, Hash

  class << self
    #INPUT => { :summary_id => 123, or :location_id => 234 or :entity_id => 234}
    def add_posts_analytics(params)

      count = nil
      if !params[:entity_id].blank?
        count = Hub.where(:entity_id => params[:entity_id]).group(:entity_id).count
      end

      if !params[:location_id].blank?
        count = Activity.where(:base_location_id => params[:location_id]).group(:location_id).count
      end

      if !params[:summary_id].blank?
        count = Activity.where(:summary_id => params[:summary_id]).group(:summary_id).count
      end
      count.values[0]
    end

    #INPUT => { :summary_id => 123, or :location_id => 234 or :entity_id => 234}
    def add_likes_analytics(params)


    end

    #INPUT => { :fields => ["posts","likes", "comments"..],:summary_id => 123, or :location_id => 234 or :entity_id => 234}
    def add_analytics(params)
      Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] entering #{params}")

      h = params.except(:fields)
      object = SummaryRank.where(h).first

      if object.blank?
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] new object #{params}")

        if !h[:summary_id].blank?
          s = Summary.where(:id => h[:summary_id]).first
          return nil if s.blank?
        end

        if !h[:location_id].blank?
          l = Location.where(:id => h[:location_id]).first
          return nil if l.blank?
        end

        if !h[:entity_id].blank?
          e = Entity.where(:id => h[:entity_id]).first
          return nil if e.blank?
        end
        # Put error check

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] creating object #{params}")
        object =create!(h)
      end

      date = Time.now.strftime("%m/%d/%y")

      params[:fields].each do |attr|

      data = send("add_#{attr}_analytics", params)

        if !data.blank?
          object.send("#{attr}=",{}) if object.send(attr).nil?
          object.send(attr)[date] = data
          #remove data points if needed
          object.send(attr).shift if object.send(attr).length > AppConstants.number_of_data_points
        end
      end

      object.update_attributes!(object.attributes)

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] leaving #{params}")

      return object.attributes
    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] error #{params} => #{e.message}")
      return nil
    end
  end
end


# == Schema Information
#
# Table name: summary_ranks
#
#  id            :integer         not null, primary key
#  user_id       :integer
#  summary_id    :integer
#  location_id   :integer
#  entity_id     :integer
#  posts         :text
#  likes         :text
#  shares        :text
#  subscribers   :text
#  comments      :text
#  demography    :text
#  documents     :text
#  channel_ranks :text
#  views         :text
#  created_at    :datetime
#  updated_at    :datetime
#

