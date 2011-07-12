class FeedbackController < ApplicationController

  def new
    @feedback = Feedback.new
  end

  def create

    unless params[:feedback].nil?
      Feedback.feedback_add(params[:feedback][:name],
                          params[:feedback][:email],
                          params[:feedback][:feedback_text])
    end
  end
end
