module Api
  module Streams
    class << self
      #INPUT = {
      #           :query => {:user_id => 234, :id => ..., :xyz => .. } #Query Hash [MANDATORY]
      #
      #           :current_user_id => 123 , #User who is requesting this method [MANDATORY]
      #
      #           :user_id => 234 , #User whose data is being requested
      #
      #       activity_ids => Array of activity ids
      #OUTPUT =   See get_stream output
      def get_all_activity(params)

        Rails.logger.info("[LIB] [API] [STREAMS] [get_all_activity] entering ")

        array = []
        index = 0
        hash = {}

        if params[:current_user_id] != params[:user_id]
          foreign_user = true
        else
          foreign_user = false
        end

        params[:limit] = AppConstants.max_number_of_activities if params[:limit].blank? or (params[:limit] > AppConstants.max_number_of_activities)

        h = ::Api::Helpers::PlanTableQuery.plan_activity_query(params[:query])

        if h.blank?
          Rails.logger.info("[LIB] [API] [STREAMS] [get_all_activity] blank query ")
          return []
        end

        Activity.includes(:author, :base_location).where(h).limit(params[:limit]).order("source_created_at DESC").all.each do |attr|

          next if attr.status == AppConstants.status_private and foreign_user == true

          elem = ::Api::Helpers::FormatObject.format_activity({:object => attr})

          location = ::Api::Helpers::FormatObject.format_location({:parent => attr})

          elem[:location] = location[:location]

          array << elem

          hash[attr.id] = index
          index = index + 1
        end


        Document.includes(:web_link).where(:activity_id => hash.keys).all.each do |attr|
          h = ::Api::Helpers::FormatObject.format_document({:object => attr})

          elem = array[hash[attr.activity_id]]
          elem[:documents] = {:count => 0, :array => []} if elem[:documents].blank?
          elem[:documents][:array] << h[:document]
          elem[:documents][:count] += 1
        end


        Tag.where(:activity_id => hash.keys).all.each do |attr|
          h = ::Api::Helpers::FormatObject.format_tag({:object =>attr})

          elem = array[hash[attr.activity_id]]
          elem[:tags] = {:count => 0, :array => []} if elem[:tags].blank?
          elem[:tags][:array] << h[:tag]
          elem[:tags][:count] += 1
        end


        Hub.includes(:entity).where(:activity_id => hash.keys, :entity_id.not_eq => nil).all.each do |attr|
          h = ::Api::Helpers::FormatObject.format_entity({:parent => attr})

          elem = array[hash[attr.activity_id]]
          elem[:entities] = {:count => 0, :array => []} if elem[:entities].blank?
          elem[:entities][:array] << h[:entity]
          elem[:entities][:count] += 1
        end



        Rails.logger.info("[LIB] [API] [STREAMS] [get_all_activity] leaving")
        array
      rescue => e
        Rails.logger.error("[LIB] [API] [STREAMS] [get_all_activity] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end


      #COMMENT - Only returns public post which has summary
      #INPUT
      #
      #:user_id => 123                                  #QUERY PART STARTS
      #
      #:summary_id => 123,
      #
      #:source_name => "actwitty" OR "twitter" OR "facebook"
      #
      #:since => 1994-11-05T13:15:30Z ( ISO 8601)
      #
      #:from => 1992-11-05T13:15:30Z ( ISO 8601)        #QUERY PART ENDS
      #
      #
      #:limit => 200                                    #LIMIT RESULT OF QUERY
      #
      #:filter => {                                     #FILTERS ON QUERY
      #              :document => {
      #                             :all => true
      #                                                     OR
      #                             :type => "image" OR  "audio" OR "video" OR "link" OR "document"
      #                                                     OR
      #                             :id => 123
      #                           }
      #                           OR
      #              :location => {
      #                              :all => true
      #                                                     OR
      #                              :id => 124
      #                           }
      #                           OR
      #              :entity => {
      #                              :all => true
      #                                                     OR
      #                              :id => 125
      #                         }
      #
      #           }
      #
      #:current_user_id => 123 #user_id for self (calling user)  #Handled internally
      #
      #
      #OUTPUT
      # [
      #
      #   {
      #
      #     :post=>
      #     {
      #       :id=>10, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
      #       :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
      #       :text=> text:Had a great pizza at pizza hut #food #italian http://pizzahut.com/123/234\n user_id:123
      #       :if_yaml => true,
      #       :summary_id=>9,
      #       :source_name=>"twitter",
      #       :source_object_id => "12233",
      #       :source_object_type => "post", #AppConstants.source_object_type_post/like
      #       :category_data => {:id => "food",:name => "food and drink",:type => "/food", :hierarchy => "/", :default_channel => "food"   }
      #     },
      #
      #     :location=>
      #     {
      #         :id => 223
      #
      #         :lat=>#<BigDecimal:9de78e0,'0.2345E2',18(18)>, :long=>#<BigDecimal:9de77c8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>8
      #   ,     :city => "bangalore", :country => "india", :region => "karnataka",
      #         :source_object_id => "123344",
      #
      #         :source_name=>"twitter",
      #         :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #     },
      #
      #     #COMMENT => Tag type check in constants,yml #TAG TYPE
      #     :tags =>
      #     {
      #       :count => 2,
      #       :array => [
      #                     {:id => 1, :name => "food",    :source_name => "twitter", :source_msg_id =>  "12233"},
      #                     {:id => 3, :name => "italian", :source_name => "twitter", :source_msg_id =>  "12233"}
      #                 ]
      #     }
      #
      #    :documents=>
      #    {
      #       :count=>1,
      #       :array=>[
      #                   {
      #                       :id=>729,
      #                       :source_name=>"twitter",
      #                       :type=>"link",
      #                       :source_msg_id => "12233", [OBJECT ID OF POST]
      #                       :source_object_id => nil,        #id of doc object on twitter
      #
      #                       :url=>"http://pizzahut.com/123/234",
      #                       :url_description=>"Cheese crest pizzas at pizza hut",
      #                       :url_category=>"food", :url_title=>"pizza hut", :url_image=>nil, :url_provider=>"pizzahut.com"}
      #                 },
      #
      #           ]
      #    },
      #
      #    :entities=>
      #    {
      #       :count=>1,
      #       :array=>[
      #
      #                   {
      #                       :id => 123
      #
      #                       :name => Pizza
      #                       :image => ""http://freebase.com/pizza.jpg",
      #                       :description => ""http://freebase.com/text.html",

      #                       :source_name => "twitter"
      #                       :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                   }
      #           ]
      #    },
      #  },# single post hash
      #  :post=>
      #     {
      #       #EXAMPLE TEXT =  Google putting new privacy policy  http://facebook.photo.com/123/234 #google #privacy,
      #       #NOT INCLUDED IN RESPONSE OF PRIVATE SERVICES LIKE FACEBOOK
      #
      #       :id=>11, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
      #       :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
      #       :summary_id=>10,
      #       :source_name=>"facebook",
      #       :source_object_id => "12233",
      #       :category_data => {:id => "technology",:name => "technology",:type => "/technology", :hierarchy => "/", :default_channel => "technology"   }
      #     },
      #
      #     :location=>
      #     {
      #       :id => 234,
      #       :source_name => "facebook"
      #       :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #     },
      #
      #     #COMMENT => Tag type check in constants,yml #TAG TYPE
      #     :tags =>
      #     {
      #       :count => 2,
      #       :array => [
      #                     { :id => 345, :source_name => "facebook", :source_msg_id =>  "12234"},
      #                     { :id => 456, :source_name => "facebook", :source_msg_id =>  "12234"}
      #                 ]
      #     }
      #
      #    :documents=>
      #    {
      #       :count=>1,
      #       :array=>[
      #                   {
      #                       :id=>730,
      #                       :type=>"photo",
      #                       :source_name=>"facebook",
      #                       :source_msg_id => "12234", [OBJECT ID OF POST]
      #                       :source_object_id => 234,  #id of doc object on facebook.. It will be only present for
      #                                                  #uploaded objects at source. Exemplary here
      #
      #                 },
      #
      #           ]
      #    },
      #
      #    :entities=>
      #    {
      #       :count=>1,
      #       :array=>[
      #
      #                   {
      #                       :id => 124
      #                       :source_name =>"facebook",
      #                       :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #                   }
      #           ]
      #    },
      #  }# single post hash
      # ......
      # ]#stream array
      def get_stream(params ={})

        Rails.logger.info("[LIB] [API] [STREAMS] [get_stream] entering #{params.inspect}")

        #sanity check
        if params[:user_id].blank? or params[:current_user_id].blank?
          Rails.logger.info("[LIB] [API] [STREAMS] [get_stream] Blank user_id or current_user_id")
          return {}
        end

        array = []

        query = {
                   :user_id => params[:user_id],
                   :summary_id =>params[:summary_id],
                   :source_name =>params[:source_name],
                   :till => params[:till],
                   :since => params[:since]
                  }

        params[:query] = query

        if !params[:filter].blank?
          if !params[:filter][:entity].blank?
            array = get_entity_stream(params)

          elsif !params[:filter][:document].blank?
            array = get_document_stream(params)

          elsif !params[:filter][:location].blank?
            array  = get_location_stream(params)

          end
        else

          array = get_all_activity({
                                  :query => params[:query],
                                  :current_user_id => params[:current_user_id],
                                  :user_id => params[:user_id],
                                  :limit => params[:limit],
                                 })

        end

        Rails.logger.info("[LIB] [API] [STREAMS] [get_stream] leaving")
        array
      rescue => e
        Rails.logger.error("[LIB] [API] [STREAMS] [get_stream] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end



      #INPUT => Same as get_stream
      #OUTPUT => Same as get_stream
      def get_entity_stream(params)
        Rails.logger.info("[LIB] [API] [STREAMS] [get_entity_stream] Entering")

        h = ::Api::Helpers::PlanTableQuery.plan_hub_query(params[:query])

        if h.blank?
          Rails.logger.info("[LIB] [API] [STREAMS] [get_entity_stream] entering Leaving => Blank Query Hash => #{params.inspect}")
          return {}
        end

        array = []

        args = params[:filter][:entity]
        h[:entity_id.not_eq] = nil if !args[:all].blank?
        h[:entity_id] =  args[:id] if !args[:id].blank?

        hash = {}
        Hub.where(h).all.each do |attr|
           hash[attr.activity_id] = true
        end

        Rails.logger.info("[LIB] [API] [STREAMS] [get_entity_stream] Number of Entities Found #{hash.size}")
        query = {
                  :query => {:id => hash.keys},
                  :current_user_id => params[:current_user_id],
                  :user_id => params[:user_id],
                  :limit => params[:limit],
                }

        array = get_all_activity(query)

        Rails.logger.info("[LIB] [API] [STREAMS] [get_entity_stream] Leaving => Stream Size = #{array.size}")
        array
      rescue => e
        Rails.logger.error("[LIB] [API] [STREAMS] [get_entity_stream] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end



      #INPUT => Same as get_stream
      #OUTPUT => Same as get_stream
      def get_location_stream(params)
        Rails.logger.info("[LIB] [API] [STREAMS] [get_location_stream] Entering")

        array = []

        args = params[:filter][:location]
        params[:query][:all_location] = true if !args[:all].blank?
        params[:query][:location_id] =  args[:id] if !args[:id].blank?

        array = get_all_activity({
                                  :query => params[:query],
                                  :current_user_id => params[:current_user_id],
                                  :user_id => params[:user_id],
                                  :limit => params[:limit],
                                })

        Rails.logger.info("[LIB] [API] [STREAMS] [get_location_stream] Leaving")
        array

      rescue => e
        Rails.logger.error("[LIB] [API] [STREAMS] [get_entity_stream] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end



      #INPUT => Same as get_stream
      #OUTPUT => Same as get_stream
      def get_document_stream(params)

        Rails.logger.info("[LIB] [API] [STREAMS] [get_document_stream] Entering")

        h = ::Api::Helpers::PlanTableQuery.plan_document_query(params[:query])

        if h.blank?
          Rails.logger.info("[LIB] [API] [STREAMS] [get_document_stream] entering Leaving => Blank Query Hash => #{params.inspect}")
          return {}
        end

        array = []

        args = params[:filter][:document]
        #h[:id.not_eq] = nil if !args[:all].blank?
        h[:id] =  args[:id] if !args[:id].blank?
        h[:category] = args[:type] if !args[:type].blank?


        hash = {}

        Document.where(h).all.each do |attr|
          hash[attr.activity_id] =  true
        end

        Rails.logger.info("[LIB] [API] [STREAMS] [get_document_stream] Number of Docs Found #{hash.size}")

        query = {
                  :query => {:id => hash.keys},
                  :current_user_id => params[:current_user_id],
                  :user_id => params[:user_id],
                  :limit => params[:limit],
                }

        array = get_all_activity(query)

        Rails.logger.info("[LIB] [API] [STREAMS] [get_document_stream] Leaving")

        array

      rescue => e
        Rails.logger.error("[LIB] [API] [STREAMS] [get_document_stream] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end
    end
  end
end