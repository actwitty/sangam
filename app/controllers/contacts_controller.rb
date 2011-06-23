class ContactsController < ApplicationController
  before_filter :authenticate_user!

  def search
    @users = User.search(params[:search])
  end

  def friendship()
     friend_id = Integer(params[:id])

  end

  def add( )
    friend_id = Integer(params[:friend_id])
    current_user.new_contact_request(friend_id)
    redirect_to(:back)
  end

  def provider_add()
    provider=params[:provider]
    uid=params[:uid]
    auth =Authentication.find_by_provider_and_uid(provider, uid)
    current_user.new_contact_request(auth.user_id)

  end



  def remove()
    friend_id = Integer(params[:friend_id])

    current_user.disconnect_a_contact(friend_id)
    redirect_to(:back)

  end

  def accept()

    friend_id = Integer(params[:friend_id])
    friend_req = params[:friend_req]

    if (friend_req == "Accept")
      current_user.accept_a_contact_request(friend_id)
    else
      #We ideally expect here if (friend_req == "Reject")
      current_user.reject_a_contact_request(friend_id)
    end

    #go back to where you came from
    redirect_to(:back)
  end



  def facebook_friends


  end




  def actwitty_friends

  end
end
