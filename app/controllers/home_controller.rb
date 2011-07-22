class HomeController < ApplicationController
  #before_filter :only_when_user_is_logged_in, :only => :show

  ############################################
   def show

    @user=nil
    @profile_page =1

    Rails.logger.info("[CNTRL] [HOME] [SHOW] Home Show request with #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User not signed in")
    end


    if params[:mode] == 'filtered'
      Rails.logger.info("[CNTRL] [HOME] [SHOW] Stream page requested with filtered mode")
      @defaul_page_mode = 'filtered'
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
  def get_activities
    Rails.logger.info("[CNTRL][HOME][ACTIVITIES] Get activities")
    Rails.logger.info("[CNTRL][HOME][ACTIVITIES] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end

  end
  ############################################
  def get_entities
    Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] Get entities ")
    Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] Params #{params}")

    dummy_json=[
                  {:id => 1, :name => "Pizza", :image => "/images/actwitty/unknown_entity.png" },
                  {:id => 2, :name => "Burger", :image => "/images/actwitty/unknown_entity.png" },
                  {:id => 3, :name => "Kal Ho Na Ho", :image => "/images/actwitty/unknown_entity.png" },
                  {:id => 4, :name => "Sahib Sindh Sultan", :image => "/images/actwitty/unknown_entity.png" }
                ]
    Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] Returning dummy")
    if request.xhr?
      render :json => dummy_json, :status => 200
    end
    #send_json=current_user.get_related_entities(params[user_id],params[filter])
    #if request.xhr?
    #  render :json => {}, :status => 200
    #end

  end
  ############################################
  def get_related_locations
    Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] Get related locations")
    Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] Params #{params}")
   dummy_json=[
                  {:id => 1001, :type => 1, :url => "http://google.com", :name => "Google" },
                  {:id => 1002, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york" },
                  {:id => 1003, :type => 3, :name => "John's home" },
                  {:id => 1004, :type => 1, :url => "http://www.amazon.com", :name => "Amazon"}
                ]
    Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] Returning dummy")
    if request.xhr?
      render :json => dummy_json, :status => 200
    end

    #send_json=current_user.get_related_locations(params[user_id],params[filter])
    #if request.xhr?
    #  render :json => {}, :status => 200
    #end

  end
  ############################################
  def get_enriched_activities
    Rails.logger.info("[CNTRL][HOME][ENRICHED ACTIVITIES] Get enriched  activities")
    Rails.logger.info("[CNTRL][HOME][ENRICHED ACTIVITIES] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
  def get_all_comments
    Rails.logger.info("[CNTRL][HOME][ALL COMMENTS] Get All Comments")
    Rails.logger.info("[CNTRL][HOME][ALL COMMENTS] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
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
    Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] Related friends request")
    Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] Params #{params}")
    if user_signed_in?
      #current_user.get_related_friends(params[filter])
      dummy_json=[
                    {:id => 1, :name => "Abc Def", :image => "/images/actwitty/default_user.gif" },
                    {:id => 2, :name => "Xyz Pqr", :image => "/images/actwitty/default_user.gif" },
                    {:id => 3, :name => "Mno Abc", :image => "/images/actwitty/default_user.gif" },
                    {:id => 4, :name => "Bbb Ddd", :image => "/images/actwitty/default_user.gif" }
                  ]
      Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] Returning dummy")
      if request.xhr?
        render :json => dummy_json, :status => 200
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
    Rails.logger.info("[CNTRL][HOME][DELETE STREAM] Delete user stream")
    Rails.logger.info("[CNTRL][HOME][DELETE STREAM] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
  def delete_comment
    Rails.logger.info("[CNTRL][HOME][DELETE COMMENT] Delete user comment")
    Rails.logger.info("[CNTRL][HOME][DELETE COMMENT] Params #{params}")
    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
  def create_activity
    Rails.logger.info("[CNTRL][HOME][CREATE ACTIVITY] Create activity requested with #{params}")
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
      Rails.logger.debug("[CNTRL][HOME][CREATE ACTIVITY] Calling model api")

      response_json=current_user.create_activity(params)
      Rails.logger.debug("[CNTRL][HOME][CREATE ACTIVITY] Returned from model api #{response_json}")
       if request.xhr?
        render :json => response_json, :status => 200
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

    if request.xhr?
      render :json => {}, :status => 400
    end
  end
  ############################################
   def get_summary
    Rails.logger.info("[CNTRL][HOME][GET SUMMARY] user get summary requested with params #{params}")
    if user_signed_in?
       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] Calling model api")
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
  def get_friends_summary
    Rails.logger.info("[CNTRL][HOME][GET FRIENDS SUMMARY] user get summary requested with params #{params}")
    if user_signed_in?
      if !params[:user_id].blank? && params[:user_id] != current_user.id
        params[:friend]=true
        Rails.logger.debug("[CNTRL][HOME][GET FRIENDS SUMMARY] Calling model api #{params}")
        response_json=current_user.get_summary(params)
        Rails.logger.debug("[CNTRL][HOME][GET FRIENDS SUMMARY] returned from model api ")
        if request.xhr?
          Rails.logger.debug("[CNTRL][HOME][GET FRIENDS SUMMARY] sending response JSON #{response_json}")
          render :json => response_json, :status => 200
        end
      else
        Rails.logger.error("[CNTRL][HOME][GET FRIENDS SUMMARY] Bad request cannot get friends of other users")
        if request.xhr?
          render :json => {}, :status => 400
        end
      end
    else
      Rails.logger.error("[CNTRL][HOME][GET FRIENDS SUMMARY] Get summary failed as user is not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
end

