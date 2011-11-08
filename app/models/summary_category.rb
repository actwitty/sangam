class SummaryCategory < ActiveRecord::Base
  include TextFormatter

  belongs_to :summary
  belongs_to :user

  validates_existence_of :user_id
  validates_existence_of :summary_id

  validates_presence_of :name, :category_type

  validates_length_of :name, :in => 1..AppConstants.category_name_length
  validates_length_of :category_type, :in => 1..AppConstants.category_type_length

  validates_uniqueness_of :summary_id

  after_save :update_summary
  attr_accessible :name, :user_id, :category_type, :summary_id

  def update_summary
    Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [THEME] [update_summary] entering")
    if !self.summary_id.nil?
      s = Summary.where(:id => self.summary_id).first
      s.category_data = format_summary_category(self)
      s.update_attributes(:category_data => s.category_data)
    end
    Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [THEME] [update_summary] leaving")
  end

  class << self
    #INPUT => {:summary_id => 123, name => "sports"}
    def create_summary_category(params)
      Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] entering #{params.inspect}" )

      s = Summary.where(:id => params[:summary_id]).first
      if s.blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] invalid summary id #{params.inspect}" )
        return {}
      end

      params[:user_id] = s.user_id

      params[:category_type] = SUMMARY_CATEGORIES[params[:name]]['type']
      if params[:category_type].blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] invalid category #{params.inspect}" )
        return {}
      end

      obj = create!(params)
      return obj
    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] rescue #{params.inspect} #{e.message}" )

       #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        Rails.logger.info("[MODEL] [THEME] [SUMMARY_CATEGORY] rescue => unique validation field => #{params.inspect}")
        input = params.except(:name, :category_type,:user_id)
        obj = SummaryCategory.where(:summary_id => params[:summary_id]).first
        return obj
      end
      {}
    end

    #INPUT => {:summary_id => 123, name => "sports", :user_id}
    def update_summary_category(params)
      Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] entering #{params.inspect}" )

      category_type = nil
      obj = SummaryCategory.where(:summary_id => params[:summary_id]).first

      if obj.blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] invalid summary_id #{params.inspect}" )
        return false
      end

      if obj.user_id != params[:user_id]
         Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] invalid user #{params.inspect}" )
        return false
      end

      category_type = SUMMARY_CATEGORIES[params[:name]]['type']
      puts category_type.inspect
      if category_type.blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] invalid category #{params.inspect}" )
        return false
      end

      obj.update_attributes(:name => params[:name], :category_type => category_type)
      rescue => e
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] rescue #{params.inspect} #{e.message}" )
        false
    end
  end

end
# == Schema Information
#
# Table name: summary_categories
#
#  id            :integer         not null, primary key
#  name          :string(255)     not null
#  category_type :string(255)     not null
#  summary_id    :integer         not null
#  user_id       :integer         not null
#  created_at    :datetime
#  updated_at    :datetime
#

