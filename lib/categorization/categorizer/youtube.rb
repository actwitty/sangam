require 'uri'
require 'nokogiri'
require 'json'

module Categorization
  module Categorizer
    class Youtube

      YOUTUBE_GDATA_BATCH_URL="https://gdata.youtube.com/feeds/api/videos/batch"

      YOUTUBE_POST_DATA="<feed xmlns='http://www.w3.org/2005/Atom'
            xmlns:media='http://search.yahoo.com/mrss/'
            xmlns:batch='http://schemas.google.com/gdata/batch'
            xmlns:yt='http://gdata.youtube.com/schemas/2007'>
            <batch:operation type='query'/>"

      YOUTUBE_BATCH_LIMIT = 49
      YOUTUBE_RATE_LIMIT = 1

      YOUTUBE_BASE_URL = 'http://www.youtube.com/watch?v='

      def self.call_em(requests)
        response = ::EmHttp::Http.request(requests)
      end


      def self.data_adaptor(response, category)
        doc= Nokogiri::XML(response)

        doc.xpath("//atom:category").each do |t|
          if t['label'] && t['scheme']=='http://gdata.youtube.com/schemas/2007/categories.cat'
               url = YOUTUBE_BASE_URL + t.parent.children.first.content.split('/')[-1]
               cat = MAP_CATEGORIES['youtube'][t['label'].downcase]
               category[url] = cat[0] if !cat.blank?
          end
        end
      end


      def self.categorize(links)

        Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [YOUTUBE] [categorize] Entering => Number of links #{links.size}")

        if links.blank?
           Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [CATEGORIZER] [YOUTUBE] [categorize]  =>
                               Return blank as no links ")
           return {}
        end

        url_arrays = links.enum_for(:each_slice,  YOUTUBE_BATCH_LIMIT).to_a
        url_sets = url_arrays.enum_for(:each_slice,  YOUTUBE_RATE_LIMIT).to_a

        request_array = []
        hash = {}

        post_data=YOUTUBE_POST_DATA

        base_len =  post_data.length

        url_sets.each do |url_set|
          url_set.each_with_index do |url_array, idx|
            url_array.each do |url|
              videoid=url.match(/v=([^&]*)/)[1]
              #TODO blank
              next if videoid.nil?

              post_data=post_data +
                "<entry>
                    <id>http://gdata.youtube.com/feeds/api/videos/#{videoid}</id>
                </entry>"
            end
            post_data=post_data+"</feed>"
            if post_data.length > base_len
              request_array << {:url => YOUTUBE_GDATA_BATCH_URL, :params =>  {:body => post_data, :head => {'content-type' => 'application/atom+xml'}}, :method => "post", :handle => idx}
            end
            post_data=YOUTUBE_POST_DATA
          end

          response_array = []

          response_array=call_em(request_array) if !request_array.blank?

          request_array = []

          response_array.each do |response|
            data_adaptor(response[:response], hash)
          end
        end

        Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [YOUTUBE] [categorize] Leaving => Size => #{hash.size} ")

        return hash
      rescue => e
        Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [YOUTUBE] [categorize] Rescue ==> #{e.message}")
        return {}
      end
    end
  end
end




















