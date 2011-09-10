PUSHER_SVC = YAML.load_file("#{Rails.root}/config/cloud_keys.yml")

PusherSvc.configure do |config|
   config.pusher_app_id = PUSHER_SVC[Rails.env]['pusher_app_id']
   config.pusher_key_id = PUSHER_SVC[Rails.env]['pusher_key_id']
   config.pusher_secret_key =  PUSHER_SVC[Rails.env]['pusher_secret_key']
end
