require 'net/https'
require 'open-uri'

require 'helper/http'
require 'fetcher/facebook'

module SocialFetch

  #INPUT => {:user_id => 123, :uid => "234", :access_token => "gdjjsagjgds.."}
  #OUTPUT => array of messages from provider

  def self.pull_data(params)

    Rails.logger.error("[LIB] [SOCIAL_FETCH] [pull_data] entering #{params.inspect}")

    klass = "::SocialFetch::Fetcher::#{params[:provider].camelize}".camelize.constantize
    response = klass.pull_data(params)

    Rails.logger.error("[LIB] [SOCIAL_FETCH] [pull_data] leaving #{params.inspect}")

    return response

  rescue => e
    Rails.logger.error("[LIB] [SOCIAL_FETCH] [pull_data] Error => #{e.message} for #{params.inspect}")
    nil
  end

  #INPUT => {
  #           :user_id => 123, :uid => "234", :time => Time.now.utc #its an example it will be utc time,
  #           :provider => "facebook",  :blob => {} #single facebook data blob,
  #         }
  #OUTPUT => {
  #           :post => {:source_msg_id => "2342",:source_name => "facebook",:status => AppConstants.status_public,
  #                 :enrich => true, :word => "stories", :summary_category => "stories",},
  #           :category => {:data => "http://google.com", :type => AppConstants.data_type_weburl}
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


