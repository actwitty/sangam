require 'digest/sha1'

class WebLink < ActiveRecord::Base

  validates_presence_of :url, :category
  validates_uniqueness_of :url
  validates_format_of     :url, :with =>  eval(AppConstants.url_validator)

  #INPUT => {:url => "http://google.com", :category => "sports" [names as in categories.yml],
  #          :title => "good search engine", :description => "nice place to search information"
  #          ,:image_url => "http://google.com/images/googlelogo.jpg" }

  #OUTPUT => {:url => "http://google.com", :category => "sports" [names as in categories.yml],
  #          :title => "good search engine", :description => "nice place to search information"
  #          ,:image_url => "http://google.com/images/googlelogo.jpg", :url_sha1 => "hjjscjcbjcjscbjdbc.." }

  def create_web_link(params)
     Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] entering #{params.inspect}")

     params[:url_sha1] = Digest::SHA1.hexdigest params[:url]

     object = create!(params)
     Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] exiting #{params.inspect}")
     return object.attributes

  rescue => e
      Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] rescue => ERROR => #{e.message} FOR params => #{params.inspect}")
      object = nil

      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        object = WebLink.where(:url_sha1 => params[:url_sha1]).first
        Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] rescue => Unique index found=> #{e.message} FOR params => #{params.inspect}")
      end

      return object.attributes if !object.blank?

      nil
  end

  #INPUT =>  {:url => "http://google.com"}
  #OUTPUT => {:url => "http://google.com", :category => "sports" [names as in categories.yml],
  #          :title => "good search engine", :description => "nice place to search information"
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

# == Schema Information
#
# Table name: web_links
#
#  id          :integer         not null, primary key
#  url         :text            not null
#  url_sha1    :text            not null
#  category    :string(255)     not null
#  title       :text
#  description :text
#  image_url   :text
#  keywords    :text
#  created_at  :datetime
#  updated_at  :datetime
#

