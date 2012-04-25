require 'api/api'
class HomeController < ApplicationController
  #before_filter :only_when_user_is_logged_in, :only => :show

  #Alok Adding pusher support
  protect_from_forgery :except => :pusher_auth # stop rails CSRF protection for this action

   #Alok Adding pusher support
   #Commenting for time being
#  after_filter  :pusher_event_push, :only => [:create_activity]


  
#  #FOR  PUBLIC SHOW OF POST/ACCOUNT
  include ApplicationHelper
  GET_FUNCTIONS_ARRAY= [ :show,
                         :get_entities,
                         :get_entities_verified,
                         :get_summary,
                         :get_streams,
                         :get_services_enabled,
                         :get_analytics_timeline,
                         :get_sketch_data_status,
                         :thanks,
                         :waiting,
                         :search_user,
                         :create_crawled_user]

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
  ###################################################################################
  #TODO NEED FIX.. TEMPORARY 
  def redirect_back_to
     if !session[:return_to].blank?
       redirect_to session[:return_to]
       session[:return_to] = nil
     end
  end
  ###################################################################################
  def  authenticate_user
    if user_signed_in?
      #This block should not hit ideally
      if if_ghost_user?
        Rails.logger.info("[MODEL] [CNTRL] [AUTHENTICATE_USER] ***** ghost user active .. CHECK HOW?????? ****** ")
        sign_out(current_user)
        store_and_redirect_location
        return false
      end  
    else
      Rails.logger.info("[MODEL] [CNTRL] [AUTHENTICATE_USER]")
      store_and_redirect_location
      return false
    end
  end
  ###################################################################################
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
    @page_mode="profile_show_page"
    Rails.logger.info("[CNTRL] [HOME] [SHOW] Home Sketch request with #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User not signed in")
    end


    if params[:id].nil?
      if user_signed_in? and  current_user.email != AppConstants.ghost_user_email
        @user=current_user 
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as no id mentioned")
      else
        Rails.logger.warn("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
        return
      end
    else
      user_id =  params[:id]
      @user=User.find_by_id(user_id)
      if @user.nil?
        if user_signed_in? and  current_user.email != AppConstants.ghost_user_email
          @user=current_user
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as incorrect id mentioned")
        else
          Rails.logger.warn("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as incorrect id mentioned")
          redirect_to :controller => "welcome", :action => "new"
          return
        end
      elsif @user.email == AppConstants.ghost_user_email
          Rails.logger.warn("[CNTRL] [HOME] [SHOW] Someone trying to open admin login page")
          redirect_to :controller => "welcome", :action => "new"
          return
      end
    end
   @fb_access = {}
   @tw_access = {}


   if user_signed_in? and  current_user.email != AppConstants.ghost_user_email

      authentications = Authentication.find_all_by_user_id(current_user.id)
      Rails.logger.info("[CNTRL] [HOME] [SHOW] Authentications #{authentications.inspect}")
      authentications.each do |authentication|
        if authentication.provider == "facebook"
            @fb_access[:token] = authentication.token                         
        elsif authentication.provider == "twitter"
            @tw_access[:token] =  authentication.token
            @tw_access[:secret] =  authentication.secret
            @tw_access[:uid] = authentication.uid
            @tw_access[:consumer_key] =  AppConstants.twitter_consumer_key
            @tw_access[:consumer_secret] = AppConstants.twitter_consumer_secret
            @tw_access[:twpic_app_id] = AppConstants.twitpic_reg_key
            
        end
       end
    end

   # Check if uninvited user
   invite_status = current_user.get_invited_status
   query={}
   query[:user_id] = @user.id  
   process_status = current_user.get_status(query)
    

  # Check if waiting user
  if user_signed_in? 
    if current_user.id != @user.id
      if process_status == 1
        redirect_to "/waiting?id=#{@user.id}"
        return
      end
    else
      unless invite_status 
        redirect_to "/thanks"
        return
      end
    end
  else
    if process_status == 1
      redirect_to "/waiting?id=#{@user.id}"
      return
    end

    unless invite_status 
      redirect_to "/waiting?id=#{@user.id}"
      return
    end
  end



    @services_enabled = current_user.get_services( { :user_id => @user.id } )
    @service_uids = @user.get_service_user_ids()

  end
  
  ############################################
  def thanks
    @user=nil
    @page_mode="profile_thanks_page"

    if params[:id].nil?
      if user_signed_in?
        @user=current_user
        Rails.logger.info("[CNTRL] [HOME] [THANKS] Setting user id to current user as no id mentioned")
      else
        Rails.logger.info("[CNTRL] [HOME] [THANKS] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
      end
    else
      user_id =  params[:id]
      @user=User.find_by_id(user_id)
      if @user.nil?
        if user_signed_in? and  current_user.email != AppConstants.ghost_user_email
          @user=current_user
          Rails.logger.info("[CNTRL] [HOME] [THANKS] Setting user id to current user as incorrect id mentioned")
        else
          Rails.logger.warn("[CNTRL] [HOME] [THANKS] Redirecting to welcome new as incorrect id mentioned")
          redirect_to :controller => "welcome", :action => "new"
        end
      end
    end


  end

  ############################################
  def waiting
    @user=nil
    @page_mode="profile_thanks_page"

    if params[:id].nil?
      if user_signed_in?
        @user=current_user
        Rails.logger.info("[CNTRL] [HOME] [WAITING] Setting user id to current user as no id mentioned")
        redirect_to "/show"
        return
      else
        Rails.logger.info("[CNTRL] [HOME] [WAITING] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
        return
      end
    else
      user_id =  params[:id]
      @user=User.find_by_id(user_id)
      if @user.nil?
         Rails.logger.info("[CNTRL] [HOME] [WAITING] Mentioned user does not exist")
        redirect_to "/show"
        return
      end

      query={}
      query[:user_id] = @user.id  
      process_status = current_user.get_status(query)
      unless process_status == 1
        redirect_to "/show?id=#{@user.id}"
      return


    end
    end
  end


 
 
  ############################################
  def get_streams
    Rails.logger.info("[CNTRL][HOME][GET STREAMS] user get streams requested with params #{params}")
    if user_signed_in?

      if !params[:user_id].blank? && Integer(params[:user_id]) == current_user.id
        params[:user_id]=Integer(params[:user_id])
        Rails.logger.error("[CNTRL][HOME][GET FRIENDS SUMMARY] Bad request cannot get friends of current users")
      else
        params[:user_id]=Integer(params[:user_id])
        Rails.logger.error("[CNTRL][HOME][GET FRIENDS SUMMARY] Bad request cannot get friends of other users")
      end

      if !params[:filter].nil? and !params[:filter][:document].nil? and !params[:filter][:document][:all].nil?
        if params[:filter][:document][:all] == "true"
          params[:filter][:document][:all] = true        
        end
      end      


     if !params[:filter].nil? and !params[:filter][:location].nil? and !params[:filter][:location][:all].nil?
        if params[:filter][:location][:all] == "true"
          params[:filter][:location][:all] = true
        end
      end      

      if !params[:filter].nil? and !params[:filter][:entity].nil? and !params[:filter][:entity][:all].nil?
        if params[:filter][:entity][:all] == "true"
          params[:filter][:entity][:all] = true
        end
      end      

      if !params[:filter].nil? and !params[:filter][:source_action].nil? and !params[:filter][:source_action][:all].nil?
        if params[:filter][:source_action][:all] == "true"
          params[:filter][:source_action][:all] = true
        end
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
        expires_in 10.minutes
        Rails.logger.warn("[CNTRL] [HOME] [STREAMS][REJECTED] Params:#{params}")
        render :json => {}, :status => 400
      end
    end
  end
  ############################################

   def get_summary
    Rails.logger.info("[CNTRL][HOME][GET SUMMARY] user get summary requested with params #{params}")
    if user_signed_in?
       
       params[:user_id]=Integer(params[:user_id])
       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] Calling model api #{params} #{current_user}")
       response_json=current_user.get_summary({:user_id => params[:user_id]})
       #response_json=current_user.post_new_activity_to_facebook({:user_id => params[:user_id]}, "fdfd")

       Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] returned from model api")
      if request.xhr?
        Rails.logger.debug("[CNTRL][HOME][GET SUMMARY] sending response JSON #{response_json}")
        expires_in 10.minutes
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.error("[CNTRL][HOME][GET SUMMARY] Get summary failed as user is not signed in")
      if request.xhr?
        expires_in 10.minutes
        Rails.logger.warn("[CNTRL] [HOME] [SUMMARY][REJECTED] Params:#{params}")
        render :json => {}, :status => 400
      end
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
  def search_user
    Rails.logger.info("[CNTRL][HOME][SEARCH USER] search params : #{params}")
    query = {}
    query[:name] = params[:q]

    response_json = current_user.search_user(query)
    Rails.logger.info("[CNTRL][HOME][SEARCH USER] search response : #{response_json}")
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
              Rails.logger.warn("[CNTRL][HOME][SETTINGS] Could not create profile")
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
  ##################################################################
  def get_entities
    Rails.logger.info("[CNTRL] [HOME] [GET_ENTITIES] Params:#{params}")
    if params[:user_id].nil?
       
      query={}
      query[:user_id] = Integer(params[:user_id])
      Rails.logger.info("[CNTRL][HOME][GET_ENTITIES] Calling model api params #{query}")
      response_json = current_user.get_entities(query)
      Rails.logger.info("[CNTRL][HOME][GET_ENTITIES] model api response #{response_json}")
      if request.xhr?
        expires_in 10.minutes
        render :json => response_json
        return
      end
    else
        expires_in 10.minutes
        Rails.logger.warn("[CNTRL] [HOME] [GET_ENTITIES][REJECTED] Params:#{params}")
        render :json => {}, :status => 400
    end
  end
  ###################################################################
  def get_entities_verified
    Rails.logger.info("[CNTRL] [HOME] [GET_ENTITIES_VERIFIED] Params:#{params}")
    unless params[:entity_ids].nil?
      entity_id_list_str = params[:entity_ids].split(',')
      entity_list = []

      entity_id_list_str.each do |entity_id_str|
        entity_list.push(Integer(entity_id_str)) 
      end

      unless params[:user_id].nil?
        query = {}
        query[:entity_ids] = entity_list
        query[:user_id] = params[:user_id]
        Rails.logger.info("[CNTRL][HOME][GET_ENTITIES_VERIFIED] Calling model api params #{query}")
        response_json = current_user.get_entities_verified(query)
        Rails.logger.info("[CNTRL][HOME][GET_ENTITIES_VERIFIED] model api response #{response_json}")

        if request.xhr?
          expires_in 10.minutes
          render :json => response_json
          return
        end
      end
    end

    if request.xhr?
      expires_in 10.minutes
      Rails.logger.warn("[CNTRL] [HOME] [GET_ENTITIES_VERIFIED][REJECTED] Params:#{params}")
      render :json => {}, :status => 400
    end
    
  end
  ###################################################################  
  def get_analytics_timeline
    Rails.logger.info("[CNTRL] [HOME] [GET_ANALYTICS_TIMELINE] Params:#{params}")
    unless  params[:user_id].nil?
      query= {}
      query[:user_id] = params[:user_id]
      query[:num_of_week] = 5
      query[:summary_snapshot] = true
      #query[:enabled_services] Left un-assigned
      
      
      Rails.logger.info("[CNTRL] [HOME] [GET_ANALYTICS_TIMELINE] Calling Model:#{query}")
      response_json = current_user.get_analytics(query)
       Rails.logger.debug("[CNTRL] [HOME] [GET_ANALYTICS_TIMELINE] Model Response:#{response_json}")
      if request.xhr?
        expires_in 10.minutes
        Rails.logger.debug("[CNTRL] [HOME] [GET_ANALYTICS_TIMELINE] Params:#{params}")
        render :json => response_json
        return
      end
    else
      if request.xhr?
        expires_in 10.minutes
        Rails.logger.info("[CNTRL] [HOME] [GET_ANALYTICS_TIMELINE][REJECTED] Params:#{params}")
        render :json => {}, :status => 400
      end
    end
  end
  ####################################################################
  def get_sketch_data_status
    Rails.logger.info("[CNTRL] [HOME] [GET_SKETCH_DATA_STATUS] Params:#{params}")
    unless  params[:user_id].nil?
      query = {}
      query[:user_id] = Integer(params[:user_id])
      Rails.logger.warn("[CNTRL] [HOME] [GET_SKETCH_DATA_STATUS] model call :#{query}")
      response = current_user.get_status(query)
      Rails.logger.warn("[CNTRL] [HOME] [GET_SKETCH_DATA_STATUS] model response :#{response}")
      if request.xhr?
        
        render :json => {:status => response}

      end
    else
      if request.xhr?
        Rails.logger.info("[CNTRL] [HOME] [GET_SKETCH_DATA_STATUS] Params:#{params}")
        render :json => {:status => 1}, :status => 400
      end
    end
  end

  ###################################################################
  def create_crawled_user
    Rails.logger.info("[CNTRL] [HOME] [CREATE_CRAWLED_USER] Params:#{params}")

    response_json = current_user.create_crawled_user(params)

    Rails.logger.debug("[CNTRL] [HOME] [CREATE_CRAWLED_USER] Model Response:#{response_json}")
    if request.post?
      Rails.logger.info("[CNTRL] [HOME] [CREATE_CRAWLED_USER] Params:#{params}")
      render :json => {:response => true}, :status => 200

    else
      Rails.logger.info("[CNTRL] [HOME] [CREATE_CRAWLED_USER] [REJECTED] Params:#{params}")
      render :json => {}, :status => 400
    end
  end
end

