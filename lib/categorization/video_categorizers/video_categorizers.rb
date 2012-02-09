require 'services/youtube'

module Categorization
  module VideoCategorizers

    def self.categorize(params)

        Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [categorize] Entering => Number of Videos = #{params[:video_cat].size}")

        video_categorization = params[:video_cat]
        activities =  params[:activities]

        if video_categorization.blank?
          return
        end

        hash = {}

        #distribute links across service classes
        #move un-implemented services to link
        video_categorization.each do |k,v|
          klass = video_service_class(k)

          #migrate these urls for link categorization and delete them from video_categorization
          if klass.blank?
            params[:link_cat][k] = [] if params[:link_cat][k].blank?
            Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [categorize] moving to link #{k}")
            params[:link_cat][k].concat(v)
            video_categorization.delete(k)
          else
            Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [categorize] Url stays for video categorization #{k}")
            hash[klass] = [] if hash[klass].blank?
            hash[klass] << k

          end
        end

        Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [categorize] Link categorization size #{params[:link_cat].size}")
        Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [categorize] Video categorization size #{params[:video_cat].size}")

        #categorize video with respective services
        hash.each do |klass,urls|

          #categorize set of url
          categorized = klass.categorize(urls)

          categorized.each do |k,v|
            #update activities at each index
            video_categorization[k].each do|idx|
              activities[idx][:post][:word] = v
              activities[idx][:post][:category_id] = v #SUMMARY_CATEGORIES[v]['channel']

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
        end
        Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [categorize] LEAVING => number of Categorized = #{hash.size}")
    end


    def self.video_service_class(url)
      return nil if url.blank?

      klass = nil
      provider = nil
      array = url.scan(/((http:\/\/|https:\/\/)([^\s\/]+){1}(\/[^\s]*))/)

      #For "http://www.youtube.com/watch?v=hs0bk81xzwY&feature=g-all-u&context=G2be027fFAAAAAAAAAAA
      #array = [["http://www.youtube.com/watch?v=hs0bk81xzwY&feature=g-all-u&context=G2be027fFAAAAAAAAAAA", "http://", "www.youtube.com", "/watch?v=hs0bk81xzwY&feature=g-all-u&context=G2be027fFAAAAAAAAAAA"]]

      if !array.nil?
        a = array[0][2].split('.')

        if a.size == 2
          #case [ youtube, com]
          provider = a[0]
        elsif a.size == 3
          #case [www, youtube, com]
          provider = a[1]
        end
      end

      Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [video_service_class] class #{provider}")
      if !provider.blank?

        if class_exists?("#{provider.camelize}" ) == true
          klass = "::Categorization::VideoCategorizers::Services::#{provider.camelize}".camelize.constantize
        end

      end
      Rails.logger.info("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [video_service_class] class final #{klass}")
      klass
    end

    def self.class_exists?(class_name)
      klass = Services.const_get(class_name)

      return klass.is_a?(Class)
    rescue NameError  => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [VIDEO_CATEGORIZERS] [class_exists?] **** RESCUE **** #{e.message}")
        return false
    end
  end
end