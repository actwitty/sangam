class WelcomeController < ApplicationController
  #caches_page :new
  def new
    puts "************************************************ HERE I AM **************************************"
    Rails.logger.info("[CNTRL] [WELCOME] [NEW] New page requested")

    if user_signed_in?
      puts "************************************************ HERE I AM 1 **************************************"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] User signed in")
      redirect_to :controller => "home", :action => "show"
      #redirect_to :controller => "home", :action => "alpha"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] Redirect to home show")
    else
      puts "************************************************ HERE I AM 2 **************************************"
      @page_mode="sign-in-page"
      Rails.logger.info("[CNTRL] [WELCOME] [NEW] Main Page requested")
      #response.headers['Cache-Control'] = 'public, max-age=300'
    end
   Rails.logger.info("[CNTRL] [WELCOME] [NEW] Done")
  end


end
