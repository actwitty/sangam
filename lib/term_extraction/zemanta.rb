module TextExtraction
  class Zemanta

     ZEMANTA_ENDPOINT = "http://api.zemanta.com/services/rest/0.0/"
     ZEMANTA_API_KEY = "zlnboufb3ii9unbunrclum1r"
     ZEMANTA_DOCUMENT_LENGTH = 100 #50 Tweets => actual zemanta limit is 8 KB


     def self.create_document(text_hash)
       Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [create_document] entering => size > #{text_hash.size}")
       doc = []
       str = ""
       doc_hash = {}
       index = 0

       text_hash.each do |k,v|
         if (str + v).length > ZEMANTA_DOCUMENT_LENGTH
           doc.each_with_index do |elem, idx|
             pp elem
             hash = get_markupdata(elem)
             add_entities_to_text(hash,doc_hash)
           end
         else
           str = str + v + ". "
         end
       end
       Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [create_document] leaving => size > #{text_hash.size}")
     end

     def self.add_entities_to_text(hash, texts)
       Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [add_entities_to_text] entering => size > #{hash.size}")
       hash.each do |k,v|
         texts.each do |text|
           text.gsub!(/#{Regexp.quote(k)}/i, "ffffffff")
         end
       end
       Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [add_entities_to_text] leaving=> size > #{hash.size}")
  #     puts text_hash
     end

     def self.get_markupdata(query=nil)
       Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [get_markupdata] entering")

       entities = []
       params = {
             'text' => query, 'method' => 'zemanta.suggest_markup',
             'markup_limit' => 10, 'format' => 'json',
             'return_rdf_links' => 1,'return_categories'=> 'dmoz',
             'api_key' => ZEMANTA_API_KEY
       }


        request = [{:method => "post", :url => ZEMANTA_ENDPOINT, :params => params, :handle => 0}]


        response = {}
        response = ::EmHttp::Http.request(request)

        data = JSON.parse(response[0][:response])

        data["markup"]["links"].each do |item|
          entities << item["anchor"]
         # pp item["anchor"]
        end
        result=Freebase.search_freebase(entities)

        Rails.logger.info("[LIB] [TEXT_EXTRACTION] [ZEMANTA] [get_markupdata] leaving size #{result.size}")
      end

  end
end