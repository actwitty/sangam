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
    access_key_id     = config[:access_key_id]
    secret_access_key = config[:secret_access_key]

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
      }").gsub(/\n|\r/, '')

    signature = Base64.encode64(
                  OpenSSL::HMAC.digest(
                    OpenSSL::Digest::Digest.new('sha1'),
                    secret_access_key, policy)).gsub("\n","")
   puts signature

    out = ""

    out << javascript_tag("$(function() {
	$('#uploader').plupload({
		// General settings
		runtimes : 'flash',
		url : 'https://s3.amazonaws.com/#{bucket}',
		max_file_size : '5mb',
		max_file_count: 20, // user can add no more then 20 files at a time
		unique_names : true,
		multiple_queues : true,

		// Resize images on clientside if we can
		resize : {width : 640, height : 480, quality : 80},
		
		// Rename files by clicking on their titles
		rename: true,
		
		// Sort files
  		sortable: true,

    multipart: true,
    multipart_params: {
              'key': 'test/${filename}',
              'Filename': '${filename}', // adding this to keep consistency across the runtimes
        			'acl': '#{options[:acl]}',
        			'Content-Type': '#{options[:content_type]}',
        			'success_action_status': '201',
        			'AWSAccessKeyId' : '#{access_key_id}',		
        			'policy': '#{policy}',
        			'signature': '#{signature}'
             },

		// Specify what files to browse for
		filters : [
                {title : '#{options[:filter_title]}', extensions : '#{options[:filter_extentions]}'}
            ],
		file_data_name: 'file',
		// Flash settings
		flash_swf_url: '/javascripts/plupload/plupload.flash.swf',

		// Silverlight settings
		silverlight_xap_url: '/javascripts/plupload/plupload.silverlight.xap',
	});

	// Client side form validation
	$('form').submit(function(e) {
		var uploader = $('#uploader').plupload('getUploader');

		// Validate number of uploaded files
		if (uploader.total.uploaded == 0) {
			// Files in queue upload them first
			if (uploader.files.length > 0) {
				// When all files are uploaded submit form
				uploader.bind('UploadProgress', function() {
					if (uploader.total.uploaded == uploader.files.length)
						$('form').submit();
				});

				uploader.start();
			} else
				alert('You must at least upload one file.');

			e.preventDefault();
		}
	});

});")
  
  end
end
