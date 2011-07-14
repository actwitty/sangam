class AboutController < ApplicationController
  def show
    Rails.logger.info("[CNTRL] [ABOUT] Show request")
  end
end
