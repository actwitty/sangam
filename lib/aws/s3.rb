
require 'right_aws'
require 'logger'

class Rails
  class << self
    @log = nil

    def logger
      if @log.nil?
        @log = Logger.new(STDOUT)
      end
      @log
    end
  end
end

module AwsS3

   def initialize()
     @aws_access_key_id = 'AKIAJMH2GTITVBHDSZ6Q'
     @aws_secret_access_key =  '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'

     @s3config =  {:server  => 's3.amazonaws.com',   # Amazon service host: 's3.amazonaws.com'(default)
                     :port         => 443,   # Amazon service port: 80 or 443(default)
                     :protocol     => 'https',   # Amazon service protocol: 'http' or 'https'(default)
                     :multi_thread => false,    # Multi-threaded (connection per each thread):
                     :logger       => Rails.logger}   # Defaults to Stdout


   end


  #common error handler for RightScale Lib
  def error_aws (aws,err)
    err.errors.each do |e|
      Rails.logger.error( "[LIB] [AWS] [S3] [error_aws] System Error => " + err.errors)
    end
  end


  def list_s3_bucket()
    s3 = RightAws::S3.new(@aws_access_key_id,  @aws_secret_access_key,@s3config)
    
    my_bucket_names = s3.buckets.map { |b| b.name}
    Rails.logger.info("[LIB] [AWS] [S3] [list_s3_bucket] Buckets on S3: #{my_bucket_names.join(', ')}")

  #Handle Right_Aws error
  rescue RightAws::AwsError=>err
    self.error_aws(s3,err)

  #Handling the RuntimeError
  rescue => e
    Rails.logger.warn("[LIB] [AWS] [S3] [list_s3_bucket] rescue " + e.message)
  end


  def create_s3_bucket(bucket_name)

    if bucket_name.blank?
      Rails.logger.info("[LIB] [AWS] [S3] [create_s3_bucket] empty bucket name")
      return
    end

    s3 = RightAws::S3.new(@aws_access_key_id,  @aws_secret_access_key,@s3config)

    bucket = s3.bucket(bucket_name, true)

    bucket.blank? ? status = false : status = true

    Rails.logger.info("[LIB] [AWS] [S3] [create_s3_bucket] bucket #{bucket_name} create status = #{status}")

  #Handle Right_Aws error
  rescue RightAws::AwsError=>err
    self.error_aws(s3,err)
      
  #Handling the RuntimeError
  rescue => e
    Rails.logger.warn("[LIB] [AWS] [S3] [create_s3_bucket] rescue " + e.message)
  end


  def delete_s3_bucket(bucket_name)

    if bucket_name.blank?
      Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_bucket] empty bucket name")
      return
    end

    s3 = RightAws::S3.new(@aws_access_key_id,  @aws_secret_access_key,@s3config)
    bucket = s3.bucket(bucket_name)

    if( bucket.nil?)
      raise "No Bucket Exist"
    end

    #clear objects from bucket
    bucket.clear()
    status = bucket.delete(:force=>false)

    Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_bucket] bucket #{bucket_name} delete status = #{status}")

  #Handle Right_Aws error
  rescue RightAws::AwsError=>err
    self.error_aws(s3,err)

    #Handling the RuntimeError
  rescue => e
     Rails.logger.warn("[LIB] [AWS] [S3] [delete_s3_bucket] rescue " + e.message)
  end

  def delete_s3_key(key_url)

    if key_url.blank?
      Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_key] empty key url #{key_url}")
      return
    end
    key = key_url.sub("https://s3.amazonaws.com/","")
    array = key.split('/')

    bucket = s3.bucket(array[0])
    key = bucket.key(array[1], true)

    status = key.delete

    Rails.logger.warn("[LIB] [AWS] [S3] [delete_s3_key] key #{array[1]} in bucket #{array[0]} has delete status = #{status} ")
    #Handle Right_Aws error
  rescue RightAws::AwsError=>err
    self.error_aws(s3,err)

    #Handling the RuntimeError
  rescue => e
     Rails.logger.warn("[LIB] [AWS] [S3] [delete_s3_key] rescue " + e.message)
  end

end
 

  if __FILE__ == $0
    aws = AwsS3.new
    
    aws.create_s3_bucket("TestCloudActwitty_1")
    aws.list_s3_bucket()
    aws.delete_s3_bucket("TestCloudActwitty_1")
  end

