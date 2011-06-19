require 'http_wrapper'
require 'json'



class Freebase
MQL_URL= 'http://api.freebase.com/api/service/mqlread'
SEARCH_URL = 'http://api.freebase.com/api/service/search'

    class << self
    
      def get_mqlquery_data(options)

        query = [{'id'=> nil,'name'=>nil, 'type'=> nil}.merge(options)]     
        query_envelope = {'query' => query }
        parameters ={'query'=>query_envelope.to_json}
        get_response(MQL_URL,parameters)

        
      end    

      def get_search_data(text)
        mql_output=[{'guid'=>nil,
							'name'=>nil,
							'mid'=>nil,
							'/common/topic/alias'=>[],
							'/common/topic/image'=>[{'id'=>nil, 'optional'=>true}],
              'key'=>{'namespace'=>'/wikipedia/en_id','value'=>nil,'optional'=>true},
							'type'=>[{'id'=>nil,'name'=>nil,'optional'=>true}]
				}]
        parameters={'query'=>text,'mql_output'=>mql_output.to_json}
        get_response(SEARCH_URL,parameters)
      end



       protected
          def get_response(url,parameters)
            HttpRequest.post(url,{:method=>:post,:parameters=>parameters})
          end

    end
end
