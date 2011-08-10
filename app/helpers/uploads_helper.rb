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
    options[:filter_extentions] ||= 'jpg,jpeg,gif,png,bmp,JPG,JPEG,GIF,PNG,BMP,Jpg,Gif,Jpeg,Bmp'
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
		max_file_count: 5, // user can add no more then 5 files at a time
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

	});

  /* user id and timestamp to prefix a file */
  function get_file_prefix(){
    var user_id = '#{current_user.id}';
    var now = new Date();
    var file_name = user_id + '_' + now.getTime() + '_';
    return file_name;
  }

  /* Single file upload handler */
  var uploader=$('#uploader').plupload('getUploader');
  var queuefile=new Array();
  uploader.bind('UploadFile',function(up,file){

    var caption_id = 'file_caption_' + file.id;
    var caption = $('#' + caption_id).val(); 
    var file_name = file.name;
    var prefix = get_file_prefix();
    var url = up.settings.url + '/' + 'test/' + prefix + file.name;
    var thumb_url = up.settings.url + '/' + 'test/thumb_' + prefix + file.name;
		
    

	if(jQuery.inArray(file.name, queuefile)>=0){
    up.settings.multipart_params['key']='test/thumb_' + prefix + '${filename}';
    up.settings.multipart_params['Filename']='thumb_' + prefix + '${filename}'; 
    up.settings.resize={width : 100, height : 100};
		add_document_thumb_to_json(file.id, thumb_url );
  }
  else
  {
		up.settings.multipart_params['key']='test/' + prefix + '${filename}';
    up.settings.multipart_params['Filename']= prefix + '${filename}';      
		up.settings.resize= {width : 640, height : 480, quality :80};
		add_document_to_json(file.id, url, caption );
   } 

    
  });

  uploader.bind('FileUploaded', function(up, file, response) {
   

	if(jQuery.inArray(file.name, queuefile)<0){
    	queuefile.push(file.name);       
      file.status=plupload.QUEUED;       
      
    }else{
		 if( uploader.total.uploaded == uploader.files.length){
        document_upload_complete();
    	}
	  }
       
  });

  uploader.bind('QueueChanged', function(up, file, response) {
    var count_to_upload = uploader.files.length -  uploader.total.uploaded;
    document_set_pending_upload_count(count_to_upload);
  });
});")
  
  end
end
