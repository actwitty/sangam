require 'logger'
require 'pp'
require 'yaml'


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

class AppConstants
  def self.mime_remote_video
    "video/remote"
  end
  def self.mime_remote_image
    "image/remote"
  end
  def self.mime_remote_music
    "music/remote"
  end
  def self.mime_remote_document
    "application/remote"
  end
  def self.mime_remote_link
    "link/remote"
  end
  def source_object_type_retweet
    "retweet"
  end
  def self.source_object_type_tweet
    "tweet"
  end

  def self.status_private_at_source
    1
  end

  def self.status_public_at_source
    2
  end

  def self.status_public
    2
  end
  def self.status_private
    1
  end

  def self.default_category
    "stories"
  end
end
class WebLink
  def self.where(params)
    [TEST_URLS[7], TEST_URLS[6], TEST_URLS[10]]
  end
end
class Array
  def blank?
    if self.nil? or self.size==0
      return true
    else 
     return false
    end 
  end
end
class Hash
  def blank?
    if self.nil? or self.size==0
      return true
    else
      return false
    end 
  end
end
class String
  def blank?
    if self.nil? or self.length==0
      return true
    else
      return false
    end 
  end

  def to_time
    self
  end
  
  def utc
    self
  end
end
class NilClass
  def blank?
    return true
  end  
end
module Api
  module Helpers
    module Document
      class << self
        def get_documents(params)
          array = []
          array << {:mime => AppConstants.mime_remote_link, :url => params[:text], :provider => "http://t.co",:uploaded => false, :url_sha1 => Digest::SHA1.hexdigest( params[:text])}
          array
        end

        #INPUT => type
        #OUTPUT => mime
        def map_type_to_mime(type)
          case type
            when "photo"
              return AppConstants.mime_remote_image
            when "video"
              return AppConstants.mime_remote_video
            when "music"
              return AppConstants.mime_remote_music
            when "link"
              return AppConstants.mime_remote_link
            else
              return AppConstants.mime_remote_link
          end
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [convert_type_to_mime] **** RESCUE **** => #{e.message} for #{type}")
          return AppConstants.mime_remote_link
        end
      end
    end
  end
end
