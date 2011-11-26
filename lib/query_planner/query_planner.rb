module QueryPlanner

  def pq_campaign_filter(params)
    h = {}

    h[:activity_id] =  params[:activity_id] if !params[:activity_id].blank?
    h[:document_id] =  params[:document_id] if !params[:document_id].blank?
    h[:entity_id] =  params[:entity_id] if !params[:entity_id].blank?
    h[:location_id] =  params[:location_id] if !params[:location_id].blank?
    h[:comment_id] =  params[:comment_id] if !params[:comment_id].blank?

    h[:author_id] =  params[:author_id] if !params[:author_id].blank?
    h[:name] =  params[:name] if !params[:name].blank?

    h[:value] =  params[:value] if !params[:value].blank?

    h[:status] =  params[:status] if !params[:status].blank?
    h[:source_name] =  params[:source_name] if !params[:source_name].blank?
    h[:updated_at.lt] =  params[:updated_at] if !params[:updated_at].blank?
    h
  end


  def pq_social_counter_filter(params)
    h = {}
    h[:summary_id] =  params[:summary_id] if !params[:summary_id].blank?
    h[:activity_id] =  params[:activity_id] if !params[:activity_id].blank?

    h[:location_id] =  params[:location_id] if !params[:location_id].blank?
    h[:entity_id] =  params[:entity_id] if !params[:entity_id].blank?
    h[:document_id] =  params[:document_id] if !params[:document_id].blank?

    h[:author_id] =  params[:author_id] if !params[:author_id].blank?

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?
    h
  end

  def pq_document_filter(params)
    h = {}

    #these 3 are mutually exclusive
    h[:owner_id] =  params[:user_id] if !params[:user_id].blank?
    h[:summary_id] =  params[:summary_id] if !params[:summary_id].blank?
    h[:activity_id] =  params[:activity_id] if !params[:activity_id].blank?

    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
    h[:location_id] = params[:location_id] if !params[:location_id].blank?
    h[:source_name] = params[:source_name] if !params[:source_name].blank?

    h[:category] = params[:category] if !params[:category].blank?
    h[:status] = params[:status] if !params[:status].blank?

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?
    h
  end


  def pq_summary_filter(params)
    h = {}

    h[:id] =  params[:id] if !params[:id].blank?
    h[:user_id] = params[:user_id] if !params[:user_id].blank?
    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h

  end


  def pq_hub_filter( params)
    h = {}
    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
    h[:location_id] = params[:location_id] if !params[:location_id].blank?
    h[:entity_id] = params[:entity_id] if !params[:entity_id].blank?
    h[:source_name] = params[:source_name] if !params[:source_name].blank?

    h[:user_id] = params[:user_id] if !params[:user_id].blank?
    h[:summary_id] = params[:summary_id] if !params[:summary_id].blank?

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h
  end


  def pq_activity_filter(params)
    h = {}
    h[:author_id] = params[:user_id] if !params[:user_id].blank?
    h[:summary_id] = params[:summary_id] if !params[:summary_id].blank?

    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
                                             #OR
    h[:category_type] =   params[:category_type] if !params[:category_type].blank?

    h[:base_location_id] = params[:location_id] if !params[:location_id].blank?
    h[:source_name] = params[:source_name] if !params[:source_name].blank?

    h[:status] = params[:status] if !params[:status].blank?
    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    if !params[:meta_activity].nil?
      if h[:activity_word_id].blank? && h[:base_location_id].blank? && h[:source_name].blank?
        h[:meta_activity] = params[:meta_activity]
      end
    end

    h
  end

  def process_filter(filter)


    return {} if filter.nil?

    h = {}

    if !filter[:word_id].blank?
      h[:activity_word_id] = filter[:word_id]
    end
    if !filter[:location_id].blank?
      h[:location_id] = filter[:location_id]
    end
    if !filter[:entity_id].blank?
       h[:entity_id] = filter[:entity_id]
    end
    if !filter[:source_name].blank?
      h[:source_name] = filter[:source_name]
    end
    if !filter[:category_type].blank?
      h[:category_type] = filter[:category_type]
    end
    h
  end

  #If No User is given or No Page_Type is give always PUBLIC data will come
  #For Subscribed Page => Always self user subscription
  #For All page => Always self user followers channel
  #For User page => params[:user_id] is used.
  def process_filter_modified(params)


    h = {}
    user = nil
    summary = nil

    h = process_filter(params[:filter])

    #if no user is given, it means need public to view documents only on filters
    if params[:user_id].blank? || params[:page_type].blank?

      Rails.logger.debug("[MODULE] [QUERY_PLANNER] [process_filter_modified] page_state = page_state_public as user or page_type is blank => #{params.inspect}")
      params[:page_type] = AppConstants.page_state_public

    end

    #Subscribed Page  => Always with self
    if params[:page_type] == AppConstants.page_state_subscribed
      #only Self can access the subscribed and of its known
      summary =  SummarySubscribe.where(:subscriber_id => params[:current_user_id]).group(:summary_id).count

      if summary.blank?
        Rails.logger.debug("[MODULE] [QUERY_PLANNER] [process_filter_modified] page state = page_state_subscribed => No Subscriber=>
                             #{params.inspect}")
        return {}
      end

      h[:summary_id] = summary.keys
      Rails.logger.debug("[MODULE] [QUERY_PLANNER] [process_filter_modified] page state = page_state_subscribed => #{self.inspect}")

    end

    #All Page => Always with self
    if params[:page_type] == AppConstants.page_state_all

       Rails.logger.debug("[MODULE] [QUERY_PLANNER] [process_filter_modified] page state = page_state_all => #{params.inspect}")
       user = Contact.select("friend_id").where(:user_id => params[:current_user_id]).map(&:friend_id)
       user.blank? ? user = [params[:current_user_id]] : user << params[:current_user_id]
       h[:user_id] = user

    end

    #USER/ME Page
    if params[:page_type] == AppConstants.page_state_user

       Rails.logger.debug("[MODULE] [QUERY_PLANNER] [process_filter_modified] page_state = page_state_user => #{params.inspect}")
       h[:user_id] = params[:user_id]

    end

    #DEFAULT IS PUBLIC => IN this page user and summary variables will be nil. So only on filters
    h[:updated_at] = params[:updated_at].to_time.utc  if !params[:updated_at].blank?

    h
  end

end