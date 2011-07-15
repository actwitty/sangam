class HomeController < ApplicationController
  #before_filter :only_when_user_is_logged_in, :only => :show


   def show

    @user=nil
    @profile_page =1

    Rails.logger.info("[CNTRL] [HOME] [SHOW] Home Show request with #{params}")
    if user_signed_in?
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User signed in #{current_user.id} #{current_user.full_name}")
    else
      Rails.logger.info("[CNTRL] [HOME] [SHOW] User not signed in")
    end


    if params[:mode] == 'filtered'
      Rails.logger.info("[CNTRL] [HOME] [SHOW] Stream page requested with filtered mode")
      @defaul_page_mode = 'filtered'
      params.except(:mode)
    end
    #if no id mentioned or user not found try to fall back to current user
    #if user not logged in then go to sign in page
    @follow = true
    if params[:id].nil?
      if user_signed_in?
        @user=current_user
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as no id mentioned")
      else
        Rails.logger.info("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as no id mentioned")
        redirect_to :controller => "welcome", :action => "new"
      end
    else
      @user=User.find_by_id(params[:id])
      if @user.nil?
        if user_signed_in?
          @user=current_user
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Setting user id to current user as incorrect id mentioned")
        else
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Redirecting to welcome new as incorrect id mentioned")
          redirect_to :controller => "welcome", :action => "new"
        end
      else
        if user_signed_in?  && @user.id != current_user.id
          Rails.logger.info("[CNTRL] [HOME] [SHOW] Checking the follow/unfollow status")
          @follow = current_user.check_follower(@user.id)
        end
      end
    end

  end

  def settings
	  Rails.logger.info("[CNTRL][HOME][SETTINGS]  home/setting Page")
	  @user = User.find_by_confirmation_token(params[:confirmation_token])
	  Rails.logger.info("[CNTRL][HOME][SETTINGS] Settings Page User id: #{@user.id}")
	  if !@user.nil?
	      @profile = Profile.find_by_user_id(@user.id)
	      Rails.logger.info("[CNTRL][HOME][SETTINGS] If User is Not Nil, then profile: #{@profile.user_id}")
	      puts @profile.user_id
	      puts @profile.id
	  end
  end

  def settings_save
	  Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Entry to Settings Update Page")
	  @user = User.find_by_confirmation_token(params[:confirmation_token])
	  puts @user.id
	  @profile = Profile.find_by_user_id(@user.id)
	  Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Settings Update Page Information #{params[:profile]}")
	  #Document.UploadDocument(@user.id, nil ,  [params[:profile][:profile_photo_l]])
	  if @profile.update_attributes(params[:profile])
	    Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] After Updating Settings Page")
	    redirect_to(home_show_url)
	  end
	 Rails.logger.info("[CNTRL][HOME][SETTINGS_SAVE] Exit From Settings Update Page")

  end
	

end
