require 'net/https'
require 'open-uri'

require 'services/facebook'

module SocialFetch

  #INPUT => {:user_id => 123, :uid => "234", :access_token => "gdjjsagjgds.."}
  #OUTPUT => array of messages from provider in descending order of creation time

  def self.pull_data(params)

    Rails.logger.info("[LIB] [SOCIAL_FETCH] [pull_data] entering #{params.inspect}")

    klass = "::SocialFetch::Services::#{params[:provider].camelize}".camelize.constantize
    response = klass.pull_data(params)

    Rails.logger.info("[LIB] [SOCIAL_FETCH] [pull_data] leaving #{params.inspect}")

    return response

  rescue => e
    Rails.logger.error("[LIB] [SOCIAL_FETCH] [pull_data] **** RESCUE **** => #{e.message} for #{params.inspect}")
    nil
  end

  #INPUT => {:user_id => 123, :uid => "234", :last_updated_at => Time.now.utc #its an example it will be utc time,
  #         :blob => {} #single facebook data blob,  }
  #OUTPUT => {
  #            :post => {:status_at_source => AppConstants.status_private/public,[MANDATORY] [TELLS WHETHER TO STORE DATA FOR THIS MESSAGE OR NOT]
  #                      :source_object_id => "2342", [MANDATORY]
  #                      :source_name => "facebook", [MANDATORY]
  #                      :source_uid => "12123232" #uid of user at facebook   [MANDATORY]
  #                      :source_object_type => "post"/"like" AppConstants.source_object_type_post/like
  #                      :status => AppConstants.status_public, [MANDATORY]
  #                      :enrich => true/False, [MANDATORY]
  #                      :word => "stories", [MANDATORY]
  #                      :category_id => "stories",  [MANDATORY]
  #                      :created_at => ,1994-11-05T13:15:30Z, [MANDATORY]
  #                      :updated_at =>1994-11-05T13:15:30Z [OPTIONAL]
  #                      :text => "hello world http://timesofindia.com/123.cms"  [OPTIONAL]
  #                      :location] = { [OPTIONAL]
  #                                     :lat => 23.345 ,
  #                                     :long => 46.2334],
  #                                     :name => "MG Road",
  #                                     :city => "Bangalore",
  #                                     :country => "India",
  #                                     :region => "karnataka",
  #                                     :source_name => "facebook",
  #                                     :source_object_id =>"234666"
  #                                   }
  #                      :links => [ [OPTIONAL]
  #                                    {
  #                                     :url => "http://timesofindia.com/123.cms",
  #                                     :description => "Manmohan singh sleeping" [OPTIONAL],
  #                                     :title => "indian politics"[OPTIONAL],
  #                                     :mime => AppConstants.mime_remote_link,
  #                                     :provider => "timesofindia.com",
  #                                     :url_sha => "sedeidnksdskadnksdkasnk" [SHA KEY NEEDED TO OPTIMIZE CHECK OF URL,
  #                                     :ignore => true/false [THIS TELLS THAT IGNORE THIS LINK FOR CATEGORIZATION or RESOLUTION]
  #                                     :image_url => "http://timesofindia.com/123.jpg"
  #                                     :source_object_id => "12313123" #FOR UPLOADED OBJECTS
  #                                   }...
  #                              ]
  #                     }
  #          }

  def self.data_adaptor(params)
    log = params.except(:blob)
    Rails.logger.info("[LIB] [SOCIAL_FETCH] [data_adaptor] entering #{log.inspect}")

    klass = "::SocialFetch::Services::#{params[:provider].camelize}".camelize.constantize
    response = klass.data_adaptor(params)

    Rails.logger.error("[LIB] [SOCIAL_FETCH] [data_adaptor] leaving #{log.inspect}")
    return response

  rescue => e
    Rails.logger.error("[LIB] [SOCIAL_FETCH] [data_adaptor] **** RESCUE **** => #{e.message} for #{log.inspect}")
    nil
  end
end


