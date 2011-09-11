class ApplicationController < ActionController::Base

  protect_from_forgery

  before_filter :set_locale

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

end
