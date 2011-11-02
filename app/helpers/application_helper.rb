module ApplicationHelper
  #FOR PUBLIC SHOW
  def if_ghost_user?
    return false if current_user.blank?
    current_user.email == AppConstants.ghost_user_email
  end
  #END PUBLIC SHOW
end
