module QueryManager

require 'zemanta_wrapper'
require 'freebase_wrapper'

 ENGLISH_STOP_WORDS= %w{a about above across after afterwards again against all almost alone along already also although always am among amongst amoungst amount an and another any anyhow anyone anything anyway anywhere are around as at back be became because become becomes becoming been before beforehand behind being below beside besides between beyond bill both bottom btw but by call can cannot cant co computer con could couldnt cry de describe detail do done down due during each eg eight either eleven else elsewhere empty enough etc even ever every everyone everything everywhere except few fifteen fify fill find fire first five for former formerly forty found four from front full further get give go had has hasnt have he hence her here hereafter hereby herein hereupon hers him his how however hundred i ie if in inc indeed interest into is it its keep last latter latterly least less ltd made many may me meanwhile might mill mine more moreover most mostly move much must my name namely neither never nevertheless next nine no nobody none noone nor not nothing now nowhere of off often on once one only onto or other others otherwise our ours ourselves out over own part per perhaps please put rather re same see seem seemed seeming seems serious several she should show side since sincere six sixty so some somehow someone something sometime sometimes somewhere still such system take ten than that the their them themselves then there thereafter thereby therefore therein thereupon these they thick thin third this those though three through throughout thru thus to together too top toward towards twelve twenty two un under until up upon us very via was we well were what whatever when whenever where whereafter whereas whereby wherein whereupon wherever whether which while whither who whoever whole whom whose why will with within without would yet you your yours yourself yourselves}


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
=begin
			else
				alt=item["/common/topic/alias"].select {|l| text.casecmp(l)==0}
				unless alt.empty?
					entity=item
					break
				end
=end
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
    unless result["/common/topic/image"].empty?
       result["/common/topic/image"]=result["/common/topic/image"].take(1)
       result["/common/topic/image"][0]["id"]=Freebase.get_image_url(result["/common/topic/image"][0]["id"])
    end
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
			#puts "Markup: #{item["anchor"]}"
			#puts result
			#print "\n"
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
			if query=~/\b#{item["name"]}\b/i
        alt=markupName.select {|l| item["name"].casecmp(l)==0}
				if alt.empty?
					result=freebase_search item["name"]
					entities << result
#=======================================================
					#puts "Suggestion:#{item["name"]}"
				  #puts result
   				#print "\n"
#=======================================================
				end
			end	
		end
	
	end

def entity_sanity_check(query,entities)
    ent_count=entities.length
		ent_index=0
  	while(ent_index<ent_count)
			validation=true
      query.scan(/\w*[\s-]*\b#{entities[ent_index]["name"]}\b[\s-]*\w*/i).each do |item|
        words=item.sub(/#{entities[ent_index]["name"]}/i,'')
				if words.include?('-')
					validation=false
        else
					words.scan(/\w+/).each do |word|
						validation=ENGLISH_STOP_WORDS.include?(word)
						break unless validation
			  	end
        end
        break if validation
      end

			unless validation
				entities.delete_at(ent_index)
				ent_count -=1
			else
				ent_index +=1
      end

    end
  end



	def entities_adapter(query)
    markupName=[]
    entities=[]

    formatted_query=titlecase(query)+'. '+query
    zemanta_get_markup_entity(formatted_query,entities,markupName)
    zemanta_get_suggestion_entity(formatted_query,entities,markupName)
    #entity_sanity_check(query,entities)
		return entities

  end

  def get_entities(query)
    entities_adapter(query)
  end

end
