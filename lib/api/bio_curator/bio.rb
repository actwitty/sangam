module Api
  module BIOCurator
    class << self
      #INPUT => {
      #            :user_id => "",
      #            :activities => [ {:category => "", :url => ""} ,{:category => "", :url => ""} ]
      #         }
      #   

      def generate_social_bio_of_user(params)
        Rails.logger.info("[API] [BIOCurator] entering #{params.inspect}")
        return_json = {}
        return_json[:interests] = params[:interests] 
        return_json[:bio] =  ""
        return_json[:keywords] =  ""
        return_json[:image] =  "http://actwitty.com/images/actwitty/refactor/aw_common/aw_logo.png"
        if  params[:interests].nil? or params[:interests].size == 0
          return return_json
        end
        
        bio_mode = 'all'
        bio_topic = ''
        if !params[:streams].blank? and params[:streams] != 'all'
          if params[:streams] == "videos"
            bio_mode = 'videos'
          elsif params[:streams] == "images"
            bio_mode = 'images'
          else
            bio_mode = 'topic'
            bio_topic = params[:streams]
          end
        else
          if !params[:mention].blank?
            bio_mode = 'mention'
            bio_topic = params[:mention]
          end
        end
        
        keyword = ""
        keyword = keyword << params[:fullname]
        sentence = ""
        if bio_mode == "all" 
          sentence = params[:fullname]  + "'s interest profile in multimedia and topics like  " 
          for index in 0 ... params[:interests].size
            keyword = keyword << " " << params[:interests][index][:word][:name]
            sentence = sentence << params[:interests][index][:word][:name]  << ","
          end
          sentence = sentence << "videos and images at Actwitty."
        elsif bio_mode == "topic"  
          keyword = keyword << " " << bio_topic 
          sentence = params[:fullname]  + " has shared something interesting on " + bio_topic + " at Actwitty" 
        elsif bio_mode == "videos"  
          keyword = keyword << " videos multimedia youtube views"
          sentence = params[:fullname]  + " has shared lots of videos in his social network, view all of them at Actwitty" 
        elsif bio_mode == "images"
          keyword = keyword << " images pictures photos photographs"
          sentence = params[:fullname]  + " has shared lots of images in his social network, view all of them at Actwitty" 

        elsif bio_mode == "mention"
          keyword = keyword << " " << bio_topic 
          sentence = params[:fullname]  + " has shared something interesting on " + bio_topic + " at Actwitty" 

        end
        
        return_json[:bio] = sentence
        return_json[:keywords] = keyword
        return return_json
               
      end
    end
  end
end
