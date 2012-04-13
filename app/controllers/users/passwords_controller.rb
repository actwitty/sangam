class Users::PasswordsController < Devise::PasswordsController

  # GET /resource/password/new
  def new
    Rails.logger.info("[CNTRL] [PASSWORD] Password new request")
    @page_mode = "landing_page"
    build_resource({})
    render_with_scope :new
  end

  # POST /resource/password
  def create
    Rails.logger.info("[CNTRL] [PASSWORD] Password create request")
    self.resource = resource_class.send_reset_password_instructions(params[resource_name])

    if resource.errors.empty?
      Rails.logger.info("[CNTRL] [PASSWORD] Sign in redirect")
      redirect_to after_sign_in_path_for(resource)
    else
      #render_with_scope :new
      #render_with_scope :update
      redirect_to(home_show_url)
      
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    Rails.logger.info("[CNTRL] [PASSWORD] Password edit request")
    self.resource = resource_class.new
    resource.reset_password_token = params[:reset_password_token]
    render_with_scope :edit
  end

  # PUT /resource/password
  def update
    Rails.logger.info("[CNTRL] [PASSWORD] Password update request")
    self.resource = resource_class.reset_password_by_token(params[resource_name])

    if resource.errors.empty?
      set_flash_message :notice, :updated
      Rails.logger.info("[CNTRL] [PASSWORD] Sign in redirect")
      sign_in_and_redirect(resource_name, resource)
    else
       render_with_scope :edit
    end
  end
end

