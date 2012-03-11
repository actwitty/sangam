class AboutController < ApplicationController
  def show
    Rails.logger.info("[CNTRL] [ABOUT] Show request")
    @page_mode = "about_page"
  end
end
