class HomeController < ApplicationController
  #before_filter :login_required


   def show
    @user=current_user
    @friends = current_user.get_contacts()
    @pending_friends = current_user.get_pending_request_contacts()
  end

end
