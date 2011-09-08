class FacebookController < ApplicationController

  def facebook_friends_list
    provider="facebook"
    facebook_auth=Authentication.find_by_user_id_and_provider(current_user.id, provider)
    if facebook_auth.nil?
      puts "------------------------------facebook_auth nil----------------------------"
      session[:return_to] ||= request.referer
      if request.xhr?
         puts "------------------------------if----------------------------"
         resp = {:location => '/users/auth/facebook',
                  :message => 'Log in to facebook'}
         render :json => resp
       else
         puts "------------------------------else----------------------------"
         redirect_to "users/auth/facebook"
       end
    else

      uid_list = Array.new
      display_hash = Hash.new
      begin
        graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
        friends = graph.get_connections("me", "friends")



        friends.each {
                  |friend|
                  uid_list.push friend["id"]
                  display_hash[friend["id"]]= {"uid" => friend["id"],
                                      "name"=>friend["name"],
                                      "image" => "http://graph.facebook.com/#{friend["id"]}/picture/",
                                      "status"=>"invite" }

        }
        puts "--FB Friends --------------"
        puts friends
        puts "---------------------------"

        uid_based_list = current_user.get_uid_follow_status(provider, uid_list)


        uid_based_list.each_key do |key|

            display_hash[key]["user_id"] = uid_based_list[key][:user_id]
            if ( uid_based_list[key][:following] == 1)
               display_hash[key]["status"] = "Un-Follow"
            else
              display_hash[key]["status"] = "Follow"
            end

        end

        puts display_hash


      if request.xhr?
        expires_in 5.minutes
        render :json=> display_hash.values, :status => 200
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
          {:name => "Actwitty", :link => "http://www.actwitty.com"},uid)

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
