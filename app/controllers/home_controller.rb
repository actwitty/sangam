class HomeController < ApplicationController
  #before_filter :login_required


   def show
    @user=nil

    #if no id mentioned or user not found try to fall back to current user
    #if user not logged in then go to sign in page
    @follow = true
    if params[:id].nil?
      if user_signed_in?
        @user=current_user
      else
        redirect_to :controller => "welcome", :action => "new"
      end
    else
      @user=User.find_by_id(params[:id])
      if @user.nil?
        if user_signed_in?
          @user=current_user
        else
          redirect_to :controller => "welcome", :action => "new"
        end
      else
        if user_signed_in?
          @follow = current_user.check_follower(@user.id)
        end
      end
    end

  end

end
