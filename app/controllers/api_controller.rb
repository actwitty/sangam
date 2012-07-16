class ApiController < ApplicationController
  def show
    Rails.logger.info("[CNTRL] [API] Show request")
    @page_mode = "api_page"
  end
end
