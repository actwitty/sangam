require 'digest/sha1'

class WebLink < ActiveRecord::Base

  validates_presence_of :url, :url_sha1, :provider, :mime
  validates_uniqueness_of :url_sha1
  validates_format_of     :url, :with =>  eval(AppConstants.url_validator)

  has_many :documents

  before_destroy :ensure_safe_destroy

  def ensure_safe_destroy

    Rails.logger.info("[MODEL] [WEB_LINKS] [ensure_safe_destroy] entering #{self.inspect}")
    puts "before web link destroy #{self.documents.size} #{self.url}  "
      #this case of documents.size  == 1 can come only when a web_link destroy is called from document destroy.
      #as document destroy will be in transaction so count will still be 1
      #For rest of cases of direct web_link destroy, always the destruction should happen when documents.size == 0.
      #SO BE CAREFUL
    if self.documents.size <= 1
      Rails.logger.info("[MODEL] [WEB_LINKS] [ensure_safe_destroy] web link Getting Deleted #{self.inspect}")
      puts "Web Link Gone #{self.url}"
    else
      Rails.logger.info("[MODEL] [WEB_LINKS] [ensure_safe_destroy] web link Safe #{self.inspect}")
      #cant call rebuild_a_summary from here as this is making the transaction itself false
      false
    end

  end

  class << self
    #INPUT => {:url => "http://google.com/123", :provider => "google.com" [names as in categories.yml],
    #          :name => "good search engine", :description => "nice place to search information"
    #          ,:mime => AppConstants.mime_remote_image|video|link|music,  :image_width => params[:image_width],
    #           :image_height => params[:image_height], :url_processed => params[:url_processed]  }

    #OUTPUT => {:url => "http://google.com/123", :category => "sports" [names as in categories.yml],
    #          :name => "good search engine", :description => "nice place to search information"
    #          ,:image_url => "http://google.com/images/googlelogo.jpg", :url_sha1 => "hjjscjcbjcjscbjdbc..",
    #          ,:mime => AppConstants.mime_remote_link, :provider => "google.com", :image_width => params[:image_width],
    #           :image_height => params[:image_height], :url_processed => params[:url_processed] }

    def create_web_link(params)
       Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] entering #{params.inspect}")

       object = nil

       params[:url_sha1] = Digest::SHA1.hexdigest params[:url]

       object = WebLink.where(:url_sha1 => params[:url_sha1]).first
       if !object.blank?
         Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] web_link found #{params.inspect}" )
         return object
       end

       object = create!(params)
       Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] exiting #{params.inspect}")
       object
    rescue => e
       Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] Rescue ERROR #{e.message} for #{params}")
       nil
    end

    #INPUT =>  {:url => "http://google.com"}
    #OUTPUT => {:url => "http://google.com", :category => "sports" [names as in categories.yml],
    #          :name => "good search engine", :description => "nice place to search information"
    #          ,:image_url => "http://google.com/images/googlelogo.jpg" }

    def get_link_details(params)
      Rails.logger.info("[MODEL] [WEB_LINKS] [get_link_details] entering #{params.inspect}")

      url_sha1 = Digest::SHA1.hexdigest params[:url]
      object = WebLink.where(:url_sha1 => url_sha1).first

      if object.blank?
         Rails.logger.info("[MODEL] [WEB_LINKS] [get_link_details] => URL not found #{params.inspect}")
         return nil
      end

      Rails.logger.info("[MODEL] [WEB_LINKS] [get_link_details] leaving #{params.inspect}")
      object.attributes
    end
  end
end



# == Schema Information
#
# Table name: web_links
#
#  id              :integer         not null, primary key
#  url             :text            not null
#  url_sha1        :text            not null
#  mime            :text            not null
#  provider        :text            not null
#  category        :text
#  name            :text
#  description     :text
#  image_url       :text
#  documents_count :integer         default(0)
#  created_at      :datetime
#  updated_at      :datetime
#

