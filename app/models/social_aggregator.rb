require 'json'
require 'eventmachine'
require 'fiber'
class SocialAggregator < ActiveRecord::Base

  belongs_to :user

  validates_uniqueness_of :user_id, :scope => [:provider, :uid]
  class << self
    #INPUT => {:user_id => 123, :provider = "facebook"}

    def create_social_data(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] entering #{params}")

      new_activity = nil
      data_array = []
      aggregator = nil

      ###########################get authentication information of provider#####################################

      auth = Authentication.where(:user_id => params[:user_id], :provider => params[:provider]).first
      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] #{auth.inspect}")

      ############Find whether its first time data pull from provider. Set limit of pull accordingly ############

      limit = nil
      existing_data = {}

      #pull information regarding social fetch stats regrading particular user and provider
      social_fetch = SocialAggregator.where(:user_id => params[:user_id], :provider => params[:provider]).first

      #default settings for provider
      limit =  AppConstants.maximum_import_first_time
      latest_msg_timestamp = Time.utc(1970, 7, 8, 9, 10)

      if social_fetch.blank?
        #create social fetch entry and set last_msg_timestamp to near epoch
        social_fetch = SocialAggregator.create!(:user_id => params[:user_id],
                                                :provider => params[:provider], :uid => auth.uid)

        last_updated_at = Time.utc(1978, 12, 15, 9, 10)
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ====>>>>  first time  #{params.inspect}")
      else
        #set the last hit to provider. Social Fetch Stats is updated at every hit
        last_updated_at =  social_fetch.updated_at

        #this is the case when social data of user is pulled once but no data returned ..
        #may be he has not created any data at provider or some bug in our connection
        if !social_fetch.latest_msg_timestamp.blank?
          #OVERIDE default settings for provider
          limit = AppConstants.maximum_import_every_time
          latest_msg_timestamp = social_fetch.latest_msg_timestamp
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ====>>>> regular update #{params.inspect}  " )
        else
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ====>>>>  first time  #{params.inspect}")
        end
      end


      #################################### Pull data from provider ##############################################
      time_diff = time_diff_in_minutes(last_updated_at)
      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] TIME DIFF =>>>>>>>>>>> #{time_diff}   #{AppConstants.maximum_time_diff_for_social_fetch}")

      if time_diff < AppConstants.maximum_time_diff_for_social_fetch
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] leaving Time EARLY #{params.inspect}")
        return nil
      end

      hash = {:user_id => auth.user_id, :uid => auth.uid, :provider => auth.provider, :access_token => auth.token,
              :limit => limit, :latest_msg_timestamp => latest_msg_timestamp, :social_fetch => social_fetch}

      EM.next_tick do
        Fiber.new {
          process_social_data(hash)
        }.resume

      end

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] leaving #{params.inspect}")
    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ****ERROR OUTSIDE FIBER**** #{e.message} for #{params.inspect}")
      nil
    end


    private

      def process_social_data(params)

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] entering #{params}")

         new_activity = nil
         latest_msg_timestamp = nil

         social_fetch = params[:social_fetch]

         social_fetch.touch

         data_array = SocialFetch.pull_data({:user_id => params[:user_id], :uid => params[:uid],:provider => params[:provider],
                                                :access_token => params[:access_token], :limit => params[:limit],
                                                :latest_msg_timestamp => params[:latest_msg_timestamp]} )


         if data_array.blank?
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] empty data returned #{params.inspect}")
            raise 'Blank Data Array Returned'
         end


         ########################## Convert and Categorize data ###################################################

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] now process the data
                    ======================= #{data_array.size} ====================== for #{params.inspect}")

         activity = []
         links = {}
         #convert and categorize data
         data_array.each do |attr|

           data = SocialFetch.data_adaptor({:provider => params[:provider], :blob => attr, :uid => params[:uid],
                                          :latest_msg_timestamp => params[:latest_msg_timestamp] })
           if !data.blank?
             activity << data
           end
         end

         categorization_pipeline(activity)

         ############################Create Activities in DB in reverse order #####################################
         ################ As data is pulled in updated order from provider, we have create in reverse order ######

         size = activity.size

         user = User.where(:id => params[:user_id]).first

         #store data from last... as that will be in ascending order.. and data will pulled in get_all_activity naturally
         #in descending order of updated_at DESC
         size.times do |idx|

           attr = activity[idx -1]

           #as of now we are not using provider's timestamp as our timestamp.
           #though we are making a record of provider's created_at
           #h =  attr[:post].except(:created_at, :updated_at)
           h =  attr[:post]

           h[:updated_at] = h[:created_at] if h[:updated_at].blank?

           new_activity = user.create_activity(h)

         end

         latest_msg_timestamp = activity[0][:post][:created_at] if !activity.blank?

         #update the latest_msg_timestamp in stats
         if !latest_msg_timestamp.blank?
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] TIMESTAMP #{latest_msg_timestamp} for  #{params.inspect}")
            social_fetch.update_attributes(:latest_msg_timestamp => latest_msg_timestamp.to_datetime)
         end

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] leaving #{params.inspect}")

         rescue => e
           Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] ****ERROR INSIDE FIBER**** #{e.message} for #{params.inspect}")

           #destroy last new_activity. as they can't be valid after create as we are setting them to nil
           #so if they are non-null then they should be removed
           Activity.destroy_all(:id => new_activity[:post][:id]) if !new_activity.blank?

           #May be we can set Sync Error in Auth table and re-sync immediately .. but time being parking it

      end

      def categorization_pipeline(activities)
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CATEGORIZATION_PIPELINE] Entering => Number of activities => #{activities.size}")

         ###################################### FIRST CREATE AND RESOLVE WEB LINKS #######################################################

         text_categorization = {} # idx to text .. this post will be categorized with text categorization
         link_categorization = {} # idx to [array of index] .. these post will be categorized with link resolution + text categorization
         video_categorization = {} # idx to video link .. this post will be categorized with video service

         links_to_resolve = {}  # link to {:position => 1, :index => 2} #postion is index in link array in a activity
         complete_links = {}    # link to {:position => 1, :index => 2} #postion is index in link array in a activity
         text_hash = {}         # text to activity id
         sha_hash = {}          # sha to link

         index = 0

         params = {:activities => activities, :text_cat => text_categorization, :link_cat => link_categorization,
                   :video_cat => video_categorization, :links_to_resolve => links_to_resolve, :complete_links => complete_links,
                   :sha => sha_hash}

         #Set up the pipeline :)
         #I mean put relevant data in relevant buckets

         activities.each_with_index do |activity, idx|

           attr = activity[:post]
           if !attr[:links].blank?
             attr[:links].each_with_index do |link, pos|

                cl = complete_link_info_present(link)

                #consider only first link for categorization
                if pos == 0

                  #need to categorize the video using specific video service as they give precise category
                  #Add text so that we can extract only entity, no categorize ( :categorize => false}
                  if link[:mime] == AppConstants.mime_remote_video
                    video_categorization[idx] = link[:url]
                    text_categorization[idx] = {:text => attr[:text], :categorize => false} if (!attr[:text].blank? and (attr[:enrich] == true))

                  #in case of music, we can put message directly to entertainment
                  #Add text so that we can extract only entity, no categorize ( :categorize => false}

                  elsif link[:mime] == AppConstants.mime_remote_music
                    attr[:summary_category ] =  "entertainment"
                    attr[:word] = SUMMARY_CATEGORIES[category]['channel']
                    text_categorization[idx] = {:text => attr[:text], :categorize => false} if (!attr[:text].blank? and (attr[:enrich] == true))

                  #if all the information of link is present like name, description and image_url then directly use
                  #title and description and text to categorize
                  #Add text so that we can extract its entity + categorize ( :categorize => true}
                  elsif cl == true
                    str = ""
                    str = (attr[:text] + ".'") if (!attr[:text].blank? and (attr[:enrich] == true))
                    text_categorization[idx] = {:text => str  + link[:name] + "." + link[:description], :categorize => true}

                  #if link is there but its dumb link like facebook internal PHP links then directly use message text
                  #entity + categorize ( :categorize => true}
                  elsif link[:ignore] == true
                    text_categorization[idx] = {:text => attr[:text], :categorize => true} if (!attr[:text].blank? and (attr[:enrich] == true))

                 #otherwise use normal link resolution + text categorization combination
                 #hashing is different here to optimize and ease of use.. also it needs to sent to text categorization
                 #so hashing this way is easy
                  else
                    link_categorization[link[:url]] = [] if link_categorization[link[:url]].blank?
                    link_categorization[link[:url]] << idx
                  end
                end
                if cl == true
                  complete_links[link[:url]] = [] if complete_links[link[:url]].blank?
                  complete_links[link[:url]] << {:position => pos, :index => idx}
                else
                  links_to_resolve[link[:url]] = [] if links_to_resolve[link[:url]].blank?
                  links_to_resolve[link[:url]] << {:position => pos, :index => idx}
                end
                sha_hash[link[:url_sha]] =  link[:url]
             end
           else
             text_categorization[idx] = {:text => attr[:text], :categorize => true}  if (!attr[:text].blank? and (attr[:enrich] == true))
           end
         end

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [categorization_pipeline] Text #{text_categorization.inspect}")
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [categorization_pipeline] Link #{link_categorization.inspect}")
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [categorization_pipeline] Video #{video_categorization.inspect}")
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [categorization_pipeline] Complete #{complete_links.inspect}")
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [categorization_pipeline] Resolve #{links_to_resolve.inspect}")
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [categorization_pipeline] Sha #{sha_hash.inspect}")

        ################# Search Web-link and Remove some links to resolve if complete links are found in web link######
         WebLink.where(:url_sha => sha_hash.keys).all.each do |attr|
           move_link_to_complete_and_text_categorize(params, attr)
         end
        ##################### Resolve Links [FIBER STALL] [N/20 multi call embedly batch limit]#########################
         data = resolve_links(links_to_resolve.keys)
        ####################################### update activity with links #############################################
         data.each do |k,v|
            move_link_to_complete_and_text_categorize(params, v)
         end
        ################### Create Web Links it can be done in documents.. only skip link resolution call there ########

        ######## Update description + title + text (:categorize => true)of resolved link for Text Categorization.  #####

        ########################### Categorize Video [FIBER STALL] [ M multi calls] and update activity category########

        ################### Categorize Text and Get Entity(mask urls) [FIBER STALL] [ N multi calls] ###################

        ################################## Update Activity Category  ###################################################

        ################################## make entity hash, Freebase Batch request FIBER STALL ########################

        ################################## Update Entities in Activity #################################################

        ######retun activity
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CATEGORIZATION_PIPELINE] Leaving => Number of activities => #{activities.size}")
      end

      def move_link_to_complete_and_text_categorize(params, link)
        attr = link

        complete_links = params[:complete_links]
        links_to_resolve = params[:links_to_resolve]
        link_categorization = params[:link_cat]
        text_categorization = params[:text_cat]

        if complete_link_info_present(attr) == true
          if !links_to_resolve[attr.url].blank?

            #move those link to resolve to complete links
            complete_links[attr.url] = [] if complete_links[attr.url].blank? #this should always be blank
            complete_links[attr.url].concat(links_to_resolve[attr.url])

            #move these complete links to text categorization category
            if !link_categorization[attr.url].blank?
              link_categorization[attr.url].each do |idx|
                act = activities[idx][:post]
                 str = ""
                 str = (act[:text] + ".'") if (!act[:text].blank? and (act[:enrich] == true))
                 text_categorization[idx] = {:text => str  + attr.name + "." + attr.description, :categorize => true}
              end
                 link_categorization.delete(attr.url)
            end
            links_to_resolve.delete(attr.url)
          end
        end
      end


      def  complete_link_info_present(link)
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] entering => #{link}")

        if link.blank?
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] blank link given => #{link}")
          return false
        end

        if !link[:url].blank? and !link[:description].blank? and !link[:name].blank? and !link[:image_url].blank?
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] Complete Link => #{link}")
          return true
        end
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] incomplete link => #{link}")
        false
     end

      def time_diff_in_minutes (time)
        diff_seconds = (Time.now - time).round
        diff_minutes = diff_seconds / 60
        diff_minutes
      end
  end
end





# == Schema Information
#
# Table name: social_aggregators
#
#  id                   :integer         not null, primary key
#  user_id              :integer
#  provider             :string(255)
#  uid                  :string(255)
#  latest_msg_timestamp :datetime        default(1978-12-15 09:10:00 UTC)
#  created_at           :datetime
#  updated_at           :datetime
#

