require 'rubygems'  
require 'nokogiri'  
require 'open-uri'  
require 'domainatrix'
require './common.rb'
require './myem.rb'


URL_META = YAML.load_file("./url_meta.yml")
TAGS_LIST = YAML.load_file("./tags.yml")
class ScreenScrap
  class << self
    def call_em(requests)
      response = MyHttp.request(requests)
      #response = ::EmHttp::Http.request.request(requests)
    end 

    def get_domain(url)
      Domainatrix.parse(url).domain
    end

    #deserialize lambdas and proc stored in yaml
    def deserialize_tags(tags)

      tags.each do |attr|
        if attr.class == Array
          attr.each_with_index do |elem, index|
            if elem =~ /^lambda|^Proc/
              attr[index] =eval(elem)
            end
          end
        end
      end
    end
 
    def get_value(params)
      case params[:type]
      when "class"
        return params[:child]["class"]
      when "id"
        return params[:child]["id"]
      when "property"
        return params[:child].attributes["content"]
      when "text"
        return params[:child].text
      end
      nil
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_VALUE] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_item(params)
      item = nil
      params[:node].each do |node|
        params[:child] = node
        item = get_value(params)
        break if item.nil?
      end
      item
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_ITEM] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_title(params)

      title = nil

      if !params[:tag].nil?
        params[:node] = params[:document].css(params[:tag])
        title = get_item(params)
      else
        title = params[:document].match(params[:default_tags], false )
      end
      title
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_TITLE] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_description(params)

      description = nil
      if !params[:tag].nil?
        params[:node] = params[:document].css(params[:tag])
        description = get_item(params)
      else
        description = params[:document].match(params[:default_tags], false )
      end
      description
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_DESCRIPTION] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_favicon(params)

      favicon = nil
      if !params[:tag].nil?
        params[:node] = params[:document].css(params[:tag])
        favicon = get_item(params)
      else
        favicon = params[:document].match(params[:default_tags], false )
      end
      favicon
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_FAVICON] **** RESCUE **** #{e.message} ")
      nil
    end


    def get_author(params)

      author = nil

      if !params[:tag].nil?
        params[:node] = params[:document].css(params[:tag])
        author = get_item(params)
      else
        author = params[:document].match(params[:default_tags], false )
      end
      author

    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_AUTHOR] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_url(params)

      url = nil

      if !params[:tag].nil?
        params[:node] = params[:document].css(params[:tag])
        url = get_item(params)
      else
        url = params[:document].match(params[:default_tags], false )
      end
      url

    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_URL] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_thumbnail(params)

      #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_THUMBNAIL] Entering")

      thumbnail, tag, type = nil, nil, nil

      #get tag for thumbnail
      if !params[:meta].blank?
        tag = params[:meta][:tag]
        type = params[:meta][:type]
      end

      if !tag.nil? and !type.nil?
        node = params[:document].css(tag)
        thumbnail = get_item(:node => node, :tag => tag, :type => type)
      else
        thumbnail = params[:document].match(params[:default_tags], false )
      end

      #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_THUMBNAIL] Leaving")

      params[:output]["thumbnail_url"] = thumbnail
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_IMAGE] **** RESCUE **** #{e.message} ")
      nil
    end


    def get_oembed(params)

    end

    # Returns URL(s) of Web feed(s)
    def get_feed(all = false)
      url = nil
      if !params[:tag].nil?
        params[:node] = params[:document].css(params[:tag])
        url = get_item(params)
      else
        url = params[:document].match(params[:default_tags], false )
      end

      if url && String === url && url !~ /^http/ && @url
        url = URI.join(@url , url).to_s
      elsif url && Array === url
        url.map! do |u|
          if u !~ /^http/ && @url
            URI.join(@url, u).to_s
          else
            u
          end
        end
        url.uniq!
      end

      url
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_IMAGE] **** RESCUE **** #{e.message} ")
      nil
    end

    def get_element(params)
      #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_ELEMENT] Entering")

      params[:output]["element"] = "DIV"
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_ELEMENT] **** RESCUE **** #{e.message} ")
    end


    def get_category(params)

      #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_CATEGORY] Entering")

      category, tag, type = nil, nil, nil


      #check if this link is categorized at source like mtv to entertainment
      if !params[:meta].blank?
        if !params[:meta][:fixed].blank?
          params[:output]["category"] =  params[:meta][:fixed]
          return
        end
        tag = params[:meta][:tag]
        type = params[:meta][:type]
      end

      #check if tag and type exist for this domain to pick categories from
      if !tag.nil? and !type.nil?
        params[:node] = params[:document].css(tag)
        category = get_item(:node => params[:node], :type => type)

        #for Mashable case where category comes as "page-container business"
        category = category.split(/\/s/)[params[:split_index]] if !params[:split_index].blank? and !category.blank?
      end

      #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_CATEGORY] Leaving")

      params[:output]["category"] = category
    rescue => e
      Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_CATEGORY] **** RESCUE **** #{e.message} ")
    end


    def resolve_link(params)
      Rails.logger.info("[LIB] [SCREEN_SCRAP] [RESOLVE_LINKS] Entering => Number of Links => #{links.size}")

      links = params[:urls]

      if links.blank?
         raise "Return blank as no links "
      end

      hash = {}
      url_arrays = links.enum_for(:each_slice,  LINK_RESOLUTION_BATCH_LIMIT).to_a

      url_arrays.each do |url_array|
        request_array = []

        url_array.each_with_index do |url, idx|
          request_array << {:url => url, :params => {:redirects => 3}, :method => "get", :handle => url}
        end
        response_array=call_em(request_array)

        response_array.each do |response|

          output = {
                    "version" => nil,
                    "type" => nil,
                    "width" => nil,
                    "height" => nil,
                    "title" => nil,
                    "url" => nil,
                    "canonical_url" => nil,
                    "author_name" => nil,
                    "author_url" => nil,
                    "provider_name" => nil,
                    "provider_url" => nil,
                    "cache_age" => nil,
                    "thumbnail_url" => nil,
                    "thumbnail_width" => nil,
                    "thumbnail_height" => nil,
                    "html" => nil,
                    "category" => nil,
                    "element" => "DIV" #element with maximum text
                 }
          uri = response[:request].uri

          c_url=uri.to_s.gsub(/:\d+/,"")

          cgi = CGI::parse(c_url)

          #this is used when actual url is part of query parameters like
          #http://t.co/Rty767 => http://news.google.com/url?date=12122011&url=http://xyz.com/345"
          if !cgi["url"].blank?
            c_url = cgi["url"][0]
            r_a = call_em([{:url => c_url, :params => {:redirects => 2}, :method => "get", :handle => c_url}])
            response = r_a[0]
          end

          #if parameters are there then no need to resolve that url
          if response[:handle] =~ /\S+\?\S+/
            c_url =response[:handle]
          end

          output["url"] = response[:handle]
          output["canonical_url"] = c_url

          domain = get_domain(c_url)

          url_meta = nil
          url_meta = URL_META(domain) if !domain.blank?

          doc = Nokogiri::HTML(response[:response])

          if !url_meta.blank? and !url_meta[:oembed].blank?
            get_oembed(:document => doc,
                       :output => output,
                       :endpoint => url_meta[:oembed][:endpoint],
                       :regex => url_meta[:oembed][:regex],
                       :query => url_meta[:oembed][:query] )
          end

          ["title", "description", "thumbnail", "author", "favicon", "element" , "category"].each do |attr|

            meta = nil
            if !url_meta[attr.to_sym].blank?
              meta = url_meta[attr.to_sym]
            end
            send("get_#{attr}",{
                                  :document => doc,
                                  :output => output,
                                  :meta => meta,
                                  :query => params[:query]
                               }
                )

          end
        end
      end
      Rails.logger.info("[LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] Leaving")
      hash
      rescue => e
        Rails.logger.error(" [LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] **** RESCUE **** => #{e.message}")
        {}
      end
  end
end
#CSS_SELECTOR = 'nav#local > div.page-container' #mashable
#CSS_SELECTOR = 'div.post-category-name > h3 > a' #techcrunch
#CSS_SELECTOR = 'p.categories'
#URL ="http://mashable.com/2012/05/12/ashton-kutcher-as-steve-jobs/"
URL = "http://techcrunch.com/2012/05/09/cloud-storage-service-pogoplug-goes-after-business-users-with-launch-of-pogoplug-for-teams/"
#URL = "https://foursquare.com/v/sonesta-residency/4bcb47cc3740b7138d216265?target=share&twitter=true&twitterOptions=true&oauth_token=DE18WYY40LnLqi5smEiutgzzWXgEQbbc9rtxko4s1NI&oauth_verifier=hf25EHoQGyyEsAoooGomiXW0flj9yNkZ2MOhpCrj8HE"
#URL = "http://t.co/PHI1fWO1"
#URL = "http://www.comedycentral.com/video-clips/293sza/the-half-hour-the-half-hour---the-trailer"

def run_em
  if !EM.reactor_running?
    Thread.new {
      EM.run {}
    }
    end  
 end
if __FILE__ == $0
  while true
    out = STDIN.readline
    out = out.gsub(/\n/,"")
    run_em
    EM.next_tick {
      Fiber.new { 
        ScreenScrap.process_doc( {:url =>URL })
      }.resume
    }
    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end
