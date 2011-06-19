class WelcomeController < ApplicationController
  def new
    if user_signed_in?
      puts "USER IS SIGNED IN ------------------------->"
      redirect_to :controller => "home", :action => "show"
    end
  end
end
