module TermExtraction
  module Services
    class Zemanta

       ZEMANTA_ENDPOINT = "http://api.zemanta.com/services/rest/0.0/"
       ZEMANTA_API_KEY = "zlnboufb3ii9unbunrclum1r"

       def self.get_keywords_markup(query=nil)
         Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [get_keywords_markup] entering")

         keywords = []
         temp_query = query

         remove_mentions_and_tags(temp_query)

         params = {
               'text' => temp_query, 'method' => 'zemanta.suggest_markup',
               'markup_limit' => 100, 'format' => 'json',
               'return_rdf_links' => 1,'return_categories'=> 'dmoz',
               'api_key' => ZEMANTA_API_KEY
         }

         request = [{:method => "post", :url => ZEMANTA_ENDPOINT, :params => params, :handle => 0}]

         response = ::EmHttp::Http.request(request)

         data = JSON.parse(response[0][:response])
         data["markup"]["links"].each do |item|
           keywords << item["anchor"]
           # pp item["anchor"]
         end

         Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [get_keywords_markup] leaving size #{keywords.size}")
         keywords

       rescue => e
         Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [get_keywords_markup] **** RESCUE **** #{e.message} for #{query.inspect}")
         return []
       end

       #Removes the mentions and tags from text. Regex is OR for mentions and tags
       #TODO - NOT UTF8 Compliance
       def self.remove_mentions_and_tags(text)
         txt = text.gsub(/(@[\w\d]+[^\s])|(#[\w\d]+[^\s])/, "")
         txt = txt.strip
       end

    end
  end
end