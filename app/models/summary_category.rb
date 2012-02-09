class SummaryCategory < ActiveRecord::Base
  include TextFormatter

  belongs_to :summary
  belongs_to :user

  validates_existence_of :user_id
  validates_existence_of :summary_id

  validates_presence_of :category_id, :category_type

  validates_uniqueness_of :summary_id

  after_save :update_summary
  attr_accessible :category_id, :user_id, :category_type, :summary_id, :activity_name

  def update_summary
    Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [THEME] [update_summary] entering")
    if !self.summary_id.nil?
      s = Summary.where(:id => self.summary_id).first

      s.category_type = self.category_type
      s.category_id = self.category_id
      s.update_attributes(:category_id => s.category_id,:category_type => s.category_type)

      #this block will only update activity and hub and when it comes from update_summary_category and not the first time creation
      #at first time creation s.activities_count == 0
      if s.activities_count > 0
        Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [THEME] [update_summary] activities count > 0")
        Activity.update_all({:category_id => self.category_id, :category_type => self.category_type},{ :summary_id => self.summary_id })
        Hub.update_all({:category_type => self.category_type},{ :summary_id => self.summary_id})
      end

    end
    Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [THEME] [update_summary] leaving")
  end

  class << self

    #INPUT => {:summary_id => 123, category_id => "sports", :activity_name => "IAmSporty"}

    def create_summary_category(params)

      Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] entering #{params.inspect}" )

      s = Summary.where(:id => params[:summary_id]).first
      if s.blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] invalid summary id #{params.inspect}" )
        return {}
      end

      params[:user_id] = s.user_id

      params[:category_id] = params[:category_id].downcase

      params[:category_type] = SUMMARY_CATEGORIES[params[:category_id]]['type']
      if params[:category_type].blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] invalid category #{params.inspect}" )
        return {}
      end

      obj = create!(params)
      return obj
    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [CREATE_SUMMARY_CATEGORY] **** RESCUE **** #{params.inspect} #{e.message}" )

      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message

        Rails.logger.info("[MODEL] [THEME] [SUMMARY_CATEGORY] rescue => unique validation field => #{params.inspect}")

        input = params.except(:category_id, :category_type,:user_id)
        obj = SummaryCategory.where(:summary_id => params[:summary_id]).first

        return obj
      end
      {}
    end

    #INPUT => {:summary_id => 123, category_id => "sports", :user_id}
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

      category_type = SUMMARY_CATEGORIES[params[:category_id]]['type']

      puts category_type.inspect

      if category_type.blank?
        Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] invalid category #{params.inspect}" )
        return false
      end

      obj.update_attributes(:category_id => params[:category_id], :category_type => category_type)


    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_CATEGORY] [UPDATE_SUMMARY_CATEGORY] rescue #{params.inspect} #{e.message}" )
      false
    end


    #INPUT => {:name => "foo"}
    #OUPUT => [{:name  =>"food",  :category_id => "food", :category_name => "food and drink"}, ...]
    def search(params)
      Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [SEARCH] entering #{params}")
      array = []
      if !params[:name].blank?

          where( ['activity_name ILIKE ?', "#{params[:name]}%"]).order("MAX(updated_at) DESC").group(:category_id,:activity_name).count.each do |attr|
            array << {:name => attr[0][1], :category_id => attr[0][0],:category_name => SUMMARY_CATEGORIES[attr[0][0]]['name']}
          end

      end
      Rails.logger.info("[MODEL] [SUMMARY_CATEGORY] [SEARCH] leaving #{params}")
      array
    end
  end

end


# == Schema Information
#
# Table name: summary_categories
#
#  id            :integer         not null, primary key
#  category_id   :text            not null
#  category_type :text            not null
#  activity_name :text            not null
#  summary_id    :integer         not null
#  user_id       :integer         not null
#  created_at    :datetime
#  updated_at    :datetime
#

