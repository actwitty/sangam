 CarrierWave.configure do |config|
    config.permissions = 0644
    config.enable_processing = true
    config.fog_credentials = {
      :provider               => 'AWS',
      :aws_access_key_id      => 'AKIAIUBWSJ645432NLIQ',
      :aws_secret_access_key  => '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',
      :region                 => 'us-east-1'
    }
    config.fog_directory  = 'sangamupload'
    config.fog_host       = 'http://sangamupload.s3-website-us-east-1.amazonaws.com/'
    config.fog_public     = false
    config.fog_attributes = {'Cache-Control'=>'max-age=315576000'}
    config.cache_dir = "uploads"
    config.root = Rails.root.join('tmp')
 end

