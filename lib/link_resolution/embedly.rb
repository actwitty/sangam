module LinkResolution
  class Embedly

    EMBED_LY_URL="http://api.embed.ly/1/preview"
    EMBED_LY_BATCH_LIMIT =10
    EMBED_LY_RATE_LIMIT = 1
    EMBED_LY_KEY = '4acd3f78235211e1a6ba4040d3dc5c07'
    EMBED_LY_DESCRIPTION_LIMIT = 2048


    def self.call_em(requests)
      response = ::EmHttp::Http.request(requests)
    end

    def self.data_adaptor(response)
       #we are using cannonical url as it can be different from url
       if !response["error_message"].blank?
         return {}
       end

       #canonical url is actual converted url may be from short urls
       h = {
         :provider => response["provider_url"], :description => response["description"], :name => response["title"],
         :url => response["original_url"],:canonical_url => response["url"], :cache_age => response["cache_age"]
          }
      response["images"].each do |img|
        h[:image_url] = img["url"]
        h[:image_width] = img["width"]
        h[:image_height] = img["height"]
        break
      end
       h
    end

    def self.resolve_links(links)
      Rails.logger.info("[LIB] [LINK_RESOLUTION] [EMBEDLY] [RESOLVE_LINKS] entering => Number of link => #{links.size}")

      if links.blank?
         Rails.logger.info(" [LIB] [LINK_RESOLUTION] [EMBEDLY] [RESOLVE_LINKS] => Return blank as no links ")
         return {}
      end

      url_arrays = links.enum_for(:each_slice,  EMBED_LY_BATCH_LIMIT).to_a
      url_sets = url_arrays.enum_for(:each_slice,  EMBED_LY_RATE_LIMIT).to_a

      hash = {}
      request_array = []

      query_url=EMBED_LY_URL+"?key=#{EMBED_LY_KEY}&urls="

      base_len =  query_url.length

      url_sets.each do |url_set|
        url_set.each_with_index do |url_array, idx|
          url_array.each do |url|
            query_url=query_url+"#{url}"+","
          end
          if query_url.length > base_len
            query_url.chop!
            query_url = query_url + "&chars=#{EMBED_LY_DESCRIPTION_LIMIT}"
            request_array << {:url => query_url, :params => nil, :method => "get", :handle => idx}
            last_url = query_url
          end
          query_url=EMBED_LY_URL+"?key=#{EMBED_LY_KEY}&urls="
        end

        response_array=call_em(request_array)

        request_array = []

        response_array.each do |response|
          data= JSON.parse(response[:response])
          data.each do |attr|
            h = data_adaptor(attr)
            hash[h[:url]] = h if !h[:url].blank?
          end
        end
      end
      Rails.logger.info("[LIB] [LINK_RESOLUTION] [EMBEDLY] [RESOLVE_LINKS] leaving => Number of results => #{hash.size}")
      hash

    rescue => e
      Rails.logger.error("[LIB] [LINK_RESOLUTION] [EMBEDLY] [RESOLVE_LINKS] ERROR => Rescue #{e.message}")
      return {}
    end
  end
end
