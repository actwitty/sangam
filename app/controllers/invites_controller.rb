class InvitesController < ApplicationController
 
  def create_new
    Rails.logger.info("[CNTRL] [INVITES] Create NEW: [#{params}]")
    if user_signed_in? and current_user.email != AppConstants.authorized_see_internals_email_id
      Rails.logger.info("[CNTRL] [INVITES] Warning some one trying to breach #{ current_user.email}")
      redirect_to :controller => "welcome", :action => "new"
    end
    unless user_signed_in?
      Rails.logger.info("[CNTRL] [INVITES] Blocking non loggedin access to admin page")
      redirect_to :controller => "welcome", :action => "new"
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
          render :json => {}, :status => 200
      end
    else
      Rails.logger.info("[CNTRL] [INVITES] Already invited")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end

  def inviteds
    Rails.logger.info("[CNTRL] [INVITES] Show Inviteds: [#{params}]")
    if user_signed_in? and current_user.email != AppConstants.authorized_see_internals_email_id
      Rails.logger.info("[CNTRL] [INVITES] Warning some one trying to breach #{ current_user.email} <> #{AppConstants.authorized_see_internals_email_id}")
      redirect_to :controller => "welcome", :action => "new"
    end
    unless user_signed_in?
      Rails.logger.info("[CNTRL] [INVITES] Blocking non loggedin access to admin page")
      redirect_to :controller => "welcome", :action => "new"
    end
    @page_mode="aw_internal_inviteds_show_page"
    @user = current_user
    @total_invites = Invite.count()
    @invites = Invite.find(:all, :order => 'created_at DESC').paginate(:page => params[:page], :per_page => 10)
  end

  def accepted
    Rails.logger.info("[CNTRL] [INVITES] Show Accepteds: [#{params}]")
    if user_signed_in? and current_user.email != AppConstants.authorized_see_internals_email_id
      Rails.logger.info("[CNTRL] [INVITES] Warning some one trying to breach #{ current_user.email}")
      redirect_to :controller => "welcome", :action => "new"
    end
    unless user_signed_in?
      Rails.logger.info("[CNTRL] [INVITES] Blocking non loggedin access to admin page")
      redirect_to :controller => "welcome", :action => "new"
    end
    @page_mode="aw_internal_inviteds_show_page"
    @user = current_user
    @invites = Invite.find(:all, :conditions => { :accepted => true, :registered => false } , :order => 'created_at DESC').paginate(:page => params[:page], :per_page => 10)
  end

  def registered
    Rails.logger.info("[CNTRL] [INVITES] Show Registereds: [#{params}]")
    if user_signed_in? and current_user.email != AppConstants.authorized_see_internals_email_id
      Rails.logger.info("[CNTRL] [INVITES] Warning some one trying to breach #{ current_user.email}")
      redirect_to :controller => "welcome", :action => "new"
    end
    unless user_signed_in?
      Rails.logger.info("[CNTRL] [INVITES] Blocking non loggedin access to admin page")
      redirect_to :controller => "welcome", :action => "new"
    end
    @page_mode="aw_internal_inviteds_show_page"
    @user = current_user
    @invites = Invite.find(:all, :conditions => { :accepted => true, :registered => false } , :order => 'created_at DESC').paginate(:page => params[:page], :per_page => 10)
  end

  def uninvited
  end

end
