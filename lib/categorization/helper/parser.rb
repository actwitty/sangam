module SocialFetch
  module Helper
    class Parser
      class << self
        def extract_data(msg)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [PARSER] [extract_data] entering #{msg.inspect}")

          link = {}

          regex = /(http?:\/\/\S+)|(https?:\/\/\S+)/
          arr = msg.scan(regex)

          if !arr.blank?

            attr = arr[0]
            attr.compact!
            link[:data] = attr[0]

            vid = attr[0].scan(/youtube|facebook/)

            if vid.blank?
              link[:type] = AppConstants.data_type_weburl
            else
              link[:type] = vid[0]
            end
          end

          if link.blank?
            link[:data] = msg
            link[:type] = AppConstants.data_type_text
          end
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [PARSER] [extract_data] leaving => category => #{link.inspect} for #{msg.inspect}")
          link
        end
      end
    end
  end
end
