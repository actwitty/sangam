class Users::ConfirmationsController < Devise::ConfirmationsController

  def new
    Rails.logger.info("[CNTRL] [CONFIRMATION] New request")
    build_resource({})
    render_with_scope :new
  end

   def create
    Rails.logger.info("[CNTRL] [CONFIRMATION] Create request")
    self.resource = resource_class.send_confirmation_instructions(params[resource_name])

    if resource.errors.empty?
      Rails.logger.info("[CNTRL] [CONFIRMATION] Sign in and redirect")
      redirect_to after_sign_in_path_for(resource)
    else
      Rails.logger.info("[CNTRL] [CONFIRMATION] No user found for this request")
      render_with_scope :new
    end
  end

  def accept
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    if resource.errors.empty?
      set_flash_message :notice, :confirmed
      @profile = Profile.find_by_user_id(self.resource.id)
      if @profile.nil?
        @profile = Profile.new(params[:profile])
        @profile.user_id = resource.id
      end
      Rails.logger.info("[CNTRL] [CONFIRMATION] Saving profile")
      @profile.save!
      Rails.logger.info("[CNTRL] [CONFIRMATION] Sign in and redirect")
      sign_in_and_redirect(resource_name, resource)
    else
      Rails.logger.error("[CNTRL] [CONFIRMATION] No user found for this confirmation token.")
      redirect_to :controller => "welcome", :action => "new"

    end

    rescue => e
      Rails.logger.error("[CNTRL] [CONFIRMATION] Error in User => Confirmation => accept => #{e}")
      redirect_to :controller => "welcome", :action => "new"

 end

  def already_confirmed

  end

  def show
    Rails.logger.info("[CNTRL] [CONFIRMATION] Confirmation show request")
    @user = User.find_by_confirmation_token(params[:confirmation_token])
    if !@user.nil?
      @profile = Profile.find_by_user_id(@user.id)
      if @profile.nil?
        Rails.logger.info("[CNTRL] [CONFIRMATION] Rendering for profile new")
         @profile = Profile.new
      end
    else
      Rails.logger.info("[CNTRL] [CONFIRMATION] Confirmation already done")
      render_with_scope :already_confirmed
    end
  end


end
