class ApplicationController < ActionController::Base
  protect_from_forgery

  def redirect_to_stored
    if return_to = session[:return_to]
      session[:return_to]=nil
      redirect_to_url(return_to)
    else
      redirect_to :controller=>'welcome', :action=>'new'
    end
  end
end
