class CustomFailure < Devise::FailureApp
   
  def redirect_url
    puts "I REACHED HERE IN REDIRECT"
    new_user_session_url(:subdomain => 'secure')
  end

  # You need to override respond to eliminate recall
  def respond
    puts "I REACHED HERE IN RESPOND"
    if http_auth?
      http_auth
    else
      redirect
    end
  end
end
