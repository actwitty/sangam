 module Iravat
 
 require './ir_module'

  class IrS3  
       

    def load_config()
      @config = IrAwsConfigManager.new(IRAVAT_AWS_CONFIG_XML_PATH)
      @config.loadConfigurationFile()
    end


    def get_config(xpath)
      @config.getPathFromXML(xpath)
    end


    def initialize()
      @logger = IrLogger.new(self.class.name).getLog4rLogger()

      self.load_config()

      @aws_access_key_id = self.get_config('/ChipMonkAWSConfigs/AWSAccessKey/AWSAccessKey')
      @aws_secret_access_key =  self.get_config('/ChipMonkAWSConfigs/AWSAccessKey/AWSAccessSecretKey')
      
      @s3config =  {:server  => self.get_config('/ChipMonkAWSConfigs/S3/Server'),   # Amazon service host: 's3.amazonaws.com'(default)
                   :port         => self.get_config('/ChipMonkAWSConfigs/S3/Port'),   # Amazon service port: 80 or 443(default)
                   :protocol     => self.get_config('/ChipMonkAWSConfigs/S3/Protocol'),   # Amazon service protocol: 'http' or 'https'(default)
                   :multi_thread => self.get_config('/ChipMonkAWSConfigs/S3/MultiThread'),    # Multi-threaded (connection per each thread): 
                   :logger       => IrLogger.new(IRAVAT_RIGHT_SCALE_LOGGER).getLog4rLogger(),}   # Defaults to Stdout
      
      @name_prefix = self.get_config('/ChipMonkAWSConfigs/S3/NamePrefix')
      @name_suffix = self.get_config('/ChipMonkAWSConfigs/S3/NameSuffix')
      @delimeter =  self.get_config('/ChipMonkAWSConfigs/S3/Delimeter')
    end


    #common error handler for RightScale Lib
    def error_aws (aws,err)
      err.errors.each do |e|
        @logger.error( "#### System Error #### " + err.errors)
      end
    end


    def list_s3_bucket()
      s3 = RightAws::S3.new(@aws_access_key_id,  @aws_secret_access_key,@s3config)
    
      my_bucket_names = s3.buckets.map { |b| b.name}
      @logger.info("Buckets on S3: #{my_bucket_names.join(', ')}")
          
      rescue RightAws::AwsError=>err 
        self.error_aws(s3,err) 
    end


    def create_s3_bucket(username)
      s3 = RightAws::S3.new(@aws_access_key_id,  @aws_secret_access_key,@s3config)
      
      bucketname = @name_prefix+@delimeter+username+@delimeter+@name_suffix
      
      @logger.info(bucketname)

      bucket = s3.bucket(bucketname, true)
      rescue RightAws::AwsError=>err
        self.error_aws(s3,err)
      
      #  keymap=bucket.keys.map{|key| key.name}
      #  puts "File list : #{keymap.join(', ')}"
    end


    def delete_s3_bucket(bucketname)
      s3 = RightAws::S3.new(@aws_access_key_id,  @aws_secret_access_key,@s3config)
      bucket = s3.bucket(bucketname)
      if( bucket.nil?)
        raise "No Bucket Exist"
      end
      #clear objects from bucket
      bucket.clear()
      bucket.delete(:force=>false)
      rescue RightAws::AwsError=>err
        self.error_aws(s3,err)

      #Handling the RuntimeError
      rescue => e 
        @logger.warn(e.message)
    end
  end
 

  if __FILE__ == $0
    ir = IrS3.new
    
    ir.create_s3_bucket("IravatInstances")
    ir.list_s3_bucket()
    #ir.delete_s3_bucket("iravattest")
  end

  end
