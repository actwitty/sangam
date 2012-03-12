require 'uri'
require 'video_categorizers/video_categorizers'
require 'text_categorizers/text_categorizers'
require 'link_categorizers/link_categorizers'
require 'music_categorizers/music_categorizers'
require 'doc_categorizers/doc_categorizers'

 module Categorization
   DATABASE_QUERY_LIMIT = 40
   class << self
   def categorization_pipeline(activities)
      Rails.logger.info("[MODEL] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Entering => Number of activities => #{activities.size}")

      ###################################### FIRST CREATE AND RESOLVE WEB LINKS #######################################################

      text_categorization = {} # idx to text .. this post will be categorized with text categorization
      link_categorization = {} # idx to [array of index] .. these post will be categorized with link resolution + text categorization
      video_categorization = {} # idx to video link .. this post will be categorized with video service
      document_categorization = {}
      music_categorization = {}
      term_extraction = {}


      links_to_resolve = {}  # link to {:position => 1, :index => 2} #postion is index in link array in a activity
      complete_links = {}
      sha_hash = {}          # sha to link
      index = 0

      params = {:activities => activities, :text_cat => text_categorization, :link_cat => link_categorization,
                :music_cat => music_categorization,   :video_cat => video_categorization,:doc_cat => document_categorization,
                :links_to_resolve => links_to_resolve, :complete_links => complete_links,:term_extract => term_extraction,
                :sha => sha_hash}

      #Set up the pipeline
      activities.each_with_index do |activity, idx|
        attr = activity[:post]

        if !attr[:links].blank?
          attr[:links].each_with_index do |link, pos|

            #link[:url] = remove_parameters_from_query(link[:url])
            if (link[:ignore].blank?) or (link[:ignore] == false)

              #cl = complete_link_info_present(link)

              #if cl == true
#                #this will save us from link resolution
#                #but still this incoming link does not have category
#                complete_links[link[:url]] = [] if complete_links[link[:url]].blank?
#                complete_links[link[:url]] << {:position => pos, :index => idx}
#              else

              links_to_resolve[link[:url]] = [] if links_to_resolve[link[:url]].blank?
              links_to_resolve[link[:url]] << {:position => pos, :index => idx}
#              end
              sha_hash[link[:url_sha1]] =  link[:url]
            end
          end
        end

        if (!attr[:text].blank? and (attr[:enrich] == true))
          params[:term_extract][idx] = attr[:text]
        end
      end

      ################# Search Web-link and Remove some links to resolve if complete links are found in web link######

      array = check_links_in_db(params)
      array.each do |attr|
        update_link_information(params, attr)
      end
      puts "=============================================================\n\n"

      ##################### Resolve Links [FIBER STALL] [N/20 multi call embedly batch limit]#########################
      data = {}
      data = ::LinkResolution.resolve_links(params)

      data.each do |k,v|
        update_link_information(params, v)
      end

      Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] =========AFTER LINK RESOLVE===========\n\n" )

      ############## Term Extraction - From Zemanta and Freebase ######################
      ::TermExtraction.get_terms(params)

      ################################## Distribute Links across categorization types ##################################

      distribute_links(params)

      ############## Text Extraction -Moves links in link categorization to text categorization ######################
#      ::TextExtraction.extract_text(params)
#
#      Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] ==========AFTER TEXT EXTRACTION=======\n\n" )
      ################################################################################################################

      Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] ==========AFTER TERM EXTRACTION=======\n\n" )
      ################################################################################################################

      ::Categorization::VideoCategorizers::categorize(params)

      ::Categorization::MusicCategorizers.categorize(params)

      ::Categorization::DocCategorizers.categorize(params)

      ::Categorization::LinkCategorizers.categorize(params)

      ::Categorization::TextCategorizers.categorize(params)

      Rails.logger.info("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] Leaving => Number of activities => #{activities.size}")
   rescue => e
      Rails.logger.error("[LIB] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] ERROR => **** RESCUE **** => #{e.message}")
   end

   #distribute links across various categorization service
   def distribute_links(params)
     Rails.logger.info("[LIB] [CATEGORIZATION] [distribute_links] entering #{params[:activities].size}")

     params[:activities].each_with_index do |activity, idx|

       attr = activity[:post]

       if !attr[:links].blank? and attr[:links][0][:ignore].blank?
         link = attr[:links][0]
         next if !link[:category_id].blank?

         if !link[:canonical_url].blank? and link[:url] != link[:canonical_url]
           url =  link[:canonical_url]
         else
           url = link[:url]
         end
         #url = remove_parameters_from_query(url)          #no need to consider

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
         #lets block any normal text classification .. as of now only links and video
         if (!attr[:text].blank? and (attr[:enrich] == true))
           if !attr[:entities].blank?
             params[:text_cat][idx] = {:text => attr[:text]} #if attr[:text].length >= AppConstants.min_text_length_for_text_categorization
           end
         end
       end
     end
     Rails.logger.info("[LIB] [CATEGORIZATION]  [distribute_links] leaving")

   rescue => e
      Rails.logger.error("[LIB] [CATEGORIZATION] [distribute_links] ERROR => **** RESCUE **** => #{e.message}")
   end

   #update the links information with information retrieved
   def update_link_information(params, link)

     Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] entering #{link} ")

     elem = nil
     hash = {}

     #no need to check for complete link. If its one found in what ever state accept that.
     #May be OVERDONE as of now. So comment it.. Make sense if we have our own link resolution
     #cl = complete_link_info_present(link)
     hash = params[:links_to_resolve] if !params[:links_to_resolve][link[:url]].blank?

     #this is used here to update the categories in complete links. Other wise they will go for
     #categorization
     hash = params[:complete_links] if !params[:complete_links][link[:url]].blank?

     #if cl == true
       if !hash[link[:url]].blank?

          #update activity
          hash[link[:url]].each do |attr|
            idx = attr[:index]
            pos = attr[:position]
              
            elem = params[:activities][idx][:post][:links][pos] if  !params[:activities][idx][:post][:links].blank?
            if !elem.blank?

              #Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] updating link ")
              link.each do |k,v|
                elem[k] = link[k]
              end

              if (pos == 0) and !link[:category_id].blank?
                params[:activities][idx][:post][:word] =  link[:category_id]
                params[:activities][idx][:post][:category_id] =  link[:category_id]
              end

              #move link to different categorization service
              if !elem[:canonical_url].blank? and (elem[:url] != elem[:canonical_url])
                mime = ::Api::Helpers::Parser.map_sources_to_mime({:source => elem[:canonical_url]})

                #Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] updating mime
                        from #{elem[:mime]} to #{mime} for #{elem[:canonical_url]} ")
                elem[:mime] =  mime
              end
            end
          end
          #now remove from links_to_resolve
          hash.delete(link[:url])
       end
     #end

     #Rails.logger.info("[LIB] [CATEGORIZATION] [update_link_information] leaving ")

   rescue => e
     Rails.logger.error("[LIB] [CATEGORIZATION] [update_link_information] ERROR => **** RESCUE **** => #{e.message}")

   end

   #check if links already exist in database
   def check_links_in_db(params)

     array = []
     sha_hash = params[:sha]

     if !sha_hash.keys.blank?
       Rails.logger.info("[MODEL] [CATEGORIZATION] [CHECK_LINKS_IN_DB] Number of urls =  #{sha_hash.keys.size}")
       #Also search in canonical links

       #split sha_hash in sets which is optimal for DB query in IN clause
       sha_keys_array = sha_hash.keys.enum_for(:each_slice,  DATABASE_QUERY_LIMIT).to_a

       sha_keys_array.each do |sha_keys|
         WebLink.where(:url_sha1 => sha_keys).all.each do |attr|
            h = attr.attributes.symbolize_keys
            Rails.logger.info("[MODEL] [CATEGORIZATION] [CHECK_LINKS_IN_DB] *** WEB LINK FOUND *** #{h[:url]}")
            array <<  h
         end

         #commenting short web link for till we have our own system ready for link resolution
  #       ShortWebLink.includes(:web_link).where(:url_sha1 => sha_keys).all.each do |attr|
  #          h = attr.web_link.attributes.symbolize_keys
  #          #swap urls
  #          url = h[:url]      #canonical url
  #          h[:url] = attr.url #short url as all the hashes in categorization is formed with this short url
  #          h[:canonical_url] = url
  #
  #          Rails.logger.info("[MODEL] [CATEGORIZATION] [CATEGORIZATION_PIPELINE] *** SHORT WEB LINK FOUND ***
  #                              short url =  #{h[:url]} and canonical url = #{h[:canonical_url]}")
  #          array <<  h
  #        end
       end
     end
     array
   rescue => e
     Rails.logger.error("[LIB] [CATEGORIZATION] [CHECK_LINKS_IN_DB] ERROR => **** RESCUE **** => #{e.message}")
   end

   def remove_parameters_from_query(url)
     url = url.split('&')[0]
     url
   end
   def complete_link_info_present(link)
     #Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] entering => #{link}")

     if link.blank?
       #Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] blank link given => #{link}")
       return false
     end

     if !link[:url].blank? and !link[:description].blank? and !link[:title].blank? and !link[:image_url].blank?
       # Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] Complete Link => #{link}")
       return true
     end
     #Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] incomplete link => #{link}")
     false
   end
 end
end