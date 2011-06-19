class Users::ConfirmationsController < Devise::ConfirmationsController

  def new
    build_resource({})
    render_with_scope :new
  end

   def create
    self.resource = resource_class.send_confirmation_instructions(params[resource_name])

    if resource.errors.empty?
      set_flash_message :notice, :send_instructions
      redirect_to after_sign_in_path_for(resource)
    else
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
      @profile.save!
      sign_in_and_redirect(resource_name, resource)
    else
      puts  resource.errors
      render_with_scope :show
    end

 end

  def already_confirmed

  end

  def show

    @user = User.find_by_confirmation_token(params[:confirmation_token])
    if !@user.nil?
      @profile = Profile.find_by_user_id(@user.id)
      if @profile.nil?
         @profile = Profile.new
      end
    else
      render_with_scope :already_confirmed
    end
  end


end
