
  before_filter :authenticate_user!


  def show
    if user_signed_in?
      other_user_id = Integer(params[:id])
      if other_user_id ==  current_user.id
        #take me to the home
        redirect_to :controller => "home", :action => "show"
      else
        @user=User.find_by_id(other_user_id)
        if @user.nil?
         redirect_to_stored
        else
          @friend_status="unknown"
          contact=Contact.find_by_friend_id_and_user_id(other_user_id,current_user.id)
          if contact.nil?
            @friend_status="unknown"
          elsif contact.status == Contact.statusStringToKey['New']
            @friend_status="pending"
          elsif contact.status == Contact.statusStringToKey['Connected']
            @friend_status="friend"
          end
        end
      end
    end
  end

end
