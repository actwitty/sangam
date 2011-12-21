require 'net/https'
require 'open-uri'

require 'helper/http'
require 'fetcher/facebook'

module SocialFetch

  #INPUT => {:user_id => 123, :uid => "234", :access_token => "gdjjsagjgds.."}
  #OUTPUT => array of messages from provider in descending order of creation time

  def self.pull_data(params)

    Rails.logger.info("[LIB] [SOCIAL_FETCH] [pull_data] entering #{params.inspect}")

    klass = "::SocialFetch::Fetcher::#{params[:provider].camelize}".camelize.constantize
    response = klass.pull_data(params)

    Rails.logger.info("[LIB] [SOCIAL_FETCH] [pull_data] leaving #{params.inspect}")

    return response

  rescue => e
    Rails.logger.error("[LIB] [SOCIAL_FETCH] [pull_data] Error => #{e.message} for #{params.inspect}")
    nil
  end

  #INPUT => {:user_id => 123, :uid => "234", :last_updated_at => Time.now.utc #its an example it will be utc time,
  #         :blob => {} #single facebook data blob,  }
  #OUTPUT => {
  #            :post => {:source_msg_id => "2342",:source_name => "facebook",:status => AppConstants.status_public,
  #                      :enrich => true/False, :word => "stories", :summary_category => "stories",
  #                      :created_at => ,1994-11-05T13:15:30Z, :updated_at =>1994-11-05T13:15:30Z [OPTIONAL]
  #                     :links => [
  #                             { :url => "http://timesofindia.com/123.cms", :description => "Manmohan singh sleeping" [OPTIONAL],
  #                               :title => "indian politics"[OPTIONAL], :mime => AppConstants.mime_remote_link,
  #                               :provider => "timesofindia.com",
  #                               :url_sha => "sedeidnksdskadnksdkasnk" [SHA KEY NEEDED TO OPTIMIZE CHECK OF URL,
  #                               :ignore => true/false [THIS TELLS THAT IGNORE THIS LINK FOR CATEGORIZATION or RESOLUTION] }...
  #                               :image_url => "http://timesofindia.com/123.jpg"
  #                              ]
  #                     }
  #          }

  def self.data_adaptor(params)
    log = params.except(:blob)
    Rails.logger.info("[LIB] [SOCIAL_FETCH] [data_adaptor] entering #{log.inspect}")

    klass = "::SocialFetch::Fetcher::#{params[:provider].camelize}".camelize.constantize
    response = klass.data_adaptor(params)

    Rails.logger.error("[LIB] [SOCIAL_FETCH] [data_adaptor] leaving #{log.inspect}")
    return response

  rescue => e
    Rails.logger.error("[LIB] [SOCIAL_FETCH] [data_adaptor] Error => #{e.message} for #{log.inspect}")
    nil
  end

  #INPUT => {:data => "http://google.com", :type => AppConstants.data_type_weburl}
  #                       OR
  #         {:data => "http://youtube.com?hkhfsk", :type => AppConstants.data_type_youtube}
  #                       OR
  #         {:data => "http://facebook.com/xkjksck", :type => AppConstants.data_type_facebook}
  #                       OR
  #         {:data => "hello this is basic text ..", :type => AppConstants.data_type_text}
  #
  #OUTPUT => "stories" or "entertainment" or "pets and animals" #check categories.yml
  def self.categorize_data(params)
    Rails.logger.error("[LIB] [SOCIAL_FETCH] [data_adaptor] entering #{params.inspect}")

    case params[:type]

      when AppConstants.data_type_weburl, AppConstants.data_type_facebook, AppConstants.data_type_youtube then
        category = ::SocialFetch::Categorizer::AlchemyApi.categorize(params[:data])

      when AppConstants.data_type_text then
        category = AppConstants.default_category

      else
        category = AppConstants.default_category
    end

    Rails.logger.error("[LIB] [SOCIAL_FETCH] [data_adaptor] leaving #{params.inspect}")
    return category
  end
end


