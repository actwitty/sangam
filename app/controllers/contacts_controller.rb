class ContactsController < ApplicationController
  before_filter :authenticate_user!

  def search
    people = User.search(params[:search])
    if request.xhr?
      render :json => people
    end
  end

  def followers
    friends = current_user.get_followers()
    if request.xhr?
      render :json => friends
    end
  end

  def followings
    friends = current_user.get_followings()
    if request.xhr?
      render :json => friends
    end
  end

  def provider_follow
    provider=params[:provider]
    uid=params[:uid]
    auth =Authentication.find_by_provider_and_uid(provider, uid)
    current_user.follow(auth.user_id)
    if request.xhr?
       render :json => {}
    else
      redirect_to(:back)
    end
  end

  def follow
    friend_id = params[:friend_id]
    status = current_user.follow(friend_id)
    if request.xhr?
      if (status)
        resp =  {:change_action => "Un-Follow"}
        puts resp.to_json()
        render :json =>  resp
      else
        resp = { :change_action => "Follow"}
        puts resp.to_json()
        render :json =>  resp
      end
    else
      redirect_to(:back)
    end
  end

  def unfollow

    friend_id = params[:friend_id]

    status = current_user.unfollow(friend_id)
    if request.xhr?
      if (status)
        resp =  {:change_action => "Follow"}
        puts resp.to_json()
        render :json =>  resp
      else
        resp = { :change_action => "Un-Follow"}
        puts resp.to_json()
        render :json =>  resp
      end
    else
      redirect_to(:back)
    end
  end


  def friendship()
     friend_id = Integer(params[:id])

  end

  def add( )
    friend_id = Integer(params[:friend_id])
    current_user.new_contact_request(friend_id)
    if request.xhr?
       render :json => {}
    else
      redirect_to(:back)
    end
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
    if request.xhr?
       render :json => {}
    else
      redirect_to(:back)
    end

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
    if request.xhr?
      render :json => {:request => "complete"}
    else
      redirect_to(:back)
    end

  end



  def facebook_friends

  end


  def pending_friend_requests
    pending_friends = current_user.get_pending_request_contacts()
    puts  pending_friends.to_json
    if request.xhr?
      render :json => pending_friends
    end
  end

  def friends
    friends = current_user.get_contacts()
    if request.xhr?
      render :json => friends
    end
  end




  def actwitty_friends

  end
end
