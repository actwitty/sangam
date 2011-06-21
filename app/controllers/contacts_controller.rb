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
    redirect_to(:back)
  end

  def invite()
    provider=params[:provider]
    uid=params[:uid]
    if provider=="facebook"
      facebook_auth=Authentication.find_by_user_id_and_provider(current_user.id, provider)
      if facebook_auth.nil?
        puts "Enable Facebook log in page"
        #TODO: Fix this path
      else
        begin
          @graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
          @graph.put_wall_post("Come on, join in to actwitty at www.actwitty.com",
          {:name => "Actwitty", :link => "http://localhost:3000"},uid)
        rescue Koala::Facebook::APIError
          session[:return_to] ||= request.referer
          redirect_to "/users/auth/facebook"
        end
      end
    end
    redirect_to(:back)
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

  def facebook_friends_list
    provider="facebook"
    facebook_auth=Authentication.find_by_user_id_and_provider(current_user.id, provider)
    if facebook_auth.nil?
      puts "Enable Facebook log in page"
      #TODO: Fix this path
    else
      uid_list = Array.new
      display_hash = Hash.new
      begin
        graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
        friends = graph.get_connections("me", "friends")
        puts friends
        #  puts current_user.get_contacts_provider_uid(provider)

        friends.each {
                  |friend|
                  uid_list.push friend["id"]
                  display_hash[friend["id"]]= {"name"=>friend["name"], "status"=>"invite"}

        }


        if uid_list.count() > 0
          uid_list_in_actwitty=Authentication.find_all_uids_present_in_actwitty(provider, uid_list)
          if !uid_list_in_actwitty.nil? && uid_list_in_actwitty.count >0
            uid_list_and_friend = current_user.get_provider_uids_of_friends(provider, uid_list)
            uid_list_not_friend =  uid_list_in_actwitty - uid_list_and_friend

            uid_list_and_friend.each { |uid| display_hash[uid][:status]="friend"  }
            uid_list_not_friend.each { |uid| display_hash[uid][:status]="request"  }
          end
        end
        puts display_hash.to_json
        format.js { render :json => display_hash }
      rescue Koala::Facebook::APIError
        session[:return_to] ||= request.referer
        redirect_to "/users/auth/facebook"
      end
    end
  end


  def facebook_friends
    puts "Looking for facebook friends"

  end


  def twitter_friends

  end

  def actwitty_friends

  end
end
