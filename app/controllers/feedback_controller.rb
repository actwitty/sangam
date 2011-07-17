class FeedbackController < ApplicationController

  def new
    @feedback = Feedback.new
    Rails.logger.info("[CNTRL] [FEEDBACK] New request")
  end

  def create
    Rails.logger.info("[CNTRL] [FEEDBACK] Create request")
    unless params[:feedback].nil?
      Feedback.feedback_add(params[:feedback][:name],
                          params[:feedback][:email],
                          params[:feedback][:feedback_text])
    end
  end
end
