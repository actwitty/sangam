class Theme < ActiveRecord::Base

  belongs_to  :author, :class_name => "User"
  belongs_to  :summary

  validates_length_of     :url, :maximum => AppConstants.url_length
  validates_length_of     :fg_color, :is => 10 , :unless => Proc.new {|a| a.fg_color.nil?}
  validates_length_of     :bg_color, :is => 10 , :unless => Proc.new {|a| a.bg_color.nil?}

  validates_uniqueness_of  :author_id, :scope => :summary_id

  class << self
    include TextFormatter
    #INPUT
    #     :fg_color =>"0xffffff23"  #RGBA
    #     :bg_color =>"0xffffff23"  #RGBA
    #              OR
    #     :url => "http://s3.amazonaws.com/a.jpg"
    #     :style => 1 or 2 or 3 # 1=> centered , 2=> tiled, 3 => stretched
    #
    #     :author_id => 123 #MANDATORY
    #     :summary_id => 234 #OPTIONAL
    def update_theme(params)

      Rails.logger.info("[MODEL] [THEME] [update_theme] entering")

      condition = params.except(:fg_color, :bg_color, :url, :style, :default)
      if params[:default] == false
        input = params.except(:author_id, :summary_id, :default)
      else
        input = {:fg_color => AppConstants.theme_default_fg_color, :bg_color => AppConstants.theme_default_bg_color,}
      end

      a = update_all(input, condition)

      puts a.inspect

      if !params[:summary_id].nil?

        s = Summary.where(:id => params[:summary_id]).first
        input[:author_id] = s.user_id
        input[:summary_id] = s.id
        s.update_attributes(:theme_data => input)

      end

      Rails.logger.info("[MODEL] [THEME] [update_theme] leaving")

      input
    end
    #INPUT
    #     :fg_color =>"0xffffff23"  #RGBA
    #     :bg_color =>"0xffffff23"  #RGBA
    #              OR
    #     :url => "http://s3.amazonaws.com/a.jpg"
    #     :style => 1 or 2 or 3 # 1=> centered , 2=> tiled, 3 => stretched
    #
    #     :author_id => 123 #MANDATORY
    #     :summary_id => 234 #OPTIONAL
    def create_theme(params)

      Rails.logger.info("[MODEL] [THEME] [create_theme] entering")

      obj = create!(params)

      if !params[:summary_id].nil?

        s = Summary.where(:id => params[:summary_id]).first
        s.theme_data = format_theme(obj)
        s.update_attributes(:theme_data => s.theme_data)

      end

      Rails.logger.info("[MODEL] [THEME] [create_theme] leaving")

      return obj

    rescue => e

      Rails.logger.info("[MODEL] [THEME] [create_theme] rescue => #{e.message} with params #{params.inspect}" )

      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        params = params.except(:fg_color, :bg_color, :url, :style)
        obj = where(params).first
        return obj
      end

    end
  end

end
