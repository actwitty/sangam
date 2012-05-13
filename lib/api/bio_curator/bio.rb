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
        return_json[:interests] = {} 
        return_json[:bkg] =  "bkg4.jpg"
        return_json[:bio] =  ""
        return_json[:keywords] =  ""
        return_json[:image] =  "http://actwitty.com/images/actwitty/refactor/aw_common/aw_logo.png"
        adjective_map = {
                         ' always talks about ' =>  {
                                                      :share => 100, 
                                                      :topics => []
                                                    },
                         ' is dominantly at ' =>    {
                                                      :share => 60, 
                                                      :topics => []
                                                    },
                         ' is mostly at ' =>        {
                                                      :share => 30, 
                                                      :topics => []
                                                    },
                          ' frequently talks about ' => {
                                                          :share => 25, 
                                                          :topics => []
                                                        },
                          
                         ' often talks about ' => {
                                                        :share => 15, 
                                                        :topics => []
                                                  },
                         ' sometimes talks about ' => {
                                                        :share => 10, 
                                                        :topics => []
                                                  },
                         ' occasionally shares ' =>  {
                                                        :share => 2, 
                                                        :topics => []
                                             }
                        }
        if  params[:interests].nil? or params[:interests].size == 0
          return return_json
        end
        total_posts = 0
        return_json[:image] = "https://s3.amazonaws.com/actwitty_resources/fb_images/aw_interest"

        added=0
        first_found = -1
        for index in 0 ... params[:interests].size
          total_posts = total_posts + params[:interests][index][:analytics_snapshot][:posts][:counts][:total]
          if SUMMARY_CATEGORIES[params[:interests][index][:word][:name]].nil?
            params[:interests][index][:detail] =  params[:interests][index][:word][:name]
          else
            params[:interests][index][:detail] =  SUMMARY_CATEGORIES[params[:interests][index][:word][:name]]['name']
            if added < 3 
              return_json[:image] = return_json[:image] + '_' + SUMMARY_CATEGORIES[params[:interests][index][:word][:name]]['img_counter'].to_s
            end
            added = added + 1
            if first_found < 0
              first_found = index
              return_json[:bkg] =  SUMMARY_CATEGORIES[params[:interests][0][:word][:name]]['background']
            end
          end
          return_json[:keywords] = return_json[:keywords] + " #{params[:interests][index][:word][:name]}"

        end
        return_json[:image] = return_json[:image] + '.jpeg'
        return_json[:interests] = params[:interests]
        return_json[:bio] =  ""

        percentage = 0
        added = 0
        for index in 0 ... params[:interests].size
          percentage = (params[:interests][index][:analytics_snapshot][:posts][:counts][:total] * 100)/total_posts
          adjective = ' rarely shares '

          adjective_map.each_pair do |key, adjective_detail|
            if adjective_detail[:share] <= percentage
              adjective = key; 
              break        
            end
          end
      
          unless SUMMARY_CATEGORIES[params[:interests][index][:word][:name]].nil?
            adjective_map[adjective][:topics] << params[:interests][index][:word][:name]

            if added == 2
              break
            end
            added = added + 1
          end
        end

        sentence = params[:fullname] + ' these days ' 
        dyn_sentence = ""
        dyn_sentence_arr = []
        
        adjective_map.each_pair do |adjective, adjective_detail|
          if adjective_detail[:topics].size > 0
            if adjective_detail[:topics].size == 1
              dyn_sentence = adjective + SUMMARY_CATEGORIES[adjective_detail[:topics][0]]['sentence']
            else
               dyn_sentence = adjective
               for idx in 0 ... adjective_detail[:topics].size
                if idx == 0
                  dyn_sentence = dyn_sentence + SUMMARY_CATEGORIES[adjective_detail[:topics][idx]]['sentence']
                elsif idx == (adjective_detail[:topics].size - 1)
                  dyn_sentence = dyn_sentence + ', ' + SUMMARY_CATEGORIES[adjective_detail[:topics][idx]]['end_sentence']
                else
                  dyn_sentence = dyn_sentence + ', ' + SUMMARY_CATEGORIES[adjective_detail[:topics][idx]]['sentence']
                end
               end
            end
            dyn_sentence_arr << dyn_sentence
          end
        end
          
          
        for idx in 0 ... dyn_sentence_arr.size
          if idx == 0
            sentence = sentence + dyn_sentence_arr[idx]
          elsif idx == ( dyn_sentence_arr.size - 1 )
            sentence = sentence + ' and ' + dyn_sentence_arr[idx]
          else
            sentence = sentence + ', ' + dyn_sentence_arr[idx]
          end 
        end
        return_json[:bio] = sentence
        return return_json
               
      end
    end
  end
end
