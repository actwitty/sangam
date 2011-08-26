module ProfilepicHelper

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

  def s3_profile_pic_uploader(options = {})
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


      function get_file_prefix(){
        var user_id = '#{current_user.id}';
        var now = new Date();
        var file_name = user_id + '_' + now.getTime() + '_';
        return file_name;
      }
      var base_url = 'https://s3.amazonaws.com/#{bucket}';
      // image uploader via plupload
        var uploader = new plupload.Uploader({
                                                runtimes : 'flash',
                                                browse_button : 'profile_img_selector',
                                                max_file_size : '5mb',
                                                url : base_url,
                                                flash_swf_url: '/javascripts/plupload/plupload.flash.swf',
                                                init : {
                                                          FilesAdded: function(up, files) {
                                                                                  plupload.each(files, function(file) {
                                                                                                if(up.files.length > 1) {
                                                                                                  up.removeFile(file);
                                                                                                }
                                                                                              });
                                                                                          }
                                                        },
	                                              resize : {
                                                            width : 640,
                                                            height: 480,
                                                            quality : 60
                                                         },
                                                multipart: true,
                                                multi_selection:false,
                                                multipart_params: {
                                                                    'key': 'profile_pics/' + '${filename}',
                                                                    'Filename': 'profile_pics/' + '${filename}',
        			                                                      'acl': '#{options[:acl]}',
        			                                                      'Content-Type': '#{options[:content_type]}',
        			                                                      'success_action_status': '201',
        			                                                      'AWSAccessKeyId' : '#{access_key_id}',		
        			                                                      'policy': '#{policy}',
        			                                                      'signature': '#{signature}'
                                                                  },
                                                filters : [
                                                              {
                                                                title : '#{options[:filter_title]}', 
                                                                extensions : '#{options[:filter_extentions]}'
                                                              }
                                                          ],
                                               file_data_name: 'file'
                                            });
        
				
                                var count=0;
                                var main_url='';
                                var thumb_url='';
                                var prefix='';
                                uploader.bind('UploadFile',function(up,file){
                                  //alert('UPLOAD FILE');
                                   if(count==0){
                                     prefix =  get_file_prefix();
                                     main_url = base_url + '/profile_pics/' + prefix + file.name;
                                     thumb_url = base_url + '/profile_pics/' + prefix + 'thumb_' + file.name;
                                     up.settings.multipart_params['key']='profile_pics/' + prefix + '${filename}';
                                     up.settings.multipart_params['Filename']='profile_pics/' + prefix +  '${filename}'; 

                                   }
                                });
                    
                                uploader.bind('FileUploaded', function(up, file) {
                                  //alert('file uploaded');	
                                  if(count==0 && file.status == plupload.DONE){
                                    count++;
                                    file.status = plupload.QUEUED;
                                    var key = 'profile_pics/' + prefix + 'thumb_' + '${filename}';
                                    var file_name ='profile_pics/' + prefix + 'thumb_' + '${filename}';
                                    up.stop();
                                    up.trigger('Refresh');
                                    up.settings.multipart_params['key']= key;
                                    up.settings.multipart_params['Filename']=file_name; 
        	                          up.settings.resize= { 
                                                          width : 50, 
                                                          height : 50
                                                        };
                                    uploader.start();
                                    /* main image completion handler */
                                  }else{
                                    /* thumbnail image completion handler */
                                    aw_notify_profile_image(main_url, thumb_url);
                                  }
                                });

                                uploader.bind('QueueChanged', function(up, file, response) {
                                  if(up.files.length){
                                    up.start();
                                  }
                                });

                              uploader.bind('UploadProgress', function(up, file) {

                              });


                               uploader.bind('StateChanged', function(up) {
                                 /*if(up.state == plupload.STOPPED){
                                  alert('state stopped');
                                 }else if(up.state == plupload.STARTED){
                                  alert('state started');
                                 } */
                               });
                                
                                uploader.bind('FilesAdded', function(up, files) {
                                  //alert(JSON.stringify(files));
                                  count=0;
                                  main_url='';
                                  thumb_url='';
                                  prefix='';
                                });

                              uploader.bind('Error', function(up, err) {
                                //alert(err.message);
                              });
        
                              uploader.init();
      
                              });")
  
  end
end
