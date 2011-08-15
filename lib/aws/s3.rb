module CloudAws

     mattr_accessor  :s3config
     @@s3config =  {:server  => 's3.amazonaws.com',   # Amazon service host: 's3.amazonaws.com'(default)
                     :port         => 443,   # Amazon service port: 80 or 443(default)
                     :protocol     => 'https',   # Amazon service protocol: 'http' or 'https'(default)
                     :multi_thread => false,    # Multi-threaded (connection per each thread):
                     :logger       => Rails.logger}   # Defaults to Stdout


    #common error handler for RightScale Lib
    def aws_s3_error (aws,err)
      err.errors.each do |e|
        Rails.logger.error( "[LIB] [AWS] [S3] [error_aws] System Error => #{err.errors} \n\n")
      end
    end

    #Create S3 Connection handle
    def create_s3_connection
      Rails.logger.info("[LIB] [AWS] [S3] [create_s3_connection] entering" )
      s3_handle = RightAws::S3.new(@@aws_access_key_id,  @@aws_secret_access_key, @@s3config)
      return s3_handle

      #Handle Right_Aws error
      rescue RightAws::AwsError=>err
        aws_s3_error(s3,err)
         return nil
      
      #Handling the RuntimeError
      rescue => e
        Rails.logger.warn("[LIB] [AWS] [S3] [create_s3_connection] rescue #{e.message} \n\n")
        return nil
    end

    #List Buckets from S3
    def list_s3_bucket(s3_handle)

      Rails.logger.info("[LIB] [AWS] [S3] [list_s3_bucket] entering" )
     
      puts self.inspect.to_s

      #s3 = create_s3_connection

      if s3_handle.nil?
        Rails.logger.error("[LIB] [AWS] [S3] [list_s3_bucket] S3 connection failed\n\n" )
        return
      end

      my_bucket_names = s3_handle.buckets.map { |b| b.name}
      Rails.logger.info("[LIB] [AWS] [S3] [list_s3_bucket] Buckets on S3: #{my_bucket_names.join(', ')} \n\n")

      return true

      #Handle Right_Aws error
      rescue RightAws::AwsError=>err
        aws_s3_error(s3_handle,err)
        return false

      #Handling the RuntimeError
      rescue => e
        Rails.logger.error("[LIB] [AWS] [S3] [list_s3_bucket] rescue #{e.message} \n\n")
        return false
    end

    #Create a bucket.. If bucket already exists then nothing is done
    def create_s3_bucket(s3_handle,bucket_name)

      Rails.logger.info("[LIB] [AWS] [S3] [create_s3_bucket] entering" )

      if bucket_name.blank?
        Rails.logger.info("[LIB] [AWS] [S3] [create_s3_bucket] empty bucket name")
        return
      end

      #s3 = create_s3_connection

      if s3_handle.nil?
        Rails.logger.error("[LIB] [AWS] [S3] [create_s3_bucket] S3 connection failed\n\n" )
        return
      end

      bucket = s3_handle.bucket(bucket_name, true)

      bucket.blank? ? status = false : status = true

      Rails.logger.info("[LIB] [AWS] [S3] [create_s3_bucket] bucket #{bucket_name} create status = #{status} \n\n")

      return true

      #Handle Right_Aws error
      rescue RightAws::AwsError=>err
        aws_s3_error(s3_handle,err)
        return false

      #Handling the RuntimeError
      rescue => e
        Rails.logger.error("[LIB] [AWS] [S3] [create_s3_bucket] rescue #{e.message} \n\n")
        return false
    end

    #Delete a bucket.. If bucket does not exists then nothing is done
    def delete_s3_bucket(s3_handle, bucket_name)

      Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_bucket] entering" )

      if bucket_name.blank?
        Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_bucket] empty bucket name")
        return
      end

      #s3 = create_s3_connection

      if s3_handle.nil?
        Rails.logger.error("[LIB] [AWS] [S3] [delete_s3_bucket] S3 connection failed\n\n" )
        return
      end

      bucket = s3_handle.bucket(bucket_name)

      if( bucket.nil?)
        raise "No Bucket Exist"
      end

      #clear objects from bucket
      bucket.clear()
      status = bucket.delete(:force=>false)

      Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_bucket] bucket #{bucket_name} delete status = #{status} \n\n")

      return true

      #Handle Right_Aws error
      rescue RightAws::AwsError=>err
        aws_s3_error(s3_handle,err)
        return false

      #Handling the RuntimeError
      rescue => e
         Rails.logger.error("[LIB] [AWS] [S3] [delete_s3_bucket] rescue  #{e.message} \n\n")
         return false
    end

    #Delete a key.. If key does not exists then nothing is done
    def delete_s3_key(s3_handle, key_url)

      Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_key] entering" )

      if key_url.blank?
        Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_key] empty key url #{key_url}")
        return
      end

      key_uri = key_url.sub("#{@@s3config[:protocol]}://#{@@s3config[:server]}/","")
      bkt = key_uri.split('/')[0]

      key_uri  = key_uri.sub(bkt + "/", "")

      #s3 = create_s3_connection

      if s3_handle.nil?
        Rails.logger.error("[LIB] [AWS] [S3] [delete_s3_key] S3 connection failed\n\n" )
        return
      end

      bucket = s3_handle.bucket(bkt)

      key = bucket.key(key_uri, true)

      status = key.delete
      Rails.logger.info("[LIB] [AWS] [S3] [delete_s3_key] key <#{key_uri}> in bucket <#{bkt}> has delete status = #{status} \n\n")

      return true

      #Handle Right_Aws error
      rescue RightAws::AwsError=>err
        aws_s3_error(s3_handle,err)
        return false

      #Handling the RuntimeError
      rescue => e
        Rails.logger.error("[LIB] [AWS] [S3] [delete_s3_key] rescue  #{e.message} \n\n")
        return false

    end

    #Delete a key.. If key does not exists then nothing is done
    def create_s3_key(s3_handle, key_uri, file_path)

      Rails.logger.info("[LIB] [AWS] [S3] [create_s3_key] entering" )

      if key_uri.blank?
        Rails.logger.info("[LIB] [AWS] [S3] [create_s3_key] empty key url #{key_uri}")
        return
      end

      bkt = key_uri.split('/')[0]

      key_uri  = key_uri.sub(bkt + "/", "")

      mem_buf = File.open(file_path,"rb") {|io| io.read}

      if mem_buf.blank?
        Rails.logger.info("[LIB] [AWS] [S3] [create_s3_key] empty file #{file_path} \n\n")
        return
      end

      #s3 = create_s3_connection

      if s3_handle.nil?
        Rails.logger.error("[LIB] [AWS] [S3] [create_s3_key] S3 connection failed\n\n" )
        return
      end

      bucket = s3_handle.bucket(bkt, true)

      key = RightAws::S3::Key.create(bucket, key_uri)

      key.put(mem_buf)

      Rails.logger.info("[LIB] [AWS] [S3] [create_s3_key] key <#{key_uri}> in bucket <#{bkt}> \n\n")

      return true

      #Handle Right_Aws error
      rescue RightAws::AwsError=>err
        aws_s3_error(s3_handle,err)
        return false

      #Handling the RuntimeError
      rescue => e
         Rails.logger.error("[LIB] [AWS] [S3] [create_s3_key] rescue #{e.message} \n\n")
         return false
    end

end


