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
    h[:updated_at] =  params[:updated_at] if !params[:updated_at].blank?
  end


  def pq_social_counter_filter(params)
    h = {}
    h[:summary_id] =  params[:summary_id] if !params[:summary_id].blank?
    h[:activity_id] =  params[:activity_id] if !params[:activity_id].blank?

    h[:location_id] =  params[:location_id] if !params[:location_id].blank?
    h[:entity_id] =  params[:entity_id] if !params[:entity_id].blank?
    h[:document_id] =  params[:document_id] if !params[:document_id].blank?

    h[:author_id] =  params[:author_id] if !params[:author_id].blank?

    h[:updated_at] = params[:updated_at] if !params[:updated_id].blank?
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

    h[:updated_at] = params[:updated_at] if !params[:updated_id].blank?
  end


  def pq_summary_filter(params)
    h = {}

    h[:id] =  params[:id] if !params[:id].blank?
    h[:user_id] = params[:user_id] if !params[:user_id].blank?
    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
    h[:updated_at] = params[:updated_at] if !params[:updated_id].blank?

  end


  def pq_hub_filter( params)
    h = {}
    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
    h[:location_id] = params[:location_id] if !params[:location_id].blank?
    h[:entity_id] = params[:entity_id] if !params[:entity_id].blank?
    h[:source_name] = params[:source_name] if !params[:source_name].blank?

    h[:user_id] = params[:user_id] if !params[:user_id].blank?
    h[:summary_id] = params[:summary_id] if !params[:summary_id].blank?

    h[:updated_at] = params[:updated_at] if !params[:updated_at].blank?

    h
  end


  def pq_activity_filter(params)
    h = {}
    h[:author_id] = params[:user_id] if !params[:user_id].blank?
    h[:summary_id] = params[:summary_id] if !params[:summary_id].blank?

    h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
    h[:base_location_id] = params[:location_id] if !params[:location_id].blank?
    h[:source_name] = params[:source_name] if !params[:source_name].blank?

    h[:status] = params[:status] if !params[:status].blank?
    h[:updated_at] = params[:updated_at] if !params[:updated_at].blank?

    if !params[:meta_activity].nil?
      if h[:activity_word_id].blank? && h[:base_location_id].blank? && h[:source_name].blank?
        h[:meta_activity] = params[:meta_activity]
      end
    end

    h
  end
end