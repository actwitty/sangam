module TermExtraction
  module Services
    class Freebase

      FREEBASE_MQL_URL= 'http://api.freebase.com/api/service/mqlread'

      FREEBASE_BATCH_LIMIT = 50
      FREEBASE_RATE_LIMIT = 1

      FREEBASE_TYPE_LIMIT = 5
      FREEBASE_RESULT_LIMIT = 1

      SKIP_TYPES = /\/type|\/common|\/base|\/people\/person|\/influence|\/user/

      def self.search_freebase(entities)

         Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [Freebase] [search_freebase] entering => size => #{entities.size}")
         query_envelopes={}
         i=0

         hash = {}
         request_array = []
         key = 0
         name = nil

         entity_arrays = entities.enum_for(:each_slice,  FREEBASE_BATCH_LIMIT).to_a
         entity_sets = entity_arrays.enum_for(:each_slice,  FREEBASE_RATE_LIMIT).to_a


         entity_sets.each do |e_a|
           e_a.each_with_index do |es, idx|
             es.each do |entity|
               query={'extended'=>1, 'query'=>[{"search"=> { "query"=> entity, "id"=> nil, "score"=> nil }, "type"=> [{"id"=> nil,"name" => nil}], "name"=>nil,
                "sort"=> "-search.score",'limit'=> FREEBASE_RESULT_LIMIT,  }]}
               query_envelopes[key]=  query
               key += 1
             end
             request_array << {:url => FREEBASE_MQL_URL, :method => "post", :params => {'queries'=>query_envelopes.to_json}, :handle => idx}
           end

           response=::EmHttp::Http.request(request_array)
           data=JSON.parse(response[0][:response])

           #pp data
           #this just picking one top ranked entity
           #need to make it contextual
           data.each do |k,v|
             result = v['result']
             if !result.blank?
               name = result[0]['name']
               query = result[0]['search']['query']

               if !name.blank? #and (name.downcase == query.downcase)

                 hash[name] = {} if hash[name].blank?
                 hash[name][:name]=result[0]['name']
                 hash[name][:id]=result[0]['search']['id'] #adding freebase to make it domain specific
                 hash[name][:svc] ="freebase"

                 result[0]['type'].each do |type|
                   next if type["id"] =~ SKIP_TYPES
                   hash[name][:type] = {:id => type["id"], :name => type["name"]}
                   break
                 end
               end
             end
           end
         end

         Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [Freebase] [search_freebase] leaving ==> Size ==> #{hash.size}")

         hash
      rescue => e
        Rails.logger.error("[MODULE] [TEXT_EXTRACTION] [Freebase] [search_freebase] **** RESCUE **** => #{e.message}")
        return {}
      end
    end
  end
end
