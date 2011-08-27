class WelcomeController < ApplicationController
  caches_page :new
  def new
    if user_signed_in?
      redirect_to :controller => "home", :action => "show"
      #redirect_to :controller => "home", :action => "alpha"
    else
      @page_mode="sign-in-page"
      response.headers['Cache-Control'] = 'public, max-age=300'
    end
  end


end
