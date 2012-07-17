require 'rubygems'  
require 'nokogiri'  
require 'open-uri'  
require 'domainatrix'
#require './common.rb'
#require './myem.rb'
#require 'rjb'


#BOILERPIPE_PATH = "/home/alok/work/boilerpipe-1.2.0"
#CLASSPATH = "#{BOILERPIPE_PATH}/lib/xerces-2.9.1.jar:#{BOILERPIPE_PATH}/build/demo:#{BOILERPIPE_PATH}/dist/boilerpipe-1.2.0.jar:#{BOILERPIPE_PATH}/lib/nekohtml-1.9.13.jar:#{BOILERPIPE_PATH}0/dist/boilerpipe-demo-1.2.0.jar"

#URL_META = YAML.load_file("./url_meta.yml")
#TAGS_LIST = YAML.load_file("./tags.yml")
LINK_RESOLUTION_BATCH_LIMIT = 25

IMAGE_EXTENSION = /.jpg$|.png$|.jpeg$|.bmp$|.gif$/

module LinkResolution
  module Services
    class Actwitty
      class << self
        def call_em(requests)
          #response = MyHttp.request(requests)
          response = ::EmHttp::Http.request(requests)
        end

        def get_domain(url)
          Domainatrix.parse(url)
        end

        def get_node_value_by_type(params)
          case params[:type]
            when "text"
              return params[:node].content
            when "content"
              return params[:node].attributes["content"].text
            when "name"
              return params[:node].attributes["name"].text
            when "class"
              return params[:node]["class"]
            when "id"
              return params[:node]["id"]
            when "href"
              return params[:node]["href"]
          end

          Rails.logger.info("[RAILS] [LIB] [SCREEN_SCRAP] [GET_NODE_VALUE_BY_TYPE] Return Nil")

          return nil
        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_NODE_VALUE_BY_TYPE] **** RESCUE **** #{e.message} ")
          nil
        end

        def get_node_value(params)

          if !params[:type].blank?
            return get_node_value_by_type(params)
          end
          if  !params[:node].content.blank?
            #puts "text"
            return params[:node].content
          elsif !params[:node].attributes["content"].blank?
            #puts "content"
            return params[:node].attributes["content"].text
          elsif !params[:node].attributes["name"].blank?
            #puts "name"
            return params[:node].attributes["name"].text
          elsif !params[:node]["class"].blank?
            #puts "class"
            return params[:node]["class"]
          elsif !params[:node]["id"].blank?
            #puts "id"
            return params[:node]["id"]
          elsif !params[:node]["href"].blank?
            #puts "href"
            return params[:node]["href"]
          end

          Rails.logger.info("[RAILS] [LIB] [SCREEN_SCRAP] [GET_NODE_VALUE] Return Nil")

          return nil
        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_NODE_VALUE] **** RESCUE **** #{e.message} ")
          nil
        end


        def process_node(params)

          array, value, type= [], nil, nil

          #Rails.logger.info("[RAILS] [LIB] [SCREEN_SCRAP] [PROCESS_NODE] Entering ")

          if !params[:meta].blank?
            if !params[:meta]["tag"].blank?
              array <<  params[:meta]["tag"]["name"]
              type =  params[:meta]["tag"]["type"]
            end
          end

          if !params[:default_tags].nil?
            array = array + params[:default_tags]
          end

          array.each do |tag|
            node = params[:document].at_css(tag)
            next if node.nil?
            value= get_node_value(:node => node, :type => type)
            break if !value.nil?
          end

          #Rails.logger.info("[RAILS] [LIB] [SCREEN_SCRAP] [PROCESS_NODE] Leaving #{value} ")

          return value

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [PROCESS_NODE] **** RESCUE **** #{e.message} ")
          nil
        end

        def get_title(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_TITLE] Entering")
          value = process_node(params)
          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_TITLE] Leaving")

          params[:output]["title"] = value

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_TITLE] **** RESCUE **** #{e.message} ")
          nil
        end

        def get_content(params)
          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_CONTENT] Entering")

          klass = Rjb::import('de.l3s.boilerpipe.demo.Oneliner')

          params[:output]["content"] = klass.check(["alok"])

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_CONTENT] Leaving")

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_CONTENT] **** RESCUE **** #{e.message} ")
          nil
        end

        def get_description(params)
          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_DESCRIPTION] Entering")

          value = process_node(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_DESCRIPTION] Leaving")

          params[:output]["description"] = value

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_DESCRIPTION] **** RESCUE **** #{e.message} ")
          nil
        end
        def get_favicon(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_FAVICON] Entering")

          value = process_node(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_FAVICON] Leaving")

          #relative to absolute url
          if (value =~ /^\/[\w.\/]+/) and  (!params[:root_url].nil?)
            value = params[:root_url] + value
          end

          params[:output]["favicon"] = value
        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_FAVICON] **** RESCUE **** #{e.message} ")
          nil
        end


        def get_author_name(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_AUTHOR_NAME] Entering")

          author = process_node(params)

          # Strip off any "By [whoever]" section
          if String == author.class

            author.sub!(/^(post(ed)?\s)?by\W+/i, '')
            #author.tr!('^a-zA-Z0-9\'', '|')
            author = author.split(/\|{2,}/).first.to_s
            author.gsub!(/\s+/, ' ')
            author.gsub!(/\|/, '')
            author.strip!
          elsif Array == author.class
            author.map! { |a| a.sub(/^(post(ed)?\s)?by\W+/i, '') }.uniq!
          end

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_AUTHOR_NAME] Leaving")

          params[:output]["author_name"] = author

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_AUTHOR_NAME] **** RESCUE **** #{e.message} ")
          nil
        end

        def get_image_url(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [IMAGE_URL] Entering")

          img_url = nil
          value = process_node(params)

          if value.nil? and (!params[:base_url].nil?)

            image = {:image => nil, :area => 0 }
            nodes = params[:document].css('img')

            nodes.each do |img|

              width, height, area = 1, 1, 1

              url = img['src']

              #relative to absolute url
              if (img['src'] =~ /^\/[\w.\/]+/) and (!params[:root_url].nil? )
                url = params[:root_url] + img['src']
              end

              #first match the domain
              if url =~ /#{params[:base_url]}/ and img['src'] =~ IMAGE_EXTENSION

                width = img['width'].to_i if !img['width'].nil?
                height = img['height'].to_i if !img['height'].nil?
                area = width * height
                image = {:image => url, :area =>area } if area > image[:area]
              end
            end
            value = image[:image] if !image[:image].nil?
          end

          #relative to absolute url
          if (value =~ /^\/[\w.\/]+/) and  (!params[:root_url].nil?)
            value = params[:root_url] + value
          end

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [IMAGE_URL] Leaving")
          params[:output]["image_url"] = value
        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [IMAGE_URL] **** RESCUE **** #{e.message} ")
          nil
        end


        def get_oembed(params)

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_OEMBED] **** RESCUE **** #{e.message} ")
          nil
        end

        # Returns URL(s) of Web feed(s)
        def get_feed(params)

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_FEED] Entering")

          url = process_node(params)

          if url && String === url && url !~ /^http/ && params[:url]
            url = URI.join(params[:url] , url).to_s
          elsif url && Array === url
            url.map! do |u|
              if u !~ /^http/ && params[:url]
                URI.join(params[:url], u).to_s
              else
                u
              end
            end
            url.uniq!
          end

          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_FEED] Leaving")
          params[:output]["feed"] = url

        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_FEED] **** RESCUE **** #{e.message} ")
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

          value = process_node(params)

          #for Mashable case where category comes as "page-container business"
          if !params[:meta].blank? and !params[:meta]["tag"].blank? and !params[:meta]["tag"]["word_index"].blank?
            delimiter = params[:meta]["tag"]["delimiter"]
            delimiter = /\s/ if delimiter.nil?
            value = value.split(delimiter)[params[:meta]["tag"]["word_index"]]
          end
          #Rails.logger.info(" [RAILS] [LIB] [SCREEN_SCRAP] [GET_CATEGORY] Leaving")

          params[:output]["category"] = value
        rescue => e
          Rails.logger.error("[RAILS] [LIB] [SCREEN_SCRAP] [GET_CATEGORY] **** RESCUE **** #{e.message} ")
        end


        def resolve_links(links)
          Rails.logger.info("[LIB] [SCREEN_SCRAP] [RESOLVE_LINKS] Entering => Number of Links => #{links}.size}")

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
                        "image_url" => nil,
                        "image_width" => nil,
                        "image_height" => nil,
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
                r_a = call_em([{:url => c_url, :params => {:redirects => 3}, :method => "get", :handle => c_url}])
                response = r_a[0]
              end

              #if parameters are there then no need to resolve that url
              if response[:handle] =~ /\S+\?\S+/
                c_url =response[:handle]
              end

              output["url"] = response[:handle]
              output["canonical_url"] = c_url

              domain, base_url, root_url = nil,nil,nil

              url_info = get_domain(c_url)
              if !url_info.nil?
                domain = url_info.domain
                base_url = url_info.domain + "." + url_info.public_suffix
                root_url = url_info.scheme+"://"+url_info.subdomain+"."+ base_url
              end

              url_meta = nil
              url_meta = URL_META[domain] if !domain.blank?

              doc = Nokogiri::HTML(response[:response])

              if !url_meta.blank? and !url_meta[:oembed].blank?
                get_oembed(:document => doc,
                           :output => output,
                           :endpoint => url_meta[:oembed][:endpoint],
                           :regex => url_meta[:oembed][:regex],
                           :query => url_meta[:oembed][:query] )
              end

              #Rjb::load(classpath = CLASSPATH, jvmargs=[])

              hash[response[:handle]] =  {
                                             :url => response[:handle],
                                             :canonical_url =>  c_url,
                                         }

              [ "title", "description", "image_url", "author_name", "favicon", "element" , "category" ].each do |attr|

                meta = nil
                if !url_meta.nil? and !url_meta[attr].nil?
                  meta = url_meta[attr]
                end

                tags = TAGS_LIST[attr]

                send("get_#{attr}",{
                                      :url => c_url,
                                      :document => doc,
                                      :output => output,
                                      :meta => meta,
                                      :root_url => root_url,
                                      :base_url =>  base_url,
                                      :default_tags => tags
                                   }
                    )

                hash[response[:handle]][attr.to_sym] = output[attr]
              end
            end
          end
          Rails.logger.info("[LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] Leaving")
          hash
        rescue => e
          Rails.logger.error(" [LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] **** RESCUE **** => #{e.message}")
            puts e.backtrace
          {}
        end
      end
    end
  end
end
#CSS_SELECTOR = 'nav#local > div.page-container' #mashable
#CSS_SELECTOR = 'div.post-category-name > h3 > a' #techcrunch
#CSS_SELECTOR = 'p.categories'
URL =["http://t.co/eEjZRiwv", "http://t.co/fIrcVHcM", "http://t.co/p3NlGFZt"]
#URL = "http://techcrunch.com/2012/05/09/cloud-storage-service-pogoplug-goes-after-business-users-with-launch-of-pogoplug-for-teams/"
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
        hash = ScreenScrap.resolve_link( :urls => URL)
        puts hash
      }.resume
    }
    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end
