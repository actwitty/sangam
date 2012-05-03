class InvitesController < ApplicationController

  def check_authorization_email?
    unless user_signed_in?
      Rails.logger.info("[CNTRL] [INVITES] Blocking non loggedin access to admin page")
      return false
    end
    
    admin_emails = AppConstants.authorized_see_internals_email_ids.split(',')
    unless admin_emails.include? current_user.email
      Rails.logger.info("[CNTRL] [INVITES] Warning some one trying to breach #{ current_user.email}")
      return false
    end
    return true
  end

  def create_new
    Rails.logger.info("[CNTRL] [INVITES] Create NEW: [#{params}]")
    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end

    service=params[:service]
    identifier=params[:id]
    
    accepted = false
    registered = false
    authentication = Authentication.where(:uid => identifier, :provider => service).all().first()
    unless authentication.nil?
      accepted = true
      unless authentication.user_id.nil?
        registered = true
      end
    end
    query_hash = {}
    query_hash[service] = identifier

    invite_status = Invite.check_if_invite_exists(query_hash)
    Rails.logger.info("[CNTRL] [INVITES] Invite existence #{invite_status}")
    unless invite_status
      Rails.logger.info("[CNTRL] [INVITES] Invite create new model request")
      Invite.create_new_invite(service, identifier, accepted, registered)
      if request.xhr?
          render :json => {:invite => 'done', :accepted => accepted, :registered => registered }, :status => 200
      end
    else
      Rails.logger.info("[CNTRL] [INVITES] Already invited")
      if request.xhr?
          render :json => {:invite => 'already', :accepted => accepted, :registered => registered }, :status => 200
      end
    end
  end

  def admin
    Rails.logger.info("[CNTRL] [INVITES] Show Inviteds: [#{params}]")

    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end

    @page_mode="aw_internal_inviteds_show_page"
    @user = current_user
    @total_invites = Invite.count()
    
  end
  
  
  def get_user_to_delete()
    Rails.logger.info("[CNTRL] [INVITES] get_user_to_delete: [#{params}]")

    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end

    
    if !params[:id].blank? 
      id = Integer(params[:id])
      user = User.find_by_id(id)
      users_json = {
                    :id => user.id,
                    :name => user.full_name,
                    :photo => user.photo_small_url
                   }
       if request.xhr?
        render :json => users_json, :status => 200
       end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end

  def delete_user()
    Rails.logger.info("[CNTRL] [INVITES] delete_user: [#{params}]")

    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end
    if !params[:id].blank? 
      id = Integer(params[:id])
      user = User.find_by_id(id)
      user.delete_user({:user_id => id})
      
       if request.xhr?
        render :json => {}, :status => 200
       end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end

  def get_user_service_to_delete()
    Rails.logger.info("[CNTRL] [INVITES] get_user_service_to_delete: [#{params}]")

    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end

    if !params[:id].blank? 
      id = Integer(params[:id])
      user = User.find_by_id(id)
      #TODO: Alok test this call
      services = current_user.get_services( { :user_id => id } )
      users_json = {
                    :id => user.id,
                    :name => user.full_name,
                    :photo => user.photo_small_url,
                    :services => services
                   }
       if request.xhr?
        render :json => users_json, :status => 200
       end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end

  end

  def delete_user_service()
    Rails.logger.info("[CNTRL] [INVITES] delete_user_service: [#{params}]")

    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end

     if !params[:id].blank? 
      id = Integer(params[:id])
      user = User.find_by_id(id)
      #TODO Alok put an appropriate call
      params = {}
      params[:user_id] = id
      params[:service] = params[:service]
      #user.WHATEVERCALLYOUWANT(params)
      
       if request.xhr?
        render :json => {}, :status => 200
       end
    else
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end



  def get_user_counts()
      
    unless check_authorization_email?
      if request.xhr?
        render :json => {}, :status => 400
      end
      return
    end
    
    users_count = User.find( :all,
                              :select => "count(distinct users.id)",
                              :joins =>  "INNER JOIN authentications au ON au.user_id=users.id INNER JOIN invites AS inv ON inv.identifier = au.uid AND au.provider = inv.service",
                              )

    uninviteds_count =  Authentication.find( :all,
                                               :select => "count(distinct u.id)",
                                               :joins =>  "LEFT OUTER JOIN invites AS inv ON inv.identifier = authentications.uid AND authentications.provider = inv.service  INNER JOIN users AS u ON u.id = authentications.user_id",
                                               :conditions => "inv.id IS NULL"
                                               ) 



    inviteds_count = Invite.count(:all,
                                  :conditions => "invites.accepted != true" )

    users_json = {
                    :users_count => users_count,
                    :uninviteds_count => uninviteds_count,
                    :inviteds_count => inviteds_count
                  }

      if request.xhr?
        #expires_in 10.minutes
        render :json => users_json, :status => 200
      end
                  
                
  end

 

  def userbase()
      unless check_authorization_email?
      
        redirect_to :controller => "welcome", :action => "new"
        return 
      end
      newer_time = params[:newer]
      older_time = params[:older]
      conditions=[]
      unless newer_time.nil?
        conditions = ["users.created_at >= ?",  newer_time] 
      end

      unless older_time.nil?
        conditions = ["users.created_at <= ?",  older_time] 
      end
      @users_list = User.find( :all,
                            :joins =>  "INNER JOIN authentications au ON au.user_id=users.id INNER JOIN invites AS inv ON inv.identifier = au.uid AND au.provider = inv.service",
                            :select => "distinct users.id, users.email, users.photo_small_url, users.full_name, users.gender, users.current_location, users.created_at, users.last_sign_in_at",
                            :order => "users.created_at DESC",
                            :limit => 100,
                            :conditions => conditions)


    @page_mode="aw_internal_show_user_counters_page"

  end

  def uninviteds
      unless check_authorization_email?
        redirect_to :controller => "welcome", :action => "new"
        return 
      end
      newer_time = params[:newer]
      older_time = params[:older]
      conditions="inv.id IS NULL"
      unless newer_time.nil?
        conditions = ["users.created_at >= ? AND invites.id IS NULL",  newer_time] 
      end

      unless older_time.nil?
        conditions = ["users.created_at <= ? AND invites.id IS NULL",  older_time] 
      end

                                     
      @users_list = User.find( :all,
                              :joins =>  "INNER JOIN authentications au ON au.user_id=users.id LEFT OUTER JOIN invites AS inv ON inv.identifier = au.uid AND au.provider = inv.service",
                            :select => "distinct users.id, au.provider, au.uid, users.photo_small_url, users.full_name, users.gender, users.current_location, users.created_at, users.last_sign_in_at",
                            :order => "users.created_at DESC",
                            :limit => 100,
                            :conditions => conditions)


    @page_mode="aw_internal_show_user_counters_page"


  end

  def pending
    


  end

  

   def backdoor_enable_service
    Rails.logger.info("[CNTRL] [BACKDOOR_ENABLE_SERVICE]  [#{params}]")
    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end
    
    service=params[:service]
    identifier=params[:id]

    query_hash = {}
    query_hash[service] = identifier
    invite_status = Invite.check_if_invite_exists(query_hash)
    Rails.logger.info("[CNTRL] [BACKDOOR_ENABLE_SERVICE] Invite existence #{invite_status}")
    unless invite_status
      Rails.logger.info("[CNTRL] [BACKDOOR_ENABLE_SERVICE] Invite create new model request")      
      if request.xhr?
          render :json => {:invite => 'not existing' }, :status => 200
      end
    else
      accepted = false
      registered = false
      user_id = nil
      authentication = Authentication.where(:uid => identifier, :provider => service).all().first()
      unless authentication.nil?
        accepted = true
        unless authentication.user_id.nil?
          registered = true
          user_id = authentication.user_id
        end
      end

      if accepted != true or registered != true 
        if request.xhr?
            render :json => {:invite => 'already', :accepted => accepted, :registered => registered }, :status => 200
        end
      else
        user = User.find_by_id(user_id)
        enable_hash = {
                        :user_id => user_id,
                        :provider => service,
                        :uid => identifier
                      }
        user.enable_service(enable_hash)
        
         if request.xhr?
            render :json => current_user.get_services(:user_id => user_id), :status => 200
        end
      end
    end

      
   end
  def force_inject_job_for_user
    Rails.logger.info("[CNTRL] [FORCE_INJECT_JOB]  [#{params}]")
    unless check_authorization_email?
      redirect_to :controller => "welcome", :action => "new"
      return 
    end
    response = false
    service=params[:service]
    identifier=params[:id]
    user_id = nil
    authentication = Authentication.where(:uid => identifier, :provider => service).all().first()
    unless authentication.user_id.nil?
      user_id = authentication.user_id
    
      inject_job_hash = {
                        :user_id => user_id,
                        :provider => service,
                        :uid => identifier
                      }
      response = current_user.inject_job(inject_job_hash)
    end
        
    if request.xhr?
        render :json => { :status => response}, :status => 200
    end

  end

  def uninvited
  end

end
