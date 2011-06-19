require 'json'
require 'http_wrapper'



class Zemanta
  BASE_URL="http://api.zemanta.com/services/rest/0.0/"
  API_KEY="zlnboufb3ii9unbunrclum1r"

     class << self
       def get_suggestion_data(query=nil)
         get_response({'text' => query, 'method' => 'zemanta.suggest'})
       end

       def get_markup_data(query=nil)
         get_response({'text' => query, 'method' => 'zemanta.suggest_markup'})
       end

       def get_articles(response)
         articles=[]
         data = JSON.parse(response.body)

         data["articles"].each do |val|
         articles << {"title" => val["title"], "url" =>val["url"]}
         end
         return articles
       end

       def get_keywords(response)
         keywords=[]
         data= JSON.parse(response.body)

         data["keywords"].each do |val|
           keywords << val["name"]
         end
       return keywords
     end


       protected
         def get_response(options)
           parameters={'api_key' => API_KEY, 'format'=>'json','text' =>'', 'method' => 'zemanta.suggest'}.merge(options)
           response=HttpRequest.post(BASE_URL,{:method => :post , :parameters => parameters})
         end
    end
end

