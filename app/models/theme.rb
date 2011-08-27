class Theme < ActiveRecord::Base

  belongs_to  :author, :class_name => "User"
  belongs_to  :summary
  belongs_to  :document

  validates_existence_of  :document_id, :allow_nil => true
  validates_existence_of  :summary_id
  validates_existence_of  :author_id

  validates_length_of     :url, :maximum => AppConstants.url_length
  validates_length_of     :fg_color, :is => 10 , :unless => Proc.new {|a| a.fg_color.nil?}
  validates_length_of     :bg_color, :is => 10 , :unless => Proc.new {|a| a.bg_color.nil?}

  validates_uniqueness_of  :author_id, :scope => :summary_id
  validates_presence_of    :theme_type

  class << self

    include TextFormatter

    public

    #INPUT
    #     :fg_color =>"0xffffff23"  #RGBA
    #     :bg_color =>"0xffffff23"  #RGBA
    #              OR
    #     :document_id => 123
    #     :style => 1 or 2 or 3 # 1=> centered , 2=> tiled, 3 => stretched
    #
    #     :author_id => 123 #MANDATORY
    #     :summary_id => 234 #OPTIONAL
    #     :theme_type => 1 (AppConstants.theme_default) OR 2 (AppConstants.theme_color) OR 3 (AppConstants.theme_document)

    def create_theme(params)

      Rails.logger.info("[MODEL] [THEME] [create_theme] entering")

      if params[:theme_type].blank?
        Rails.logger.info("[MODEL] [THEME] [create_theme] theme_type blank => #{params.inspect}")
        return nil
      end

      if params[:theme_type] == AppConstants.theme_document
        if !params[:document_id].blank?
          params = validate_documents(params)

          if params.nil?
            Rails.logger.info("[MODEL] [THEME] [create_theme] invalid document id #{params.inspect}")
            return nil
          end

          Rails.logger.info("[MODEL] [THEME] [create_theme] document id set #{params.inspect}")
          params[:fg_color] = nil
          params[:bg_color] = nil

          params[:style] = AppConstants.theme_style_tiled if params[:style].blank?

        else
          Rails.logger.info("[MODEL] [THEME] [create_theme] document id blank #{params.inspect}")
          return nil
        end
      elsif params[:theme_type] == AppConstants.theme_default

        Rails.logger.info("[MODEL] [THEME] [create_theme] default set #{params.inspect}")

        params[:fg_color] = AppConstants.theme_default_fg_color
        params[:bg_color] = AppConstants.theme_default_bg_color
        params[:document_id] = nil
        params[:url] = nil

      elsif params[:theme_type] == AppConstants.theme_color

        if params[:fg_color].blank? || params[:bg_color].blank?
          Rails.logger.info("[MODEL] [THEME] [create_theme] color is blank #{params.inspect}")
        end

        Rails.logger.info("[MODEL] [THEME] [create_theme] color set #{params.inspect}")

        params[:document_id] = nil
        params[:url] = nil
      end

      obj = create!(params)

      if obj.blank?
        Rails.logger.info("[MODEL] [THEME] [create_theme] obj nil")
        return nil
      end

      if !params[:summary_id].nil?

        s = Summary.where(:id => params[:summary_id]).first
        s.theme_data = format_theme(obj)
        s.update_attributes(:theme_data => s.theme_data)

      end

      puts obj.inspect
      Rails.logger.info("[MODEL] [THEME] [create_theme] leaving")

      return obj

    rescue => e

      Rails.logger.info("[MODEL] [THEME] [create_theme] rescue => #{e.message} with params => #{params.inspect}" )

      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        Rails.logger.info("[MODEL] [THEME] [create_theme] unique validation field => #{params.inspect}")
        input = params.except(:author_id, :summary_id)
        obj = Theme.where(:author_id => params[:author_id], :summary_id => params[:summary_id]).first
        obj = obj.update_attributes(input)
        return obj
      end
      return nil

    end

    private

    def validate_documents(params)
      Rails.logger.info("[MODEL] [THEME] [validate_documents] entering")
      d= Document.where(:id => params[:document_id]).first

      if d.blank?
        Rails.logger.info("[MODEL] [THEME] [validate_documents] invalid document id")
        return nil
      end

      params[:url] = d.url
      Rails.logger.info("[MODEL] [THEME] [validate_documents] leaving")
      params
    end
  end

end
