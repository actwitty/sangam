class FacebookController < ApplicationController

  def facebook_friends_list
    provider="facebook"
    facebook_auth=Authentication.find_by_user_id_and_provider(current_user.id, provider)
    if facebook_auth.nil?
      session[:return_to] ||= request.referer
      if request.xhr?
         resp = {:location => '/users/auth/facebook',
                  :message => 'Log in to facebook'}
         render :json => resp
       else

         redirect_to "users/auth/facebook"
       end
    else

      uid_list = Array.new
      display_hash = Hash.new
      begin
        graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
        friends = graph.get_connections("me", "friends")

          #  puts current_user.get_contacts_provider_uid(provider)

        friends.each {
                  |friend|
                  uid_list.push friend["id"]
                  display_hash[friend["id"]]= {"uid" => friend["id"],
                                      "name"=>friend["name"],
                                      "image" => "http://graph.facebook.com/#{friend["id"]}/picture/",
                                      "status"=>"invite" }

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


      if request.xhr?
            render :json=> display_hash.values, :status => 200
      end
      rescue Koala::Facebook::APIError

        session[:return_to] ||= request.referer
        if request.xhr?
          resp = {:location => '/users/auth/facebook',
                  :message => 'Log in to facebook'}
          puts resp.to_json
           render :json => resp
        else

          redirect_to "/users/auth/facebook"
        end
      end
    end
  end


  def invite()
    provider=params[:provider]
    uid=params[:uid]
    if provider=="facebook"
      facebook_auth=Authentication.find_by_user_id_and_provider(current_user.id, provider)
      if facebook_auth.nil?
       session[:return_to] ||= request.referer
        if request.xhr?
          resp = {:location => '/users/auth/facebook',
                  :message => 'Log in to facebook'}
          render :json => resp
        else

         redirect_to "users/auth/facebook"
        end
      else
        begin
          @graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
          @graph.put_wall_post("Come on, join in to actwitty at www.actwitty.com",
          {:name => "Actwitty", :link => "http://localhost:3000"},uid)

          if request.xhr?
            render :json => {}
          else

            redirect_to(:back)
          end
        rescue Koala::Facebook::APIError
          session[:return_to] ||= request.referer
          if request.xhr?
            resp = {:location => '/users/auth/facebook',
                  :message => 'Log in to facebook'}
            render :json => resp
          else

            redirect_to "/users/auth/facebook"
          end
        end
      end
    end
  end

end
