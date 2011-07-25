module UploadsHelper

  #  Creates an instance of a plupload S3 file uploader
  ###
  # required parameters:
  ###
  #  key                       s3 'path' to uploaded files
  #
  ###
  # optional parameters:
  ###
  #  s3_config_filename        filename of s3 config yaml file (full path), defaults to "#{RAILS_ROOT}/config/amazon_s3.yml"
  #
  #  content_type              binary/octet-stream
  #
  #  acl                       public-read
  #
  #  expiration_date           10.hours.from_now.utc.iso8601
  #
  #  max_filesize              2.megabytes

  def s3_uploader(options = {})
    options[:s3_config_filename] ||= "#{Rails.root}/config/amazon_s3.yml"
    config = YAML.load_file(options[:s3_config_filename])[Rails.env].symbolize_keys
    bucket            = config[:bucket_name]
    puts bucket
    access_key_id     = config[:access_key_id]
    puts access_key_id
    secret_access_key = config[:secret_access_key]
    puts secret_access_key

    options[:key] ||= 'test'  # folder on AWS to store file in
    options[:acl] ||= 'public-read'
    options[:expiration_date] ||= 10.hours.from_now.utc.iso8601
    options[:max_filesize] ||= 500.megabytes
    options[:content_type] ||= 'image/' # Videos would be binary/octet-stream
    options[:filter_title] ||= 'Images'
    options[:filter_extentions] ||= 'jpg,jpeg,gif,png,bmp'

    id = options[:id] ? "_#{options[:id]}" : ''

    policy = Base64.encode64(
      "{'expiration': '#{options[:expiration_date]}',
        'conditions': [
          {'bucket': '#{bucket}'},
          {'acl': '#{options[:acl]}'},
          {'success_action_status': '201'},
          ['content-length-range', 0, #{options[:max_filesize]}],
          ['starts-with', '$key', ''],
          ['starts-with', '$Content-Type', ''],
          ['starts-with', '$name', ''],
          ['starts-with', '$Filename', '']
        ]
      }").gsub(/\n|\r/, '');

    signature = Base64.encode64(
                  OpenSSL::HMAC.digest(
                    OpenSSL::Digest::Digest.new('sha1'),
                    secret_access_key, policy)).gsub("\n","");

    out = "";

    out << javascript_tag("$(function() {

      /*
       * S3 Uploader instance
      */
      // image uploader via plupload
        var uploader = new plupload.Uploader({
            runtimes : 'flash,silverlight',
            browse_button : 'pickfiles',
            max_file_size : '5mb',
            //url : 'http://#{bucket}.s3.amazonaws.com/',
            url : 'https://s3.amazonaws.com/#{bucket}',
            flash_swf_url: '/javascripts/plupload/plupload.flash.swf',
            silverlight_xap_url: '/javascripts/plupload/plupload.silverlight.xap',
            //CONFIG:Image upload quality
            resize : {width : 640, height : 480, quality : 70},
            //CONFIG:Disabled multi selection
            //multi_selection: true,
            multipart: true,
            multipart_params: {
              'key': 'test/' + get_jquery_utc_time() + '_#{current_user.id}_${filename}',
              // adding this to keep consistency across the runtimes
              'Filename': get_jquery_utc_time() + '_#{current_user.id}_${filename}', 
        			'acl': '#{options[:acl]}',
        			'Content-Type': '#{options[:content_type]}',
        			'success_action_status': '201',
        			'AWSAccessKeyId' : '#{access_key_id}',		
        			'policy': '#{policy}',
        			'signature': '#{signature}'
             },
            filters : [
                {title : '#{options[:filter_title]}', extensions : '#{options[:filter_extentions]}'}
            ],
            file_data_name: 'file'
        });
        
				// instantiates the uploader
        uploader.init();
        
        // shows the progress bar and kicks off uploading
        uploader.bind('FilesAdded', function(up, files) {
          //CONFIG: Event on files added.

        });

        // binds progress to progress bar
        uploader.bind('UploadProgress', function(up, file) {
          //CONFIG: File by file upload progress callback                               
        });
       
        uploader.bind('UploadComplete', function(up, files) {
          //CONFIG: File upload of a file done
       }
     
    });

        // shows error object in the browser console (for now)
        uploader.bind('Error', function(up, error) {
          // unfortunately PLUpload gives some extremely vague 
          // Flash error messages so you have to use WireShark
          // for debugging them (read the README)
          
          alert('There was an error.  Check the browser console log for more info');
          console.log('Expand the error object below to see the error. Use WireShark to debug.');
          
          console.log(error);
        });
       $('#uploadfiles').live('click', function(){
          //CONFIG: Upload button clicked
            uploader.start();
            e.preventDefault();
      });
      
    });")
  
  end
end
