class BlogController < ApplicationController
  def show
    Rails.logger.info("[CNTRL] [BLOG] Show request")
    @page_mode = "blog_page"
  end
end
