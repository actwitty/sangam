require 'digest/sha1'

class WebLink < ActiveRecord::Base

  validates_presence_of :url, :url_sha1, :provider, :mime
  validates_uniqueness_of :url_sha1

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
      false
    end

  end

  class << self
    #INPUT => {:url => "http://google.com/123", :provider => "google.com" [names as in categories.yml],
    #          :title => "good search engine", :description => "nice place to search information"
    #          ,:mime => AppConstants.mime_remote_image|video|link|music,  :image_width => params[:image_width],
    #           :image_height => params[:image_height], :canonical_url => params[:canonical_url], :category_id => params[:category_id,
    #           :cache_age => 86400, :element => "p" or "idiv" [divs without nesting] or "li"  or "td" or "tr" }

    #OUTPUT => {:url => "http://google.com/123", :category => "sports" [names as in categories.yml],
    #          :title => "good search engine", :description => "nice place to search information"
    #          ,:image_url => "http://google.com/images/googlelogo.jpg", :url_sha1 => "hjjscjcbjcjscbjdbc..",
    #          ,:mime => AppConstants.mime_remote_link, :provider => "google.com", :image_width => 220,
    #           :image_height => 320, :category_id => "sports", :category_type => "/sports",
    #          :element =>nil or "p" or "idiv" [divs without nesting] or "li"  or "td" or "tr" }

    def create_web_link(params)
       Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] entering #{params.inspect}")

       object = nil
       url = nil
       h = {}

       #swap canonical_url and url as canonical contains long url and "url" contains short url
       if !params[:canonical_url].blank? and params[:url] != params[:canonical_url]
         url = params[:url]

         params[:url] = params[:canonical_url]
         h = {:url_sha1 => Digest::SHA1.hexdigest(url), :url => url}

         Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] shorl url found #{params[:url]} => long form is #{params[:canonical_url]}" )

       end

       params.delete(:canonical_url)

       params[:url_sha1] = Digest::SHA1.hexdigest params[:url]

       if !params[:category_id].blank?
         params[:category_type] = SUMMARY_CATEGORIES[params[:category_id]]['type']
       else
         params[:category_type] = AppConstants.default_category
       end

       object = WebLink.where(:url_sha1 => params[:url_sha1]).first

       if !object.blank?
         #update object wth params if category_id is coming .. might be enriched url
         if !params[:category_id].blank? and object.category_id.blank?
           object.update_attributes(params)
         end

         Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] web_link found #{params.inspect}" )
         return object
       end


       if !params[:description].blank? and params[:description].length > AppConstants.url_description_length
         params[:description] = params[:description][0..AppConstants.url_description_length]
         Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] truncating description of #{url}")
       end

       object = create!(params)

       #now create short url entry
       if !object.blank? and !url.blank?
         Rails.logger.info("[MODEL] [WEB_LINKS] [create_web_link] Creating Short url #{url}")
         h[:web_link_id] = object.id
         ShortWebLink.create!(h)
       end

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
#  title           :text
#  description     :text
#  image_url       :text
#  image_width     :integer
#  image_height    :integer
#  documents_count :integer         default(0)
#  category_id     :text
#  category_type   :text
#  cache_age       :integer
#  created_at      :datetime        not null
#  updated_at      :datetime        not null
#

