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
     if Rails.env == "production" or Rails.env == "staging"
       url = ""
       if user_signed_in?
         puts "-------------- #{request.url} --------------"

         if request.url !~ /^http:\/\//

           redirect_to :protocol => 'http://'
         end

       else
         if request.url !~ /^https:\/\// or request.subdomain.blank?
           puts "=============== #{request.url} ================"
           if request.subdomain.blank?
             url = "https://www.#{request.host+request.fullpath}"
             redirect_to url
           elsif request.subdomain == "www"
             url = "https://#{request.host+request.fullpath}"
             redirect_to url
           end
         end
       end
     end
  end
end
