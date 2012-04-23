class ActgreenController < ApplicationController
  
  
  def show
    Rails.logger.info("[CNTRL] [ACTGREEN] Show request")
    @page_mode = "actgreen_page"
    #@actgreen_data = Actgreen.all
    @actgreen = Actgreen.new
    @actgreen_list = Actgreen.all
  end

  
  def new
    Rails.logger.info("[CNTRL] [ACTGREEN] Save request")
    Rails.logger.info("[CNTRL] [ACTGREEN] params coming in :  #{params[:actgreen]} ")
    @page_mode = "actgreen_page"
    #@actgreen = Actgreen.new(params[:actgreen])
    @actgreen = Actgreen.new(params[:actgreen])
    @data_saved = true
      if @actgreen.save
        Rails.logger.info("[CNTRL] [ACTGREEN] [NEW] Data Saved properly ")
        @data_saved = true  
      else
        Rails.logger.info("[CNTRL] [ACTGREEN] [NEW] Data CANNOT-BE Saved properly ")
        @data_saved = false
      end

    respond_to do |format|
          format.js
        end 

  end

end
