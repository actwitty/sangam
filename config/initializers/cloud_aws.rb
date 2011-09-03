
CLOUD_AWS = YAML.load_file("#{Rails.root}/config/cloud_keys.yml")

CloudAws.configure do |config|
   config.aws_access_key_id = CLOUD_AWS[Rails.env]['aws_access_key_id']
   config.aws_secret_access_key =  CLOUD_AWS[Rails.env]['aws_secret_access_key']
end
