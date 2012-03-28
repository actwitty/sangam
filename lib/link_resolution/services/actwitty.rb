require 'uri'
require 'nokogiri'
require 'enumerator'

LINK_RESOLUTION_BATCH_LIMIT = 25
module LinkResolution
  module Services
    class Actwitty < Nokogiri::XML::SAX::Document

      def initialize
        @element_hash = Hash.new;@active_elements = Array.new
        @character_length=0;@isTitle=false;@title_string=nil
        @content_string=nil;@image=nil
      end

      def start_document()
      end

      def start_element(name , attributes=[])
        case name
        when "title"
          @isTitle = true
        when "meta"
          if @content_string.nil? || @image.nil?
            attr = Hash[attributes]
            if @content_string.nil? && attr["name"] == "description"
              @content_string = attr["content"]
            elsif @image.nil? && attr["property"] == "og:image"
              @image = attr["content"]
            end
          end
        when "link"
          if @image.nil?
            attr = Hash[attributes]
            if(attr["rel"] =~ /.*apple-touch-icon.*/) ||(attr["rel"] == "image_src")
              @image = attr["href"]
            end
          end
        when "img"
          if @image.nil?
            attr = Hash[attributes]
            if attr["src"] =~ /.*logo.*/
              @image = attr["src"]
            elsif !@title_string.blank? && !attr["alt"].blank?
              #Alok modified it
              if Regexp.escape(@title_string).match(Regexp.escape(attr["alt"]))
					      @image = attr["src"]
              end
            end
          end
        else
        end
        @active_elements << name
      end

      def characters(string)
        if @isTitle == true
          if @title_string.nil?
            @title_string = string
          else
            @title_string << string
          end
        end
        @character_length  = @character_length + string.length
      end

      def end_element(name)
        if name == "title"
          @isTitle = false
        elsif name =="div"
          if @element_hash.has_key?("idiv")
            @element_hash["idiv"] = @element_hash["idiv"] + @character_length
          else
            @element_hash["idiv"] = @character_length
          end
        end

        elem_arr=@active_elements.uniq
        elem_arr.each do |elem|
          if @element_hash.has_key?(elem)
            @element_hash[elem] = @element_hash[elem] + @character_length
          else
            @element_hash[elem] = @character_length
          end
        end
        @active_elements.delete_at(@active_elements.index(name))
        @character_length = 0
      end

      def end_document()
        #puts @title_string
        #puts @content_string
        #puts @image
        #puts @element_hash
      end

      def get_title()
        @title_string
      end

      def get_description()
        @content_string
      end

      def get_image()
        @image
      end

      def get_element_hash()
        hash_elem={"p" => true,"li" => true,"td" => true,"tr" => true,"idiv" => true}
        max = 0
        elem = "div"
        @element_hash.each do |k,v|
          if !hash_elem[k].nil?
            if v > max
              max = v
              elem = k
            end
          end
        end
        elem
      end

      def get_link_info(links)

        Rails.logger.info("[LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] Entering => Number of Links => #{links.size}")

        if links.blank?
           raise "Return blank as no links "
        end


        hash = {}
        url_arrays = links.enum_for(:each_slice,  LINK_RESOLUTION_BATCH_LIMIT).to_a

        url_arrays.each do |url_array|
          request_array = []
          url_array.each_with_index do |url, idx|
            request_array << {:url => url, :params => {:redirects => 2}, :method => "get", :handle => url}
          end
          response_array=::EmHttp::Http.request(request_array)

          response_array.each do |response|

            #c_url = response[:request].uri.scheme+ "://"+response[:request].uri.host+response[:request].uri.path
            c_url = response[:request].uri.to_s

            cgi = CGI::parse(c_url)

            #this is used when actual url is part of query parameters like
            #http://t.co/Rty767 => http://news.google.com/url?date=12122011&url=http://xyz.com/345"
            if !cgi["url"].blank?
              c_url = cgi["url"][0]
              r_a = ::EmHttp::Http.request([{:url => c_url, :params => {:redirects => 2}, :method => "get", :handle => c_url}])
              response = r_a[0]
            end

            #if parameters are there then no need to resolve that url
            if response[:handle] =~ /\S+\?\S+/
              c_url =response[:handle]
            end

            html_handler=Actwitty.new
            parser = Nokogiri::HTML::SAX::Parser.new(html_handler)
            parser.parse(response[:response])

            str = "DIV"
            element =  html_handler.get_element_hash
            (element == nil) or (element == 'idiv') ? str = "DIV" : str = element.upcase

            hash[response[:handle]] =  {
                                         :url => response[:handle],
                                         :canonical_url =>  c_url,
                                         :title => html_handler.get_title, :description => html_handler.get_description,
                                         :image_url => html_handler.get_image, :element => str
                                      }
          end
        end
        Rails.logger.info("[LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] Leaving")
        hash
      rescue => e
        Rails.logger.error(" [LIB] [LINK_RESOLUTION] [ACTWITTY] [RESOLVE_LINKS] **** RESCUE **** => #{e.message}")
        {}
      end

      def self.resolve_links(links)
        obj = Actwitty.new
        obj.get_link_info(links)
      end
    end
  end
end



