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
end
