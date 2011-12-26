
require 'uri'

module Categorization
 class << self
  def categorization_pipeline(activities)
    Rails.logger.info("[MODEL] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Entering => Number of activities => #{activities.size}")

    ###################################### FIRST CREATE AND RESOLVE WEB LINKS #######################################################

    text_categorization = {} # idx to text .. this post will be categorized with text categorization
    link_categorization = {} # idx to [array of index] .. these post will be categorized with link resolution + text categorization
    video_categorization = {} # idx to video link .. this post will be categorized with video service
    document_categorization = {}
    music_categorization = {}


    links_to_resolve = {}  # link to {:position => 1, :index => 2} #postion is index in link array in a activity
    sha_hash = {}          # sha to link
    index = 0

    params = {:activities => activities, :text_cat => text_categorization, :link_cat => link_categorization,
              :music_cat => music_categorization,   :video_cat => video_categorization,:doc_cat => document_categorization,
              :links_to_resolve => links_to_resolve, :sha => sha_hash}

    #Set up the pipeline
    activities.each_with_index do |activity, idx|
      attr = activity[:post]

      if !attr[:links].blank?
        attr[:links].each_with_index do |link, pos|

          link[:url] = remove_parameters_from_query(link[:url])
          if (link[:ignore].blank?) or (link[:ignore] == false)

            #this will save us from link resolution
            #but still this incoming link does not have category
            links_to_resolve[link[:url]] = [] if links_to_resolve[link[:url]].blank?
            links_to_resolve[link[:url]] << {:position => pos, :index => idx}
            sha_hash[link[:url_sha1]] =  link[:url]
          end
        end
      end
    end

    ################# Search Web-link and Remove some links to resolve if complete links are found in web link######
    #Also search in canonical links
    array = []
    WebLink.where(:url_sha1 => sha_hash.keys).all.each do |attr|
      h = attr.attributes.symbolize_keys
      Rails.logger.info("[MODEL] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] *** WEB LINK FOUND *** #{h[:url]}")
      array <<  h
    end

    ShortWebLink.includes(:web_link).where(:url_sha1 => sha_hash.keys).all.each do |attr|
      h = attr.web_link.attributes.symbolize_keys
      #swap urls
      url = h[:url]      #canonical url
      h[:url] = attr.url #short url as all the hashes in categorization is formed with this short url
      h[:canonical_url] = url

      Rails.logger.info("[MODEL] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] *** SHORT WEB LINK FOUND ***
                          short url =  #{h[:url]} and canonical url = #{h[:canonical_url]}")
      array <<  h
    end

    array.each do |attr|
      update_link_information(params, attr)
    end
    puts "=============================================================\n\n"

    ##################### Resolve Links [FIBER STALL] [N/20 multi call embedly batch limit]#########################
    data = {}
    data = ::LinkResolution::Embedly.resolve_links(links_to_resolve.keys)
    ####################################### update activity with links #############################################
    data.each do |k,v|
      update_link_information(params, v)
    end

    Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] =====================AFTER LINK RESOLVE========================================\n\n" )

    ################################## Distribute Links ############################################################

    distribute_links(params)

    Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] =====================AFTER LINK RESOLVE========================================\n\n" )

    categorize_video(params)

    categorize_music(params)

    categorize_document(params)

    categorize_link(params)

    categorize_text(params)

    Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Leaving => Number of activities => #{activities.size}")
  rescue => e
    Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] ERROR => RESCUE => #{e.message}")
  end

   def distribute_links(params)
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] [distribute_links] entering #{params[:activities].size}")

     params[:activities].each_with_index do |activity, idx|

       attr = activity[:post]

       if !attr[:links].blank?
         link = attr[:links][0]
         next if !link[:category_id].blank?

         if !link[:canonical_url].blank? and link[:url] != link[:canonical_url]
           url =  link[:canonical_url]
         else
           url = link[:url]
         end
         url = remove_parameters_from_query(url)

           #consider only first link for categorization
           #if link is there but its dumb link like facebook internal PHP links then directly use message text
         if link[:ignore] == true
           i =0
                 #need to categorize the video using specific video service as they give precise category
         elsif link[:mime] == AppConstants.mime_remote_video
           params[:video_cat][url] = [] if params[:video_cat][url].blank?
           params[:video_cat][url] << idx

         elsif link[:mime] == AppConstants.mime_remote_music
           params[:music_cat][url] = [] if params[:music_cat][url].blank?
           params[:music_cat][url] << idx

         elsif link[:mime] == AppConstants.mime_remote_document
           params[:doc_cat][url] = [] if params[:doc_cat][url].blank?
           params[:doc_cat][url] << idx

           #otherwise use normal link resolution + text categorization combination
           #hashing is different here to optimize and ease of use.. also it needs to sent to text categorization
           #so hashing this way is easy
         else
           params[:link_cat][url] = [] if params[:link_cat][url].blank?
           params[:link_cat][url] << idx
         end

       else
         params[:text_cat][idx] = {:text => attr[:text]}  if (!attr[:text].blank? and (attr[:enrich] == true))
       end
     end
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] [distribute_links] leaving")
   end

   def categorization_logs(params)

     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Resolve #{params[:links_to_resolve].inspect}")
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Text #{params[:text_cat].inspect}")
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Link #{params[:link_cat].inspect}")
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] ideo #{params[:video_cat].inspect}")
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Music #{params[:music_cat].inspect}")
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Document #{params[:doc_cat].inspect}")
   end
   
   def categorize_video(params)

     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_VIDEO] Entering => Number of Videos = #{params[:video_cat].size}")

     video_categorization = params[:video_cat]
     activities =  params[:activities]

     if video_categorization.blank?
       return
     end
     
     hash = ::Categorization::Categorizer::Youtube.categorize(video_categorization.keys)
     hash.each do |k,v|
       #update activities at each index
       video_categorization[k].each do|idx|
        activities[idx][:post][:word] = v
        activities[idx][:post][:summary_category] = v #SUMMARY_CATEGORIES[v]['channel']
        
        #update the category of url also so that it will be updated in DB..
        #normally one update is fine as weblinks are shared by all.. so updating link category in one activity will
        #apply for all activities have this link
        #if statement is an over cautious guard to re-check the link
        
        link = activities[idx][:post][:links][0]
        if (link[:url] == k)  or (link[:canonical_url] ==  k)
          activities[idx][:post][:links][0][:category_id] =  v #SUMMARY_CATEGORIES[v]['channel']
        end
       end
     end
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_VIDEO] LEAVING => number of Categorized = #{hash.size}")
   end

   #time being using link categorization for document_categorization
   def categorize_document(params)
     params[:link_cat].merge!(params[:doc_cat])
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_DOCUMENT] => Added to link #{params[:doc_cat].size}")
   end
  
   def categorize_music(params)

     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_MUSIC] =>  #{params[:music_cat].keys.size}")
     params[:music_cat].each do |k,v|
       v.each do |idx|
         activity = params[:activities][idx][:post]
         activity[:summary_category ] =  "entertainment"
         activity[:word] = "entertainment"   #SUMMARY_CATEGORIES[category]['channel']
         activity[:links][0][:category_id] =  "entertainment" #SUMMARY_CATEGORIES[category]['channel'
       end
     end

   end

   def categorize_link(params)
     array = []
     hash = {}
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_LINK] => number of link => #{params[:link_cat].keys.size}")

     #just switch of the link based resolution
     #hash = ::Categorization::Categorizer::AlchemyApi.categorize_link(params[:link_cat].keys)
     
     #this loop will 
     hash.each do |k,v|
       #update activities at each index
        params[:link_cat][k].each do|idx|
          activity = params[:activities][idx][:post]
          activity[:word] = v
          activity[:summary_category] = v #SUMMARY_CATEGORIES[v]['channel']
        
          #update the category of url also so that it will be updated in DB..
          #normally one update is fine as weblinks are shared by all.. so updating link category in one activity will
          #apply for all activities have this link
          #if statement is an over cautious guard to re-check the link
        
          link = activity[:links][0]
          if (link[:url] == k)  or (link[:canonical_url] ==  k)
            activity[:links][0][:category_id] =  v #SUMMARY_CATEGORIES[v]['channel']
          end
        end
        #remove these link categorization.... these are done and properly categorized
        params[:link_cat].delete(k)
     end
     params[:link_cat].each do |k,v|
       v.each do |idx|
         link = params[:activities][idx][:post][:links][0]
         str = ""
         str = link[:name] + ". " if !link[:name].blank?
         str += link[:description] + "." if !link[:description].blank?
         params[:text_cat][idx] = {:text => str, :link => true } if !str.blank?
       end
       #remove these link categorization.... these are done and properly categorized
       params[:link_cat].delete(k)
     end
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_LINK] => number of link remaining=> #{params[:link_cat].keys.size}")
   end


   def categorize_text(params)
     
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_LINK] => Entering => number of Text => #{params[:text_cat].keys.size}")

     params[:text_cat].each do |k,v|
     
     if !v[:text].blank?


          activity = params[:activities][k][:post]

          categories = {}

          link = nil

          if v[:link] == true
            link = activity[:links][0][:url]
          end

          resp = vote(link,v[:text])
          categories = resp if !resp.blank?

          if !categories.blank?
            activity[:word] =  categories[:name]
            activity[:summary_category] =  categories[:name]   #SUMMARY_CATEGORIES[category]['channel']
            #Rails.logger.info("[CATEGORIZER] [categorize] => activity => #{activity.inspect}")

            if v[:link] == true
              activity[:links][0][:category_id] = categories[:name] #SUMMARY_CATEGORIES[v]['channel']
            end

          end
        end
     end
     Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZE_LINK] => Leaving")
   end
   
   def vote(link, text)
     Rails.logger.info("[LIB] [CATEGORIZATION] [VOTE] entering")
     req = [] 
     score = 0
     req << ::Categorization::Categorizer::OpenCalais.make_request(text, "opencalais")

     if text.length < 512  and !link.blank?
       req << ::Categorization::Categorizer::AlchemyApi.make_request(link, "alchemyapi", "link")
     else
       req << ::Categorization::Categorizer::AlchemyApi.make_request(text, "alchemyapi", "text")
     end

     response = ::EmHttp::Http.request(req)
     
     categories = []
     response.each do |resp|
       if resp[:handle] == "alchemyapi"
         cat = ::Categorization::Categorizer::AlchemyApi.process_response(resp[:response])
       else
         cat = ::Categorization::Categorizer::OpenCalais.process_response(resp[:response])
       end
       categories.concat(cat)
     end

     if !categories.blank?
       index = 0
       categories.each_with_index do|attr, idx|
         if attr[:score] > score
           index = idx
           score = attr[:score]
         end 
       end
       return categories[index]
     end
     Rails.logger.info("[LIB] [CATEGORIZATION] [VOTE] leaving")
     return []
   rescue => e
     Rails.logger.info("[LIB] [CATEGORIZATION] [VOTE] Error => Rescue => #{e.message}")
     return []
   end  


   def update_link_information(params, link)

     Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] entering #{link} ")

     elem = nil

     cl = complete_link_info_present(link)

     if cl == true
       if !params[:links_to_resolve][link[:url]].blank?

          #update activity
          params[:links_to_resolve][link[:url]].each do |attr|
            idx = attr[:index]
            pos = attr[:position]
              
            elem = params[:activities][idx][:post][:links][pos] if  !params[:activities][idx][:post][:links].blank?
            if !elem.blank?

              Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] updating link ")
              elem[:description] = link[:description]
              elem[:name] = link[:name]
              elem[:image_url] = link[:image_url] 
              elem[:image_width] = link[:image_width]
              elem[:image_height] = link[:image_height]
              elem[:canonical_url] = link[:canonical_url]
              elem[:cache_age] = link[:cache_age]
              elem[:provider] = link[:provider]  #TODO need to bring in same format .. check get_document in Text formatter

              #move link to different categorization service
              if !elem[:canonical_url].blank? and (elem[:url] != elem[:canonical_url])
                mime = map_sources_to_mime(elem[:canonical_url])
                Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] updating mime
                        from #{elem[:mime]} to #{mime} for #{elem[:canonical_url]} ")
                elem[:mime] =  mime
              end
            end
          end
          #now remove from links_to_resolve
          params[:links_to_resolve].delete(link[:url])
       end
     end

     Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] leaving ")
   end


   #this only brings one function from module
   def map_sources_to_mime(s)
     ::TextFormatter.module_eval do
        module_function(:map_sources_to_mime)
        public :map_sources_to_mime
     end
     TextFormatter.map_sources_to_mime(s)
   end

   def remove_parameters_from_query(url)
     url = url.split('&')[0]
     url
   end

   def  complete_link_info_present(link)
     #Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] entering => #{link}")

     if link.blank?
       #Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] blank link given => #{link}")
       return false
     end

     if !link[:url].blank? and !link[:description].blank? and !link[:name].blank? and !link[:image_url].blank?
       # Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] Complete Link => #{link}")
       return true
     end
     #Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] incomplete link => #{link}")
     false
   end
  end
end