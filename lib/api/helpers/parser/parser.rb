module Api
  module Helpers
    module Parser
      class << self

        #need to write strong parser for remote docs
        #this is temporary for time being.. need to make all the parse in one call
        # like mentions, documents and hashes
        #TODO

        #INPUT =>{:text => "hi http://www.google.com/123 .. "}
        def get_documents(params)

          Rails.logger.info("[LIB] [API] [HELPERS] [PARSER] [get_documents] Entering #{params.inspect}")

          array = []
          text = params[:text]

          sources = "#{AppConstants.video_sources}|#{AppConstants.image_sources}|#{AppConstants.document_sources}|#{AppConstants.audio_sources}"
          extensions="#{AppConstants.video_extensions}|#{AppConstants.image_extensions}|#{AppConstants.document_extensions}|#{AppConstants.audio_extensions}"

          arr = text.scan(/((http:\/\/|https:\/\/)([^\s\/]+){1}(\/[^\s]*))/)

          #format of arr [["http://youtube.com/watch?222", "http://", "youtube.com", "/watch?222"],
          # ["http://form6.flick.com/234/234", "http://", "form6.flick.com", "/234/234"]]

          arr.each do |attr|
            if !(s = attr[0].scan(/#{extensions}/)).blank?
              array << {:mime => map_extensions_to_mime({:extension => s[0]}), :url => attr[0], :provider => attr[2],:uploaded => false, :url_sha1 => Digest::SHA1.hexdigest(attr[0]) }
            else !(s = attr[0].scan(/#{sources}/)).blank?
              array << {:mime => map_sources_to_mime({:source => s[0]}), :url => attr[0], :provider => attr[2],:uploaded => false, :url_sha1 => Digest::SHA1.hexdigest(attr[0])}
            end
          end

          Rails.logger.info("[LIB] [API] [HELPERS] [PARSER] [get_documents] Leaving #{params.inspect}")
          array
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PARSER] [get_documents]  ERROR => **** RESCUE **** => #{e.message} for #{params[:text]}")
        end


        #need to write strong parser for remote docs
        #this is temporary for time being.. need to make all the parse in one call
        # like mentions, documents and hashes
        #TODO
        def get_tags(params)

          Rails.logger.info("[LIB] [API] [HELPERS] [PARSER] [GET_TAGS] Entering #{params.inspect}")
          text = params[:text]

          arr = text.scan(/(#[\w\d]+[^\s])/)
          array = []

          arr.each do |attr|
            array << {:name => attr[0]}
          end

          Rails.logger.info("[LIB] [API] [HELPERS] [PARSER] [GET_TAGS] Leaving #{params.inspect}")
          array
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PARSER] [GET_TAGS] ERROR => **** RESCUE **** => #{e.message} for #{params[:text]}")
        end



        #INPUT =>{:source => "youtube.com"}
        def map_sources_to_mime(params)

          Rails.logger.info("[LIB] [API] [HELPERS] [PARSER] [map_sources_to_mime] Entering #{params.inspect}")
          source = params[:source]

          if source =~ /#{AppConstants.document_sources}/
            return AppConstants.mime_remote_document

          elsif source =~ /#{AppConstants.image_sources}/
            return AppConstants.mime_remote_image

          elsif source =~ /#{AppConstants.video_sources}/
            return AppConstants.mime_remote_video

          elsif source =~ /#{AppConstants.audio_sources}/
            return AppConstants.mime_remote_audio

          else
            return AppConstants.mime_remote_link
          end

        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PARSER] [map_sources_to_mime] ERROR => **** RESCUE **** => #{e.message} for #{params[:source]}")
          AppConstants.mime_remote_link
        end

        #INPUT =>{:extension => "jpeg" OR "png" ...}
        def map_extensions_to_mime(params)
          Rails.logger.info("[LIB] [API] [HELPERS] [PARSER] [map_extensions_to_mime] Entering #{params.inspect}")

          extension = params[:extension]

          if extension =~ /#{AppConstants.document_extensions}/
            return AppConstants.mime_remote_document

          elsif extension =~ /#{AppConstants.image_extensions}/
            return AppConstants.mime_remote_image

          elsif extension =~ /#{AppConstants.video_extensions}/
            return AppConstants.mime_remote_video

          elsif extension =~ /#{AppConstants.audio_extensions}/
            return AppConstants.mime_remote_audio

          else
            return AppConstants.mime_remote_link
          end
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PARSER] [map_extensions_to_mime] ERROR => **** RESCUE **** => #{e.message} for #{params[:extension]}")
          AppConstants.mime_remote_link
        end

        #INPUT => type
        #OUTPUT => mime
        def map_type_to_mime(type)
          case type
            when "photo"
              return AppConstants.mime_remote_image
            when "video"
              return AppConstants.mime_remote_video
            when "music"
              return AppConstants.mime_remote_music
            when "link"
              return AppConstants.mime_remote_link
            else
              return AppConstants.mime_remote_link
          end
        rescue  => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PARSER] [map_type_to_mime] **** RESCUE **** => #{e.message} for #{type}")
          AppConstants.mime_remote_link
        end
      end
    end
  end
end

