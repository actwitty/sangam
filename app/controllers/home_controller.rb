
class HomeController < ApplicationController
  #before_filter :only_when_user_is_logged_in, :only => :show

  #Alok Adding pusher support
  protect_from_forgery :except => :pusher_auth # stop rails CSRF protection for this action

   #Alok Adding pusher support
   #Commenting for time being
#  after_filter  :pusher_event_push, :only => [:create_campaign, :delete_campaign, :delete_stream, :create_comment,
#                                              :delete_comment,  :delete_entities_from_post, :remove_document,
#                                             :publish_activity,  :update_social_media_share,
#                                             :subscribe_summary, :unsubscribe_summary, :create_theme
#                                              #:process_edit_activity,:create_activity
#

  
#  #FOR  PUBLIC SHOW OF POST/ACCOUNT
  include ApplicationHelper
  GET_FUNCTIONS_ARRAY= [:show, :streams, :get_single_activity, :activity, 
                        :mention_page, :location_page, :channel_page, 
                        :update_social_media_share, :get_summary,
                        :get_entities,:get_channels, :get_locations,
                        :get_mention_stream,:get_activity_stream,
                        :get_location_stream,:get_document_stream,
                        :get_streams, :get_related_entities,
                        :get_related_locations, :get_social_counter, 
                        :get_related_friends, :get_all_comments,
                        :get_users_of_campaign, 
                        :subscribers,:subscriptions,
                        :get_latest_summary, :search_any,
                        :get_analytics_summary,
                        :get_analytics]

  #TODO NEED FIX.. TEMPORARY                                
  #before_filter :redirect_back_to
  before_filter  :authenticate_user , :except => GET_FUNCTIONS_ARRAY
  before_filter  :create_ghost_user, :only =>  GET_FUNCTIONS_ARRAY
  after_filter  :remove_ghost_user
  ############################################
  
  #TODO NEED FIX.. TEMPORARY
  def store_and_redirect_location
    #session[:return_to] = "/"
    redirect_to "/welcome/new",:status => 401
  end
 
  #TODO NEED FIX.. TEMPORARY 
  def redirect_back_to
     if !session[:return_to].blank?
       redirect_to session[:return_to]
       session[:return_to] = nil
     end
  end

  def  authenticate_user
    if user_signed_in?
      #This block should not hit ideally
      if if_ghost_user?
        Rails.logger.info("[MODEL] [CNTRL] [AUTHENTICATE_USER] ***** ghost user active .. CHECK HOW?????? ****** REQUEST URI = #{request.request_uri}")
        sign_out(current_user)
        store_and_redirect_location
        return false
      end  
    else
      Rails.logger.info("[MODEL] [CNTRL] [AUTHENTICATE_USER] REQUEST URI = #{request.request_uri}")
      store_and_redirect_location
      return false
    end
  end

  def create_ghost_user
    if !user_signed_in?
      #ghost user can be added in session to avoid query
      ghost_user  = User.find_by_email(AppConstants.ghost_user_email)
      if ghost_user.nil?
         ghost_user = User.new(:username => "actwittywebadmin", 
                               :full_name => "Actwitty Administrator", 
                               :email => "administrator@actwitty.com", 
                               :password => "XJksaU72134kLS", 
                               :password_confirmation => "XJksaU72134kLS",
                               :gender => "male",
                               :current_location => "Banglore,India",
                               :current_geo_lat => "12.9716",
                               :current_geo_long => "77.5942",
                               :dob => "11/11/2011",
                               :user_type => "2")
         begin
          ghost_user.save!
         rescue => e
            Rails.logger.info(e.message)
            Rails.logger.info(e.backtrace.join("\n"))
         end
      end
      sign_in(ghost_user)
      Rails.logger.info("[CNTRL] [HOME] [CREATE_GHOST_USER] signed in ")
    end
  end

  def remove_ghost_user
    if if_ghost_user?
      sign_out(current_user)
      Rails.logger.info("[CNTRL] [HOME] [REMOVE_GHOST_USER] signed in ")
    end
  end

  #PUBLIC SHOW END

  def streams

    @user=nil
    @page_mode="profile_stm_page"
    @aw_stm_scope="p" #p/s/a

    Rails.logger.info("[CNTRL] [HOME] [STREAMS] Home STREAMS request with #{params}")

    if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [STREAMS] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [STREAMS] User not signed in")
    end

      
      @aw_chn_filter_text_val = "All Channels"
      @aw_mention_filter_text_val = "All Mentions"
      @aw_location_filter_text_val = "All Locations"

      Rails.logger.info("[CNTRL] [HOME] [STREAMS] Stream page requested with filtered mode")
      if !params[:s].blank?
        if params[:s] == 'p' or params[:s] == 's' or params[:s] == 'a'
            @aw_stm_scope = params[:s]
        end
      end

      if !params[:c_id].blank? &&  !params[:c_name].blank?
        @aw_chn_filter_text_val=params[:c_name]
        @aw_chn_filter_id_val=params[:c_id]
      end

      if !params[:m_id].blank? &&  !params[:m_name].blank?
        @aw_mention_filter_text_val=params[:m_name]
        @aw_mention_filter_id_val=params[:m_id]
      end

      if !params[:l_id].blank? &&  !params[:l_name].blank?
        @aw_location_filter_text_val=params[:l_id]
        @aw_location_filter_text_val=params[:l_name]
      end

   
    #if no id mentioned or user not found try to fall back to current user
    #if user not logged in then go to sign in page
    if params[:id].nil?
      if user_signed_in?
        @user=current_user
        Rails.logger.info("[CNTRL] [HOME] [STREAMS] Setting user id to current user as no id mentioned")
      else
        Rails.logger.info("[CNTRL] [HOME] [STREAMS] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
      end
    else
      user_id =  params[:id]
      @user=User.find_by_id(user_id)
      if @user.nil?
        if user_signed_in?
          Rails.logger.info("[CNTRL] [HOME] [STREAMS] User is signed in")
          @user=current_user
          Rails.logger.info("[CNTRL] [HOME] [STREAMS] Setting user id to current user as incorrect id mentioned")
        else
          Rails.logger.info("[CNTRL] [HOME] [STREAMS] Redirecting to welcome new as incorrect id mentioned")
          redirect_to :controller => "welcome", :action => "new"
        end
      end
    end


    if user_signed_in?
      authentication = Authentication.where(:user_id => current_user.id, :provider => 'facebook').all().first()
      @fb_access_token = authentication.token
      Rails.logger.info("[CNTRL] [HOME] [STREAMS] Inlining in page FB access token #{@fb_access_token}")
    end

    #FB: Open graph tags start
    
    unless @aw_mention_filter_text_val.blank?
      @page_description = "#{@page_description} filtered for mentions of #{@aw_mention_filter_text_val}"
    end
    @page_url = current_url(:id=>@user.id)


    #FB: Open graph tags start
    fb_og_title = "#{@user.full_name} streams at ActWitty"
    unless @aw_chn_filter_text_val.blank?
      fb_og_title = "#{@user.full_name} #{@aw_chn_filter_text_val} streams at ActWitty"
    end
    
    fb_og_description = "#{@user.full_name} #{@aw_chn_filter_text_val} streams at ActWitty."
    unless @aw_mention_filter_text_val.blank?
      fb_og_description = "#{@page_description} filtered for mentions of #{@aw_mention_filter_text_val}"
    end

    set_meta_tags :open_graph => {
                                  :title => fb_og_title,
                                  :type => "activity",
                                  :site_name => "ActWitty",
                                  :image => "#{@user.photo_small_url}",
                                  :description => fb_og_description,
                                  :url => current_url(:id=>@user.id)
                                  }
    #FB: Open graph tags end

  end
  ###################################################################################
  # # https://x.com/y/1?page=1
  # + current_url( :page => 3 )
  # = https://x.com/y/1?page=3
  def current_url(overwrite={})
    url_for :only_path => false, :params => params.merge(overwrite)
  end
  ###################################################################################
  def show

    @user=nil
    @page_mode="profile_chn_page"

    Rails.logger.info("[CNTRL] [HOME] [SHOW] Home Show request with #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User not signed in")
    end

    #if no id mentioned or user not found try to fall back to current user
    #if user not logged in then go to sign in page
    if params[:id].nil?
      if user_signed_in?
        @user=current_user
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as no id mentioned")
      else
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
      end
    else
      user_id =  params[:id]
      @user=User.find_by_id(user_id)
      if @user.nil?
        if user_signed_in?
          @user=current_user
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as incorrect id mentioned")
        else
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as incorrect id mentioned")
          redirect_to :controller => "welcome", :action => "new"
        end
      end
    end
    if user_signed_in?
      authentication = Authentication.where(:user_id => current_user.id, :provider => 'facebook').all().first()
      @fb_access_token = authentication.token
      Rails.logger.info("[CNTRL] [HOME] [STREAMS] Inlining in page FB access token #{@fb_access_token}")
    end
    #FB: Open graph tags start
    set_meta_tags :open_graph => {
                                  :title => "#{@user.full_name} Channels at ActWitty",
                                  :type => "activity",
                                  :site_name => "ActWitty",
                                  :image => "#{@user.photo_small_url}",
                                  :description => "#{@user.full_name} social footprint organized under activity or interest channels.",
                                  :url => current_url(:id=>@user.id)
                                  }
    #FB: Open graph tags end

  end
 
  ############################################
  def subscribers
    Rails.logger.info("[CNTRL][HOME][SUBSCRIBER] request params : #{params}")
    user_id =  Integer(params[:user_id])
    Rails.logger.info("[CNTRL][HOME][SUBSCRIBER] model api : #{user_id}")
    response_json=current_user.get_subscribers(user_id)
    Rails.logger.info("[CNTRL][HOME][SUBSCRIBER] response json : #{response_json}")
    if request.xhr?
      expires_in 10.minutes
      render :json => response_json
    end
  end
  ############################################
 def subscriptions
    Rails.logger.info("[CNTRL][HOME][SUBSCRIPTIONS] request params : #{params}")
    user_id =  Integer(params[:user_id])
    Rails.logger.info("[CNTRL][HOME][SUBSCRIPTIONS] model api : #{user_id}")
    response_json=current_user.get_subscriptions(user_id)
    Rails.logger.info("[CNTRL][HOME][SUBSCRIPTIONS] response json : #{response_json}")
    if request.xhr?
      expires_in 10.minutes
      render :json => response_json
    end
  end
  ############################################
  def get_channels
   Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] Get activities #{params}")
    if params[:page_type].blank?
      params[:page_type] = 1
   else
      params[:page_type] = Integer(params[:page_type])
   end
   if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] calling model api #{params}")
      params[:user_id] == Integer(params[:user_id]);
      response_json=current_user.get_user_activities( params[:user_id], params[:sort_order])

      Rails.logger.info("[CNTRL][HOME][RELATED ACTIVITIES] model returned #{response_json}")
      if request.xhr?
        expires_in 10.minutes
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
    if params[:page_type].blank?
      params[:page_type] = 1
   else
      params[:page_type] = Integer(params[:page_type])
   end

    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] calling model api #{params}")
      response_json=current_user.get_related_entities(params)
      Rails.logger.info("[CNTRL][HOME][RELATED ENTITIES] model returned #{response_json}")
      if request.xhr?
        expires_in 10.minutes
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
    if params[:page_type].blank?
      params[:page_type] = 1
   else
      params[:page_type] = Integer(params[:page_type])
   end
    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][USER ENTITIES] calling model api #{params}")

      params[:user_id] == Integer(params[:user_id]);
      response_json=current_user.get_user_entities( params[:user_id], params[:sort_order])

      Rails.logger.info("[CNTRL][HOME][USER ENTITIES] model returned #{response_json}")
      if request.xhr?
        expires_in 10.minutes
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
   if params[:page_type].blank?
    params[:page_type] = 1
   else
    params[:page_type] = Integer(params[:page_type])
   end
   if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] calling model api #{params}")
      response_json=current_user.get_related_locations(params)
      Rails.logger.info("[CNTRL][HOME][RELATED LOCATIONS] model returned #{response_json}")
      if request.xhr?
        expires_in 10.minutes
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

   if params[:page_type].blank?
    params[:page_type] = 1
   else
    params[:page_type] = Integer(params[:page_type])
   end

   if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][USER LOCATIONS] calling model api #{params}")
      response_json=current_user.get_user_locations( params[:user_id], params[:sort_order])
      Rails.logger.info("[CNTRL][HOME][USER LOCATIONS] model returned #{response_json}")
      if request.xhr?
        expires_in 10.minutes
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
        #expires_in 10.minutes
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
  def get_users_of_campaign
    Rails.logger.info("[CNTRL][HOME][GET ALL CAMPAIGNS] Update user campaign")
    Rails.logger.info("[CNTRL][HOME][GET ALL CAMPAIGNS] Params #{params}")
    if user_signed_in?
      args={}
      args[:activity_id] = Integer(params[:activity_id])
      args[:name] = params[:name]
      Rails.logger.info("[CNTRL][HOME][GET ALL CAMPAIGNS] calling model api Filter:#{args}")
        response_json=current_user.get_users_of_campaign(args)
        Rails.logger.info("[CNTRL][HOME][GET ALL CAMPAIGNS] model returned #{response_json}")
        if request.xhr?
          expires_in 10.minutes
          render :json => response_json, :status => 200
        end
    else
      Rails.logger.info("[CNTRL][HOME][GET ALL CAMPAIGNS] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ############################################
  # User sign in required
  def get_related_friends
    Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] Related friends request #{params}")
    if params[:filter][:word_id].blank?
      params[:filter].delete(:word_id)
    end
    if params[:filter][:entity_id].blank?
      params[:filter].delete(:entity_id)
    end
    if params[:filter][:location_id].blank?
       params[:filter].delete(:location_id)
    end

    if params[:page_type].blank?
      params[:page_type] = 1
    else
      params[:page_type] = Integer(params[:page_type])
    end
    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] calling model api Filter:#{params[:filter]}")
      response_json=current_user.get_related_friends(params)
      Rails.logger.info("[CNTRL][HOME][RELATED FRIENDS] model returned #{response_json}")
      if request.xhr?
        expires_in 10.minutes
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

  def create_campaign
    Rails.logger.info("[CNTRL][HOME][CREATE CAMPAIGN] Update user campaign")
    Rails.logger.info("[CNTRL][HOME][CREATE CAMPAIGN] Params #{params}")
     if user_signed_in?
      args={}
      args[:activity_id] = Integer(params[:activity_id])
      args[:value] = Integer(params[:value])
      args[:name] = params[:name]
      Rails.logger.info("[CNTRL][HOME][CREATE CAMPAIGN] calling model api Filter:#{args}")
      response_json=current_user.create_campaign(args)
      Rails.logger.info("[CNTRL][HOME][CREATE CAMPAIGN] model returned #{response_json}")

      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][CREATE CAMPAIGN] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ############################################
  def delete_campaign
    Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] Update user campaign")
    Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] Params #{params}")
     if user_signed_in?
      args={}
      args[:activity_id] = Integer(params[:activity_id])
      args[:user_id] = current_user.id
      args[:name] = params[:name]
      Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] calling model api Filter:#{args}")
      response_json=current_user.remove_campaign(args)
      Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] model returned #{response_json}")

      if request.xhr?
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.info("[CNTRL][HOME][DELETE CAMPAIGN] User not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end
  ############################################
  def delete_stream
    Rails.logger.info("[CNTRL][HOME][DELETE STREAM] Delete user stream #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL][HOME][DELETE STREAM] calling model api #{params[:post_id]}")
      response_json=current_user.remove_activity(params[:post_id])
      if response_json.nil?
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

      #Alok Adding pusher support
      current_user.push_event_to_pusher({:channel => "#{current_user.id}", :event => params[:action], :data => response_json})


      current_user.post_new_activity_to_facebook(params, response_json)
      current_user.post_new_activity_to_twitter(params, response_json)
      
      @activity_json = response_json;
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
      if params[:page_type].blank?
        params[:page_type] = 1
      else
        params[:page_type] = Integer(params[:page_type])
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
          expires_in 10.minutes
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
      if params[:page_type].blank?
        params[:page_type] = 1
      else
        params[:page_type] = Integer(params[:page_type])
      end
       params[:user_id]=Integer(params[:user_id])
       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] Calling model api #{params}")
       response_json=current_user.get_summary(params)
       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] returned from model api")
      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] sending response JSON #{response_json}")
        expires_in 10.minutes
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
      Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] returned from model api")
      response_json = current_user.remove_entity_from_activity(activity_id, entity_id)

      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][DELETE ENTITIES] sending response JSON #{response_json}")
        render :json => response_json, :status => 200
      end

    end
  end
   ################################################
   def remove_document
    Rails.logger.info("[CNTRL][HOME][REMOVE DOCUMENT] user delete documents #{params}")
    doc_id = Integer(params[:doc_id])

    if user_signed_in?
      Rails.logger.debug("[CNTRL][HOME][REMOVE DOCUMENT] returned from model api")
      response_json = current_user.remove_document(doc_id)

      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][REMOVE DOCUMENT] sending response JSON #{response_json}")
        render :json => response_json, :status => 200
      end

    end
   end
  ##############################################
  def activity
    Rails.logger.info("[CNTRL][HOME][ ACTIVITY] request params #{params}")
    @page_mode="profile_single_activity_page"
    @single_post_id = params[:id]
    @aw_stm_scope="p"
    @user=nil
    @fb_access_token=nil

    activity_ids = [Integer(params[:id])]
    activity_arr = current_user.get_all_activity(activity_ids)
    activity_arr.each do |activity|

      #Will come only once as there is only one activity
    
      post_user_id = activity[:post][:user][:id]
      if user_signed_in?
        authentication = Authentication.where(:user_id => current_user.id, :provider => 'facebook').all().first()
        @fb_access_token = authentication.token
        if post_user_id == current_user.id 
          @user = current_user
        end
      else
        @user = User.find_by_id(post_user_id)
      end
      Rails.logger.debug("[CNTRL][HOME][SINGLE ACTIVITY] returned from model api #{@user.inspect}")


      
      post_location = ''
      unless activity[:post][:location].nil?
        unless activity[:post][:location][:name].nil?
          post_location = activity[:post][:location][:name]
        end
      end

      post_img = ''
      unless activity[:documents].nil?
        activity[:documents][:array].each do |attachment|
          if attachment[:category] == "image"
            post_img =   attachment[:url]      
            break
          end          
        end
      end

      post_video = ''
      unless activity[:documents].nil?
        activity[:documents][:array].each do |attachment|
          if attachment[:category] == "video"
            post_video =   attachment[:url]      
            break
          end          
        end
      end

      post_keywords = ''
      unless activity[:tagss].nil?
        activity[:tags][:array].each do |tag|
          post_keywords= "#{post_keywords} #{tag[:name]}"
        end
      end

      #FB: Open graph tags start
      set_meta_tags :open_graph => {
                                    :title => "#{activity[:post][:user][:full_name]} post on #{activity[:post][:word][:name]}",
                                    :type => "#{activity[:post][:word][:name]}",
                                    :site_name => "ActWitty",
                                    :image => post_img,
                                    :video => post_video,
                                    :description => activity[:post][:text],
                                    :url => "http://www.actwitty.com/view/id=#{params[:id]}",
                                    :region => post_location,
                                  },
                  :title => "Check-in your interests",
                  :keywords => post_keywords
    end



    #FB: Open graph tags end
  end
  ##############################################

  def get_single_activity
    Rails.logger.info("[CNTRL][HOME][GET SINGLE ACTIVITY] request params #{params}")
    activity_id = Integer(params[:id])
    activity_ids = [activity_id]
    Rails.logger.debug("[CNTRL][HOME][GET SINGLE ACTIVITY] returned from model api")
    response_json = current_user.get_all_activity(activity_ids)

    if request.xhr?
      Rails.logger.debug("[CNTRL][HOME][GET SINGLE ACTIVITY] sending response JSON #{response_json}")
      expires_in 10.minutes
      render :json => response_json, :status => 200
    end
  end

  ######################################
  def get_draft_activities
    Rails.logger.info("[CNTRL][HOME][GET DRAFT ACTIVITIES] request params #{params}")

    if user_signed_in?
      Rails.logger.debug("[CNTRL][HOME][GET DRAFT ACTIVITIES] returned from model api")
      response_json = current_user.get_draft_activity(params)

      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][GET DRAFT ACTIVITIES] sending response JSON #{response_json}")

        render :json => response_json, :status => 200
      end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ######################################
  def publish_activity
    Rails.logger.info("[CNTRL][HOME][PUBLISH ACTIVITY] request params #{params}")
    args={}
    args[:activity_id] = Integer(params[:activity_id])
    args[:status] = 2
    if user_signed_in?
      Rails.logger.debug("[CNTRL][HOME][PUBLISH ACTIVITY] returned from model api with #{params}")
      response_json = current_user.publish_activity(args)

      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][PUBLISH ACTIVITY] sending response JSON #{response_json}")
        expires_in 10.minutes
        render :json => response_json, :status => 200
      end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ######################################
   def process_edit_activity
    Rails.logger.info("[CNTRL][HOME][PROCESS EDITED ACTIVITY] request params #{params}")

    unless params[:status].blank?
      params[:status]= Integer(params[:status])
    else
      render :json => {}, :status => 400
      return
    end

    if !params[:activity_id].blank?
      params[:activity_id] = Integer(params[:activity_id])
    else
      render :json => {}, :status => 400
      return
    end

    if params[:enrich].blank?
        params[:enrich] = false
    else
      if params[:enrich] == "true"
        params[:enrich] = true
      else
        params[:enrich] = false
      end
    end


    if params[:campaign_types] && !params[:campaign_types].blank?
      params[:campaign_types] = Integer(params[:campaign_types])
    else
      params[:campaign_types] = 1
    end


    if !params[:documents].blank?
      doc_arr = Array.new()
      params[:documents].each do |index, doc_hash|
        doc_arr = doc_arr << doc_hash
      end
      params[:documents]= doc_arr
    end

    response_json={}
    if user_signed_in?
        Rails.logger.debug("[CNTRL][HOME][PROCESS EDITED ACTIVITY] calling  model api with #{params}")
        response_json = current_user.update_activity(params)
        Rails.logger.debug("[CNTRL][HOME][PROCESS EDITED ACTIVITY] returned response JSON #{response_json}")

    else
        render :json => {}, :status => 400
        return
    end

    @success=true

    #Alok Adding pusher support
    current_user.push_event_to_pusher({:channel => "#{current_user.id}", :event => params[:action], :data => response_json})

    respond_to do |format|
      format.json
    end

   end

  ######################################
  def mention_page
    Rails.logger.info("[CNTRL][HOME][ MENTION PAGE] request params #{params}")

    @user=current_user
    @page_mode="single_mention_page"
    @mention_id = params[:id]

  end
  ######################################
  def get_mention_specific_stream
    Rails.logger.info("[CNTRL][HOME][GET MENTION STREAM] request params #{params}")
    if params[:id].blank?
      render :json => {}, :status => 400
      return
    end
    query = {}
    query[:entity_id] = Integer(params[:id])
    query[:updated_at] = params[:updated_at]

    Rails.logger.debug("[CNTRL][HOME][GET MENTION STREAM] returned from model api with #{query}")

    response_json = current_user.get_entity_stream(query)

    if request.xhr?
      Rails.logger.debug("[CNTRL][HOME][GET MENTION STREAM] sending response JSON #{response_json}")
      expires_in 5.minutes
      render :json => response_json, :status => 200
    end
  end
  ######################################
  def location_page
    Rails.logger.info("[CNTRL][HOME][ LOCATION PAGE] request params #{params}")

    @user=current_user
    @page_mode="single_location_page"
    @location_id = params[:id]

  end
  ######################################
  def get_location_specific_stream
    Rails.logger.info("[CNTRL][HOME][GET LOCATION STREAM] request params #{params}")
    if params[:id].blank?
      render :json => {}, :status => 400
      return
    end
    query={}
    query[:location_id] = Integer(params[:id])
    query[:updated_at] = params[:updated_at]
    
    Rails.logger.debug("[CNTRL][HOME][GET LOCATION STREAM] returned from model api with #{query}")
    response_json = current_user.get_location_stream(query)

    if request.xhr?
      Rails.logger.debug("[CNTRL][HOME][GET LOCATION STREAM] sending response JSON #{response_json}")
      expires_in 5.minutes
      render :json => response_json, :status => 200
    end

  end
  ######################################
   def channel_page
    Rails.logger.info("[CNTRL][HOME][ CHANNEL PAGE] request params #{params}")
    @user=current_user
    @page_mode="single_channel_page"
    @channel_id = params[:id]

  end
  ######################################
  def get_channel_specific_stream

    Rails.logger.info("[CNTRL][HOME][GET CHANNEL STREAM] request params #{params}")
    if params[:id].blank?
      render :json => {}, :status => 400
      return
    end
    query={}
    query[:word_id] = Integer(params[:id])
    query[:updated_at] = params[:updated_at]
      
    Rails.logger.debug("[CNTRL][HOME][GET CHANNEL STREAM] calling  model api with #{query}")
    response_json = current_user.get_activity_stream(query)

    if request.xhr?
      Rails.logger.debug("[CNTRL][HOME][GET CHANNEL STREAM] sending response JSON #{response_json}")
      expires_in 5.minutes
      render :json => response_json, :status => 200
    end

  end
  ######################################

  def get_document_channel
   Rails.logger.info("[CNTRL][HOME][GET DOCUMENT CHANNEL] request params #{params}")

    if params[:user_id].blank?
      render :json => {}, :status => 400
      return
    end
    params[:user_id] = Integer(params[:user_id])


    if params[:page_type].blank?
        params[:page_type] = 1
    else
        params[:page_type] = Integer(params[:page_type])
    end

    if user_signed_in?
      Rails.logger.debug("[CNTRL][HOME][GET DOCUMENT CHANNEL] calling  model api with #{params}")
      response_json = current_user.get_document_summary(params)

      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][GET DOCUMENT CHANNEL] sending response JSON #{response_json}")
        expires_in 10.minutes
        render :json => response_json, :status => 200
      end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end


  end
  ######################################

  def get_document_stream
    Rails.logger.info("[CNTRL][HOME][GET DOCUMENT STREAM] request params #{params}")

    if params[:user_id].blank?
      render :json => {}, :status => 400
      return
    end
    params[:user_id] = Integer(params[:user_id])


    if params[:page_type].blank?
      params[:page_type] = 1
    else
      params[:page_type] = Integer(params[:page_type])
    end

    if user_signed_in?
      Rails.logger.debug("[CNTRL][HOME][GET DOCUMENT STREAM] calling  model api with #{params}")
      response_json = current_user.get_document_stream(params)

      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][GET DOCUMENT STREAM] sending response JSON #{response_json}")
        expires_in 10.minutes
        render :json => response_json, :status => 200
      end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end
  ######################################

   def update_social_media_share
    Rails.logger.info("[CNTRL][HOME][UPDATE SOCIAL MEDIA SHARE] request params #{params}")

    if params[:activity_id].blank? ||  params[:summary_id].blank?  ||  params[:source_name].blank?
      Rails.logger.info("[CNTRL][HOME][UPDATE SOCIAL MEDIA SHARE] returned as summary or activity is nil")
      return
    end

    args = {}
    args[:activity_id] = Integer(params[:activity_id])
    args[:summary_id] = Integer(params[:summary_id])
    args[:source_name] = params[:source_name]
    args[:action] = params[:action_type]

    args[:author_id] = current_user.id
    Rails.logger.info("[CNTRL][HOME][UPDATE SOCIAL MEDIA SHARE] calling model api #{args}")
    response_json = current_user.create_social_counter(args)
    Rails.logger.info("[CNTRL][HOME][UPDATE SOCIAL MEDIA SHARE] response from model #{response_json}")

    if request.xhr?
      render :json => {}, :status => 200
    end
   end

  ######################################

  def get_social_counter
   Rails.logger.info("[CNTRL][HOME][GET SOCIAL MEDIA SHARE] request params #{params}")
   unless params[:activity_id].blank?
     args = {}
     args[:activity_id] = Integer(params[:activity_id])
     Rails.logger.info("[CNTRL][HOME][GET SOCIAL MEDIA SHARE] calling model api #{args}")
     response_json = current_user.get_social_counter(args)
     Rails.logger.info("[CNTRL][HOME][GET SOCIAL MEDIA SHARE] response from model #{response_json}")
     if request.xhr?
      render :json => response_json, :status => 200
    end
   else
    render :json => {}, :status => 400
   end
  end
#######################################
  def subscribe_summary
   Rails.logger.info("[CNTRL][HOME][SUBSCRIBE SUMMARY] request params #{params}")
   unless params[:summary_id].blank?

     summary_id = Integer(params[:summary_id])
     Rails.logger.info("[CNTRL][HOME][SUBSCRIBE SUMMARY] calling model api #{summary_id}")
     response_json = current_user.subscribe_summary(summary_id)
     Rails.logger.info("[CNTRL][HOME][SUBSCRIBE SUMMARY] response from model #{response_json}")

     if request.xhr?
      render :json => {}, :status => 200
    end
   else
     render :json => {}, :status => 400
   end

  end
#######################################
  def unsubscribe_summary
   Rails.logger.info("[CNTRL][HOME][UNSUBSCRIBE SUMMARY] request params #{params}")
   unless params[:summary_id].blank?

     summary_id = Integer(params[:summary_id])
     Rails.logger.info("[CNTRL][HOME][UNSUBSCRIBE SUMMARY] calling model api #{summary_id}")
     response_json = current_user.unsubscribe_summary(summary_id)
     Rails.logger.info("[CNTRL][HOME][UNSUBSCRIBE SUMMARY] response from model #{response_json}")


     if request.xhr?
      render :json => {}, :status => 200
    end
   else
     render :json => {}, :status => 400
   end

  end
#######################################
  def create_theme
    Rails.logger.info("[CNTRL][HOME][CREATE SUMMARY THEME] request params #{params}")
    unless user_signed_in?
      render :json => {}, :status => 400
      return
    end
    if (!params[:summary_id].blank?) && (!params[:document_id].blank?)
      args={}
      args[:summary_id] = Integer(params[:summary_id])
      args[:document_id] = Integer(params[:document_id])
      args[:theme_type] = AppConstants.theme_document
      args[:author_id] = current_user.id
      #args[:style] = 2

      Rails.logger.info("[CNTRL][HOME][CREATE SUMMARY THEME] calling model api #{args}")
      response_json = current_user.create_theme(args)
      Rails.logger.info("[CNTRL][HOME][CREATE SUMMARY THEME] response from model #{response_json}")

        if request.xhr?
          render :json => response_json, :status => 200
        end
    else
        render :json => {}, :status => 400
    end

  end
  #######################################
  def get_latest_summary
    Rails.logger.info("[CNTRL][HOME][GET LATEST SUMMARY] request params #{params}")
    response_json = current_user.get_recent_public_summary()
    Rails.logger.info("[CNTRL][HOME][GET LATEST SUMMARY] response from model #{response_json}")
    if request.xhr?
      expires_in 10.minutes
      render :json => response_json, :status => 200
    end

  end
  ####################################
  def facebook_friends
    @page_mode = "facebook"
    provider="facebook"
    @page_mode="facebook"
    if user_signed_in?
      @user=current_user
    else
      redirect_to :controller => "welcome", :action => "new"
    end
   end
  ########################################

  #Alok Adding pusher support
  #TODO Proper user check needs to be done when google circle/facebook like sharing is on ..
  #to individual person of define group only
  #for those cases i think page refres should be enough to start with
  #:channel__name => 123 (user_id of user whose chanel needs to be subscribed)
  def pusher_auth
    user_id = Integer(params[:channel_name])
    if (current_user.id == user_id) ||(current_user.check_if_subscribed(user_id))
      response_json = Pusher[params[:channel_name]].authenticate(params[:socket_id])
      render :json => response_json
    else
      render :text => "Not authorized", :status => '403'
    end
  end
  ############################################
  def search_any
    Rails.logger.info("[CNTRL][HOME][SEARCH ANY] search params : #{params}")
    query = {}
    query[:type] = params[:type]
    query[:name] = params[:q]

    response_json = current_user.search_models(query)
    Rails.logger.info("[CNTRL][HOME][SEARCH ANY] search response : #{response_json}")
    if request.xhr?
        render :json => response_json, :status => 200
    end
  end
  ############################################
  def rename_channel_of_post

    Rails.logger.info("[CNTRL][HOME][RENAME POST CHANNEL] search params : #{params}")
    query = {}
    query[:activity_id] = params[:id]
    query[:new_name] = params[:new_name]

    response_json = current_user.rename_activity_name(query)
    Rails.logger.info("[CNTRL][HOME][RENAME POST CHANNEL ] search response : #{response_json}")
    if request.xhr?
        render :json => response_json, :status => 200
    end
  end
  ############################################
  def settings
	  Rails.logger.info("[CNTRL][HOME][SETTINGS]  home/setting Page")
    @profile_page = 1
    @page_mode="profile_usr_settings_page"
	  @user = current_user
	  Rails.logger.info("[CNTRL][HOME][SETTINGS] Settings Page User id: #{@user.id}")
    Rails.logger.info("[CNTRL][HOME][SETTINGS] Settings Page User Location: #{@user.current_location}")
	  if !@user.nil?
	      @profile = Profile.find_by_user_id(@user.id)
        if @profile.nil?
            @profile = Profile.new(@user)
            @profile.user_id = @user.id
            if @profile.save
              Rails.logger.info("[CNTRL][HOME][SETTINGS] Created profile with id: #{@profile.id}")
            else
              Rails.logger.info("[CNTRL][HOME][SETTINGS] Could not create profile")
            end
        end
	      #Rails.logger.info("[CNTRL][HOME][SETTINGS] If User is Not Nil, then profile: #{@profile.user.user_id}")
	      #puts @profile.user_id
	      #puts @profile.id
	  end
  end

  ############################################
  def settings_save
	  Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Entry to Settings Update Page")
	  @user = current_user
    
	  @profile = current_user.profile
	  
    Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Settings Update Page Information-- #{params[:user][:profile]}")
	  #Document.UploadDocument(@user.id, nil ,  [params[:profile][:profile_photo_l]])
	  if @profile.update_attributes(params[:user][:profile])
      Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Settings Update Page Information #{params[:user]}")
      if @user.update_attributes(params[:user])
        unless params[:user][:profile_photo_s].blank?
          current_user.photo_small_url = params[:profile][:profile_photo_s]
          current_user.save!
        end
	      Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] After Updating Settings Page")
        # TODO : need to decide whether we need to stay in same page or move to home page
	      #redirect_to(home_show_url)
	    end
    end
	  Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Exit From Settings Update Page")
    respond_to do |format|
      #format.html { render_with_scope :new }
      format.js   {  }
    end
  
  end

  ########################################### 
  def change_profile_pic
     Rails.logger.info("[CNTRL][HOME][CHANGE_PROFILE_PIC] Entry to Change Profile Pic")
     Rails.logger.info("[CNTRL][HOME][CHANGE_PROFILE_PIC] profile_pic value = #{params[:user][:photo_small_url]}")
     @user = current_user
     @user.photo_small_url = params[:user][:photo_small_url]
     if @user.save!
      Rails.logger.info("[CNTRL][HOME][CHANGE_PROFILE_PIC] Could not save profile pic")
     else
      Rails.logger.info("[CNTRL][HOME][CHANGE_PROFILE_PIC] Saved profile pic")
     end
  end

  




  ############################################
  # change password through settings page
  def change_password
    @current_password = true
    Rails.logger.info("[CNTRL] [HOME] [CHANGE_PASSWORD] Password change request")
    @user = current_user
    Rails.logger.info("[CNTRL] [HOME] [CHANGE_PASSWORD] Params #{params}")    
    if @user.valid_password?(params[:user][:current_password])
      if @user.update_with_password(params[:user])
        sign_in(@user, :bypass => true)
        Rails.logger.info("[CNTRL] [HOME] [CHANGE_PASSWORD] Password has been changed successfully")
        return
      else
        Rails.logger.info("[CNTRL] [HOME] [CHANGE_PASSWORD] -- Not able to change password")    
        #render :edit
      end
    else
        Rails.logger.info("[CNTRL] [HOME] [CHANGE_PASSWORD] -- Current password is not same")    
        @current_password = false
        
        return 
    end
    respond_to do |format|
          format.js
        end 
  end


  ############################################
  def deactivate_account
    Rails.logger.info("[CNTRL] [HOME] [DEACTIVATE_ACCOUNT] Deactivating the account #{params}")
    @user = current_user
    @profile = current_user.profile
    @authentication = Authentication.find_by_user_id(@user.id)
    Rails.logger.info("[CNTRL] [HOME] [DEACTIVATE_ACCOUNT] User values: #{@user}")
    Rails.logger.info("[CNTRL] [HOME] [DEACTIVATE_ACCOUNT] Profile values : #{@profile}")
    Rails.logger.info("[CNTRL] [HOME] [DEACTIVATE_ACCOUNT] Authentication values : #{@authentication}")
    @authentication.destroy
    @profile.destroy
    @user.destroy
    Rails.logger.info("[CNTRL] [HOME] [DEACTIVATE_ACCOUNT] Destroyed all related tables")
 
    redirect_to root_path

  end

  ############################################
  
  def get_analytics_summary
    Rails.logger.info("[CNTRL] [HOME] [GET_ANALYTICS_SUMMARY] Params:#{params}")
    query={}
    if params[:type] == "channel"
      query[:summary_id] =  Integer(params[:id])
    elsif params[:type] == "location"
      query[:location_id] =  Integer(params[:id])
    elsif params[:type] == "mention"
      query[:entity_id] =  Integer(params[:id])
    else
      Rails.logger.info("[CNTRL][HOME][GET_ANALYTICS_SUMMARY] Analytics summary type incorrect")
      if request.xhr?
        render :json => {}, :status => 400
      end
      return
    end
    
    Rails.logger.info("[CNTRL][HOME][GET_ANALYTICS_SUMMARY] Calling model api params #{query}")
    response_json = current_user.get_analytics_summary(query)
    Rails.logger.info("[CNTRL][HOME][GET_ANALYTICS_SUMMARY] model api response #{query}")
    if request.xhr?
      expires_in 10.minutes
      render :json => response_json
    end

  end
  ############################################

  def get_analytics
    Rails.logger.info("[CNTRL] [HOME] [GET_ANALYTICS] Params:#{params}")
    query={}
    if params[:type] == "channel"
      query[:summary_id] =  Integer(params[:id])
    elsif params[:type] == "location"
      query[:location_id] =  Integer(params[:id])
    elsif params[:type] == "mention"
      query[:entity_id] =  Integer(params[:id])
    else
      Rails.logger.error("[CNTRL][HOME][GET_ANALYTICS] [ERROR] Analytics summary type incorrect")
      if request.xhr?
        render :json => {}, :status => 400
      end
      return
    end
   
    if !params[:fields].nil?
      field_arr = Array.new()
      params[:fields].each do |index, value|
       field_arr = doc_arr << value
      end
      params[:fields]= field_arr
    else
      Rails.logger.error("[CNTRL][HOME][GET_ANALYTICS] [ERROR] No fields mentioned")
      if request.xhr?
        render :json => {}, :status => 400
      end
      return
    end
    Rails.logger.info("[CNTRL][HOME][GET_ANALYTICS] Calling model api params #{query}")
    response_json = current_user.get_analytics_summary(query)
    Rails.logger.info("[CNTRL][HOME][GET_ANALYTICS] model api response #{query}")
    if request.xhr?
      expires_in 10.minutes
      render :json => response_json
    end
  end 




end

