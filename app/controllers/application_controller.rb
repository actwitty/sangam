class ApplicationController < ActionController::Base

  protect_from_forgery

  before_filter :set_locale, :ensure_domain

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def redirect_to_stored
    if return_to = session[:return_to]
      session[:return_to]=nil
      redirect_to_url(return_to)
    else
      redirect_to :controller=>'welcome', :action=>'new'
    end
  end

  #Alok Adding pusher support
  def pusher_event_push
    if (!response.body.blank?) &&  (response.status == 200)
       current_user.push_event_to_pusher({:channel => "#{current_user.id}", :event => params[:action], :data => response.body})
    end
  end

  APP_DOMAIN = 'actwitty.com'
  def ensure_domain
#    if user_signed_in?
#      full_name = current_user.full_name.split
#      if request.env['HTTP_HOST'] != "#{full_name[0]}.#{APP_DOMAIN}"
#        # HTTP 301 is a "permanent" redirect
#        redirect_to "http://#{full_name[0]}.#{APP_DOMAIN}", :status => 301
#      end
#    else
      url = ""
      if Rails.env == "production"
        if request.url !~ /^https:\/\// or request.subdomain.blank?
          if request.subdomain.blank?
            url = "https://www.#{request.host+request.fullpath}"
          else
            url = "https://#{request.host+request.fullpath}"
          end
          redirect_to url
        end
      end

  #  end
  end
end
