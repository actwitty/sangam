module QueryManager

require 'zemanta_wrapper'
require 'freebase_wrapper'

	def titlecase str
      non_capitalized = %w{of etc and by the for on is at to but nor or a via}
      str.gsub(/\b[a-z]+/){ |w| non_capitalized.include?(w) ? w : w.capitalize  }.sub(/^[a-z]/){|l| l.upcase }.sub(/\b[a-z][^\s]*?$/){|l| l.capitalize }
   end

	def freebase_search(text)
    entity={"name"=>text,"mid"=>nil}
		response=Freebase.get_search_data(text)
		data=JSON.parse(response.body)
		unless data["status"]=="200 OK"
			return entity
		end
		data["result"].each do |item|
     	if item["name"]==nil
    		next
     	elsif text.casecmp(item["name"])==0
				entity=item
				break	
			else
				alt=item["/common/topic/alias"].select {|l| text.casecmp(l)==0}
				unless alt.empty?
					entity=item
					break
				end
 			end
		end
		return entity
	end

	def get_freebase_data(item)
   filter_count=1
   max_filter_count=2
 	 result=freebase_search(item["anchor"])

	 while (result["mid"]==nil)&&(filter_count<=max_filter_count) do
     case filter_count
			when 1
				type="wikipedia"
			when 2
				type="imdb"
		end
		link=item["target"].select {|l| l["type"]==type}
		unless link.empty?
			result=freebase_search(link[0]["title"])
		end
    filter_count+=1
   end
		result["name"]=item["anchor"]
		return result
	end


  def zemanta_get_markup_entity (query,entities,markupName)
		response=Zemanta.get_markup_data(query)
    data=JSON.parse(response.body)
    unless (data["status"]=="ok")
			return entities
		end
    
		data["markup"]["links"].each do |item|
      result=get_freebase_data(item)
			entities << result
			markupName << item["anchor"]
#===================================================
			puts "Markup: #{item["anchor"]}"
			puts result
			print "\n"
#===================================================
		end
		return entities
  end

  def zemanta_get_suggestion_entity(query,entities,markupName)
		response=Zemanta.get_suggestion_data(query)
		data=JSON.parse(response.body)
    unless data["status"]=="ok"
			return entities
		end

		data["keywords"].each do |item|
			if query=~/#{item["name"]}/i
        alt=markupName.select {|l| item["name"].casecmp(l)==0}
				if alt.empty?
					result=freebase_search item["name"]
					entities << result
#=======================================================
					puts "Suggestion:#{item["name"]}"
				  puts result
   				print "\n"
#=======================================================
				end
			end	
		end
	
	end

  

	def entities_adapter(query)
    markupName=[]
    entities=[]

    formatted_query=titlecase(query)+"\n"+query
    zemanta_get_markup_entity(formatted_query,entities,markupName)
    zemanta_get_suggestion_entity(formatted_query,entities,markupName)
    
		return entities

  end

  def get_entities(query)
    entities_adapter(query)
  end

end
