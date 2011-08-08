class HomeController < ApplicationController
  #before_filter :only_when_user_is_logged_in, :only => :show

  ############################################
   def show

    @user=nil
    @profile_page = 1
    @filtered_mode = ""

    Rails.logger.info("[CNTRL] [HOME] [SHOW] Home Show request with #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User not signed in")
    end


    if params[:mode] == 'filtered'
      Rails.logger.info("[CNTRL] [HOME] [SHOW] Stream page requested with filtered mode")
      @filtered_mode = 'filtered'
      Rails.logger.info("[CNTRL] [HOME] [SHOW] Stream page requested with filtered mode set #{@filtered_mode}")
      if !params[:c_id].blank? &&  !params[:c_name].blank?
        @filter_channel_name=params[:c_name]
        @filter_channel_id=params[:c_id]
      end

      if !params[:e_id].blank? &&  !params[:e_name].blank?
        @filter_entity_id=params[:e_id]
        @filter_entity_name=params[:e_name]
      end

      if !params[:l_id].blank? &&  !params[:l_name].blank?
        @filter_location_id=params[:l_id]
        @filter_location_name=params[:l_name]
      end
      params.except(:mode)
    end
    #if no id mentioned or user not found try to fall back to current user
    #if user not logged in then go to sign in page
    @follow = true
    if params[:id].nil?
      if user_signed_in?
        @user=current_user
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as no id mentioned")
      else
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
      end
    else
      @user=User.find_by_id(params[:id])
      if @user.nil?
        if user_signed_in?
          @user=current_user
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as incorrect id mentioned")
        else
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as incorrect id mentioned")
          redirect_to :controller => "welcome", :action => "new"
        end
      else
        if user_signed_in?  && @user.id != current_user.id
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Checking the follow/unfollow status")
          @follow = current_user.check_follower(@user.id)
        end
      end
    end

  end
  ############################################
  def settings
	  Rails.logger.info("[CNTRL][HOME][SETTINGS]  home/setting Page")
	  @user = User.find_by_confirmation_token(params[:confirmation_token])
	  Rails.logger.info("[CNTRL][HOME][SETTINGS] Settings Page User id: #{@user.id}")
	  if !@user.nil?
	      @profile = Profile.find_by_user_id(@user.id)
	      Rails.logger.info("[CNTRL][HOME][SETTINGS] If User is Not Nil, then profile: #{@profile.user_id}")
	      puts @profile.user_id
	      puts @profile.id
	  end
  end
  ############################################
  def settings_save
	  Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Entry to Settings Update Page")
	  @user = User.find_by_confirmation_token(params[:confirmation_token])
	  puts @user.id
	  @profile = Profile.find_by_user_id(@user.id)
	  Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Settings Update Page Information #{params[:profile]}")
	  #Document.UploadDocument(@user.id, nil ,  [params[:profile][:profile_photo_l]])
	  if @profile.update_attributes(params[:profile])
	    Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] After Updating Settings Page")
	    redirect_to(home_show_url)
	  end
	 Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Exit From Settings Update Page")

  end
  ############################################
  def get_channels
   Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] Get activities #{params}")
   if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] calling model api #{params}")
      params[:user_id] == Integer(params[:user_id]);
      response_json=current_user.get_user_activities( params[:user_id], params[:sort_order])

      Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ############################################
  def get_related_entities

    Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] Get entities #{params}")

    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] calling model api #{params}")
      response_json=current_user.get_related_entities(params[:user_id], params[:filter])
      Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
   ############################################
  def get_entities

    Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] Get entities #{params}")

    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][USER ENTITIES] calling model api #{params}")

      params[:user_id] == Integer(params[:user_id]);
      response_json=current_user.get_user_entities( params[:user_id], params[:sort_order])

      Rails.logger.info("[CNTRL][HOME][USER ENTITIES] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][USER ENTITIES] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ############################################
  def get_related_locations
   Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] Get related locations #{params}")
   if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] calling model api #{params}")
      response_json=current_user.get_related_locations(params[:user_id], params[:filter])
      Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
   #####################################################
   def get_locations
   Rails.logger.info("[CNTRL][HOME][USER LOCATIONS] Get related locations #{params}")
   if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][USER LOCATIONS] calling model api #{params}")
      response_json=current_user.get_user_locations( params[:user_id], params[:sort_order])
      Rails.logger.info("[CNTRL][HOME][USER LOCATIONS] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][USER LOCATIONS] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end


  ############################################
  def get_enriched_activities
    Rails.logger.info("[CNTRL][HOME][ENRICHED ACTIVITIES] Get enriched  activities #{params}")


    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][ENRICHED ACTIVITIES] calling model api Filter:#{params[:filter]}")
      response_json=current_user.get_enriched_activities(params[:post_ids])
      Rails.logger.info("[CNTRL][HOME][ENRICHED ACTIVITIES] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][ENRICHED ACTIVITIES] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ############################################
  def get_all_comments

    Rails.logger.info("[CNTRL][HOME][ALL COMMENTS] get all comments #{params}")
    if user_signed_in?
      if params[:activity_id].blank?
        render :json => {}, :status => 400
        return
      end
      params[:activity_id]=Integer(params[:activity_id])

      Rails.logger.info("[CNTRL][HOME][ALL COMMENTS] calling model api #{params[:activity_id]}")
      response_json=current_user.load_all_comment(params[:activity_id])

      if request.xhr?
        Rails.logger.info("[CNTRL][HOME][ALL COMMENTS] created successfully #{response_json}")
        render :json => response_json, :status => 200
      end

    else
      Rails.logger.info("[CNTRL][HOME][CREATE STREAM] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
  def get_all_campaigns
    Rails.logger.info("[CNTRL][HOME][ALL CAMPAIGNS] Get All Campaigns")
    Rails.logger.info("[CNTRL][HOME][ALL CAMPAIGNS] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
  # User sign in required
  def get_related_friends
    Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] Related friends request #{params}")

    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] calling model api Filter:#{params[:filter]}")
      response_json=current_user.get_related_friends(params[:filter])
      Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] model returned #{response_json}")
      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################

  def update_campaign
    Rails.logger.info("[CNTRL][HOME][UPDATE CAMPAIGN] Update user campaign")
    Rails.logger.info("[CNTRL][HOME][UPDATE CAMPAIGN] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
  def delete_campaign
    Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] Update user campaign")
    Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
  def delete_stream
    Rails.logger.info("[CNTRL][HOME][DELETE STREAM] Delete user stream #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][DELETE STREAM] calling model api #{params[:post_id]}")
      response=current_user.remove_activity(params[:post_id])
      if response.nil?
        Rails.logger.info("[CNTRL][HOME][DELETE STREAM] failed to delete #{params[:post_id]}")
        if request.xhr?
          render :json => {}, :status => 400
        end
      else
        if request.xhr?
          Rails.logger.info("[CNTRL][HOME][DELETE STREAM] deleted successfully #{params[:post_id]}")
          render :json => {}, :status => 200
        end
      end
    else
      Rails.logger.info("[CNTRL][HOME][DELETE STREAM] User not signed in #{params[:post_id]}")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
  def create_comment
    Rails.logger.info("[CNTRL][HOME][CREATE COMMENT] create user comment #{params}")
    if user_signed_in?
      model_params={}

      model_params[:author_id] =  current_user.id
      model_params[:text] = params[:text]
      model_params[:activity_id] = params[:activity_id]
      Rails.logger.info("[CNTRL][HOME][CREATE COMMENT] calling model api #{model_params}")
      response_json=current_user.create_comment(model_params)
      if response_json.nil?
        Rails.logger.info("[CNTRL][HOME][CREATE COMMENT] failed to create #{model_params}")
        if request.xhr?
          render :json => {}, :status => 400
        end
      else
        if request.xhr?
          Rails.logger.info("[CNTRL][HOME][CREATE COMMENT] created successfully #{response_json}")
          render :json => response_json, :status => 200
        end
      end
    else
      Rails.logger.info("[CNTRL][HOME][CREATE STREAM] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
  def delete_comment
    Rails.logger.info("[CNTRL][HOME][DELETE COMMENT] create user comment #{params}")
    if user_signed_in?

      Rails.logger.info("[CNTRL][HOME][DELETE COMMENT] calling model api #{params[:comment_id]}")
      response_json=current_user.remove_comment(params[:comment_id])
      if response_json.nil?
        Rails.logger.info("[CNTRL][HOME][DELETE COMMENT] failed to create #{model_params}")
        if request.xhr?
          render :json => {}, :status => 400
        end
      else
        if request.xhr?
          Rails.logger.info("[CNTRL][HOME][DELETE COMMENT] created successfully #{response_json}")
          render :json => response_json, :status => 200
        end
      end
    else
      Rails.logger.info("[CNTRL][HOME][DELETE STREAM] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
  def create_activity


    Rails.logger.info("[CNTRL][HOME][CREATE ACTIVITY] Create activity requested with #{params}")
    @success=false
    if user_signed_in?
      if params[:enrich].blank?
        params[:enrich] = false
      else
        if params[:enrich] == "true"
          params[:enrich] = true
        else
          params[:enrich] = false
        end
      end

      if params[:status] && !params[:status].blank?
       params[:status] = Integer(params[:status])
      end
      if params[:campaign_types] && !params[:campaign_types].blank?
        params[:campaign_types] = Integer(params[:campaign_types])
      end

      if !params[:documents].nil?
       doc_arr = Array.new()
       params[:documents].each do |index, doc_hash|
        doc_arr = doc_arr << doc_hash
       end
       params[:documents]= doc_arr
      end
      Rails.logger.debug("[CNTRL][HOME][CREATE ACTIVITY] Calling model api with #{params}")
      response_json=current_user.create_activity(params)
      Rails.logger.debug("[CNTRL][HOME][CREATE ACTIVITY] Returned from model api #{response_json}")
      @success=true


      respond_to do |format|
        format.json
      end
    else
      Rails.logger.info("[CNTRL][HOME][CREATE ACTIVITY] No sign in, not creating any activity")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
  def get_streams
    Rails.logger.info("[CNTRL][HOME][GET STREAMS] user get streams requested with params #{params}")
    if user_signed_in?
      if params[:friend].blank?
        params[:friend] = false
      else
        if params[:friend] == "true"
          params[:friend] = true
        else
          params[:friend] = false
        end
      end
      if !params[:user_id].blank? && Integer(params[:user_id]) == current_user.id

        params[:user_id]=Integer(params[:user_id])
        Rails.logger.error("[CNTRL][HOME][GET FRIENDS SUMMARY] Bad request cannot get friends of current users")
      else

        params[:user_id]=Integer(params[:user_id])

        Rails.logger.error("[CNTRL][HOME][GET FRIENDS SUMMARY] Bad request cannot get friends of other users")

      end
        Rails.logger.debug("[CNTRL][HOME][GET STREAMS] Calling model api for #{params}")
        response_json=current_user.get_stream(params)
        Rails.logger.debug("[CNTRL][HOME][GET STREAMS] returned from model api")
        if request.xhr?
          Rails.logger.debug("[CNTRL][HOME][GET STREAMS] sending response JSON #{response_json}")
          render :json => response_json, :status => 200
        end

    else
      Rails.logger.error("[CNTRL][HOME][GET STREAMS] Get summary failed as user is not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
   def get_summary
    Rails.logger.info("[CNTRL][HOME][GET SUMMARY] user get summary requested with params #{params}")
    if user_signed_in?
      if params[:friend].blank?
        params[:friend] = false
      else
        if params[:friend] == "true"
          params[:friend] = true
        else
          params[:friend] = false
        end
      end
       params[:user_id]=Integer(params[:user_id])
       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] Calling model api #{params}")
       response_json=current_user.get_summary(params)
       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] returned from model api")
      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] sending response JSON #{response_json}")
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.error("[CNTRL][HOME][GET SUMMARY] Get summary failed as user is not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end


  ############################################

  def delete_entities_from_post
    Rails.logger.info("[CNTRL][HOME][DELETE ENTITIES] user delete entities from post #{params}")
    activity_id = Integer(params[:post_id])
    entity_id = Integer(params[:entity_id])
    if user_signed_in?
      response_json = current_user.remove_entity_from_activity(activity_id, entity_id)
      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][DELETE ENTITIES] sending response JSON #{response_json}")
        render :json => response_json, :status => 200
      end

    end
  end

  ################################################
  def activity
    @user=current_user
    @profile_page = 1


    Rails.logger.info("[CNTRL] [HOME] [ACTIVITY] Activity show request with #{params}")
     if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [ACTIVITY] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [ACTIVITY] User not signed in")
    end
  end
end

