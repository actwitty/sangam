class ChannelSettingsController < ApplicationController
  
  
  
  
  def update_channels
    Rails.logger.info("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS]  channel_settings/update_channel Page")
    
    Rails.logger.info("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS] Theme:#{params[:summary_id]}")
    
    Rails.logger.info("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS] Theme:#{params[:theme_id]}")
  
    Rails.logger.info("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS] Channel Name:#{params[:channel_name]}")

    Rails.logger.info("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS] Channel Category:#{params[:channel_category]}")
    if user_signed_in? 
      @user = current_user
      params[:summary_id] = Integer(params[:summary_id])

      summary_category_update = {:summary_id => params[:summary_id],
                                 :category_id=>params[:channel_category]}
      @user.update_summary_category(summary_category_update)
      

      summary_theme_update ={:fg_color => params[:theme_id],
                             :bg_color=>"0x000000f0",
                             :author_id=>current_user.id,
                             :summary_id=>params[:summary_id],
                             :theme_type=>2}
      @user.create_theme(summary_theme_update)

      
      
      summary_name_update = {:summary_id =>params[:summary_id],
                             :new_name=>params[:channel_name]}
      response_json = @user.update_summary(summary_name_update)


      if request.xhr?
        Rails.logger.debug("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS] sending response JSON #{response_json}")
        render :json => response_json, :status => 200
      end

    else
      Rails.logger.error("[CNTRL][CHANNEL_SETTINGS][UPDATE_CHANNELS] Update summary failed as user is not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
    
  end

  ############################################
  def edit
 
 
	  Rails.logger.info("[CNTRL][CHANNEL_SETTINGS][EDIT]  channel_settings/setting Page")
    @profile_page = 1
    @page_mode="profile_channel_settings_page"
    @user=current_user
	  if user_signed_in?
      if params[:page_type].blank?
        params[:page_type] = 1
      else
        params[:page_type] = Integer(params[:page_type])
      end
       #params[:user_id]=Integer(params[:user_id])
       params[:user_id]=current_user.id
       Rails.logger.debug("[CNTRL][CHANNEL_SETTINGS][EDIT] Calling model api #{params}")
       response_json=current_user.get_summary(params)
       Rails.logger.debug("[CNTRL][CHANNEL_SETTINGS][EDIT] returned from model api")
      if request.xhr?
        Rails.logger.debug("[CNTRL][CHANNEL_SETTINGS][EDIT] sending response JSON #{response_json}")
        expires_in 10.minutes
        render :json => response_json, :status => 200
      end
    else
      Rails.logger.error("[CNTRL][CHANNEL_SETTINGS][EDIT] Get summary failed as user is not signed in")
      if request.xhr?
        render :json => {}, :status => 400
      end
    end
  end

  ############################################

end
