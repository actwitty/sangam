class FeedbackController < ApplicationController


  def create
    Rails.logger.info("[CNTRL] [FEEDBACK] Create request")
    unless params[:feedback].nil?
      Feedback.feedback_add(params[:feedback][:name],
                          params[:feedback][:email],
                          params[:feedback][:feedback_text])
    end
    respond_to do |format|
       format.js 
    end
  end

  def show
    Rails.logger.info("[CNTRL] [FEEDBACK] Show feedback Params: [#{params}]")
    if user_signed_in? and current_user.email != AppConstants.authorized_see_internals_email_id
      Rails.logger.info("[CNTRL] [FEEDBACK] Warning some one trying to breach #{ current_user.email}")
      redirect_to :controller => "welcome", :action => "new"
    end
    unless user_signed_in?
      Rails.logger.info("[CNTRL] [FEEDBACK] Blocking non loggedin access to admin page")
      redirect_to :controller => "welcome", :action => "new"
    end
    @page_mode="aw_internal_feedback_show_page"
    @user = current_user
    @feedbacks = Feedback.find(:all, :order => 'created_at DESC').paginate(:page => params[:page], :per_page => 10)
  end
end
