module TranslateText

  #used for forming resource links activity text of meta activities
  def get_resource_link(model,tag, name, id)
    controller = nil
    klass = nil
    case model
      when "campaign"
        case tag
          when "entity"
            controller = AppConstants.entity_controller
            klass = AppConstants.campaign_entity_class
          when "location"
            controller = AppConstants.location_controller
            klass = AppConstants.campaign_location_class
          when "activity"
            controller = AppConstants.activity_controller
            klass = AppConstants.campaign_activity_class
          when "document"
            controller = AppConstants.document_controller
            klass = AppConstants.campaign_document_class
          when "comment"
            controller = AppConstants.comment_controller
            klass = AppConstants.campaign_comment_class
        end
      when "comment"
        case tag
          when "activity"
            controller = AppConstants.activity_controller
            klass = AppConstants.comment_activity_class
          when "document"
            controller = AppConstants.document_controller
            klass = AppConstants.comment_document_class
        end
    end
    link_to_type(controller,klass,name,id )
  end


  #formats the meta activity of an user related to setting the comment
  #text_hash is only to avoid YAML load
  def translate_comment_activity(activity, hash)
    text = nil

    author =link_to_type(AppConstants.user_controller, AppConstants.comment_authorname_class,
                         activity.author.full_name,activity.author.id)
    case hash[:object_type]
      when "activity"
        text = I18n.t hash[:object_type],:author => author,
                     :user => link_to_type(AppConstants.user_controller, AppConstants.comment_username_class,
                                           hash[:user],hash[:user_id] ),
                     :resource_type => (I18n.t hash[:object_type], :scope => :activity_type),
                     :resource_name => get_resource_link("comment", hash[:object_type], hash[:resource_name], hash[:resource_id]) ,
                     :scope => :comment_activity_text
      when "document"
        text = I18n.t  hash[:object_type],:author => author,
                     :user => link_to_type(AppConstants.user_controller, AppConstants.comment_username_class,
                                           hash[:user],hash[:user_id] ),
                     :resource_name => get_resource_link("comment", hash[:object_type],hash[:resource_type], hash[:resource_id]) ,
                     :scope => :comment_activity_text
    end

  end


  #formats the meta activity of an user related to setting the campaign
  #text_hash is only to avoid YAML load
  def translate_campaign_activity(activity, hash)
    text = nil

    author =link_to_type(AppConstants.user_controller, AppConstants.campaign_authorname_class,
                         activity.author.full_name,activity.author.id)

    case hash[:object_type]
      when "activity", "comment"

        text = I18n.t hash[:object_type],:author => author,
                     :campaign => (I18n.t hash[:campaign], :scope => :campaign),
                     :user => link_to_type(AppConstants.user_controller, AppConstants.campaign_username_class,
                                           hash[:user],hash[:user_id] ),
                     :resource_type => (I18n.t hash[:object_type], :scope => :activity_type),
                     :resource_name => get_resource_link("campaign", hash[:object_type], hash[:resource_name], hash[:resource_id]) ,
                     :scope => :campaign_activity_text

      #need to make entity translation proper
      when "entity"
        text = I18n.t  hash[:object_type],:author => author, :campaign => (I18n.t hash[:campaign],:scope => :campaign),
                     :resource_name => get_resource_link("campaign",hash[:object_type], hash[:resource_name], hash[:resource_id]) ,
                     :scope =>  :campaign_activity_text
      when  "location"

        text = I18n.t hash[:object_type],:author => author, :campaign => (I18n.t hash[:campaign],:scope => :campaign),
                     :resource_type => (I18n.t hash[:resource_type], :scope => :location_type),
                     :resource_name => get_resource_link("campaign", hash[:object_type], hash[:resource_name], hash[:resource_id]) ,
                     :scope =>  :campaign_activity_text
      when "document"
        text = I18n.t  hash[:object_type],:author => author,
                     :campaign => (I18n.t hash[:campaign], :scope => :campaign),
                     :user => link_to_type(AppConstants.user_controller, AppConstants.campaign_username_class,
                                           hash[:user],hash[:user_id] ),
                     :resource_name => get_resource_link("campaign", hash[:object_type],hash[:resource_type], hash[:resource_id]) ,
                     :scope => :campaign_activity_text

    end
    text
  end


  #converts the activity text for meta activities like campaign & comment activity to language specific
  #and custom formats. For normal activity it returns the plain activity text as it is
  #meta activities should always be in serialized YAML
  def translate_activity_text(activity)
    text = ""
    hash = YAML::load(activity.activity_text)

    if activity.meta_activity == false
      return activity.activity_text
    end

    if !activity.activity_text.blank?
      if hash[:model] == "campaign"
        text = translate_campaign_activity(activity, hash)
      elsif  hash[:model] == "comment"
        text = translate_comment_activity(activity, hash)
      end

    end
    text
  end
end
