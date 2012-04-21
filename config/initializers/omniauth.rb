Rails.application.config.middleware.use OmniAuth::Builder do
  if Rails.env == "development"
    provider :facebook,AppConstants.facebook_app_id, AppConstants.facebook_secret_key, {:scope=>'offline_access,read_stream,publish_stream,email,user_likes,user_birthday,user_hometown,user_interests,read_friendlists, user_photo_video_tags, user_photos, user_videos',  :client_options => {:ssl => {:ca_path => "/etc/ssl/certs"}}}
  else
    provider :facebook,AppConstants.facebook_app_id, AppConstants.facebook_secret_key, {:scope=>'offline_access,read_stream,publish_stream,email,user_likes,user_birthday,user_hometown,user_interests,read_friendlists, user_photo_video_tags, user_photos, user_videos'}
  end
  provider :twitter, AppConstants.twitter_consumer_key, AppConstants.twitter_consumer_secret
  provider :linked_in, AppConstants.linkedin_app_id, AppConstants.linkedin_secret_key
end
