class SummaryRank < ActiveRecord::Base

  belongs_to :summary

  belongs_to :location
  belongs_to :entity

  validates_uniqueness_of :summary_id    ,:unless => Proc.new {|a| a.summary_id.nil?}
  validates_uniqueness_of :location_id   ,:unless => Proc.new {|a| a.location_id.nil?}
  validates_uniqueness_of :entity_id    ,:unless => Proc.new {|a| a.entity_id.nil?}

  serialize :posts,         Hash
  serialize :comments,      Hash
  serialize :likes,         Hash
  serialize :actions,       Hash
  serialize :demographics,  Hash
  serialize :subscribers,   Hash
  serialize :documents,     Hash
  serialize :channel_ranks, Hash
  serialize :analytics_summary, Hash
  serialize :views, Hash

  RANK_FIELDS = ["posts", "likes", "comments", "subscribers", "demographics", "action", "documents"]

  after_save  :update_analytics_in_models

  def  update_analytics_in_models
    Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] entering ")

    #puts self.channel_ranks[Time.now.strftime("%m/%d/%y")]
    rank = nil
    rank = self.channel_ranks[Time.now.strftime("%m/%d/%y")]   if  !self.channel_ranks.blank?
    if !self.summary_id.blank?

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] updating summary ID #{self.summary_id} with #{self.analytics_summary}")
      s = Summary.where(:id => self.summary_id).first
      s.analytics_summary = {}

      s.update_attributes(:analytics_summary => self.analytics_summary, :rank => rank)

    elsif !self.location_id.blank?

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] updating summary ID #{self.location_id} with #{self.analytics_summary}")
      l = Location.where(:id => self.location_id).first
      l.analytics_summary = {}
      l.update_attributes(:analytics_summary => self.analytics_summary, :rank => rank)

    elsif !self.entity_id.blank?

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] updating summary ID #{self.entity_id} with #{self.analytics_summary}")
      e = Entity.where(:id => self.entity_id).first
      e.analytics_summary = {}
      e.update_attributes(:analytics_summary => self.analytics_summary, :rank => rank)

    end
    Rails.logger.info("[MODEL] [SUMMARY_RANK] [update_analytics_in_models] leaving ")

  end

  class << self
    #COMMENT - Return the most recent analytics SNAPSHOT of summary OR location or entity
    #INPUT => {:summary_id => 123 OR :location_id => 234 OR :entity_id => 234}
    #OUTPUT => {"posts" =>{:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45} #many new services can come this is Exemplary
    #           "comments" => {:total => 34, :actwitty => 20, :facebook => 14 }
    #           "likes" =>{:total => 123, :actwitty => 33, :facebook => 90 }
    #           "actions" =>  {:share => 24, :views => 90}
    #           "demographics" => {:total => 40,:male => 20, :female => 18, :others => 2,
    #                             :age_group => {"18-24" => {:total => 20,:male => 10, :female => 11, :others => 0},
    #                            "35-44" => {:total => 20,:male => 10, :female => 7, :others => 2}}}
    #                            See constants.yml for age_band
    #           "subscribers" => 345
    #           "documents" =>  {"total" => 160, "image" => 24, "video" => 90, "audio" => 46}
    #           "channel_ranks" => 234

    def get_analytics_summary(params)

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS_SUMMARY] entering #{params}")
      object = SummaryRank.where(params).first

      if object.blank?
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS_SUMMARY] nothing found for params #{params}")
        return {}
      end
      Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS_SUMMARY] leaving #{params}")
      object.analytics_summary

    end


    #COMMENT - Return the 90 days analytics..
    #INPUT => {:summary_id => 123 OR :location_id => 234 OR :entity_id => 234,
    #         :fields => ["posts","likes", "comments"..]}
    #OUTPUT => {"posts" =>[{"11/11/2011"=>{:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45}},..] #many new services can come this is Exemplary
    #           "comments" => [{"11/11/2011"=>{:total => 34, :actwitty => 20, :facebook => 14 }},...]
    #           "likes" => [{"11/11/2011"=>{:total => 123, :actwitty => 33, :facebook => 90 }}..]
    #           "actions" => [{"11/11/2011"=>{:share => 24, :views => 90}},..]
    #           "demographics" =>[{"11/11/2011"=> {:total => 40,:male => 20, :female => 18, :others => 2,
    #                             :age_group => {"18-24" => {:total => 20,:male => 10, :female => 11, :others => 0},
    #                            "35-44" => {:total => 20,:male => 10, :female => 7, :others => 2}}}},..]
    #                            See constants.yml for age_band
    #           "subscribers" => [{"11/11/2011"=>345},..]
    #           "documents" =>  [{"11/11/2011"=>{"total" => 160, "image" => 24, "video" => 90, "audio" => 46}},..]
    #           "channel_ranks" => [{"11/11/2011"=>234},..]

    def get_analytics(params)

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS] entering #{params}")
      hash = {}
      h = params.except(:fields)
      object = SummaryRank.where(h).first

      if object.blank?
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS] nothing found for params #{params}")
        return {}
      end
      if params[:fields].include?("all")
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS] return all attributes  #{params}")
        return object.attributes
      end
      params[:fields].each do |attr|
        hash["#{attr}"] = object.send("#{attr}")
      end

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [GET_ANALYTICS] leaving  #{params}")
      hash
    end

    #INPUT => { :fields => ["posts","likes", "comments"..],:summary_id => 123, or :location_id => 234 or :entity_id => 234}
    def add_analytics(params)
      Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] entering #{params}")

      updated = false

      h = params.except(:fields)
      hash = {}
      subject = nil
      object = SummaryRank.where(h).first

      if object.blank?
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] new object #{h}")

        if !h[:summary_id].blank?
          subject = Summary.where(:id => h[:summary_id]).first

        elsif !h[:location_id].blank?
          subject = Location.where(:id => h[:location_id]).first

        else !h[:entity_id].blank?
          subject = Entity.where(:id => h[:entity_id]).first
        end

        if subject.blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] invalid object passed as input #{h}")
          return nil
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] creating object #{params}")
        object =create!(h)
      end

      date = Time.now.strftime("%m/%d/%y")

      if params[:fields].include?("all")
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] including ALL FIELDS #{params}")
        params[:fields] =  RANK_FIELDS
      end

      params[:fields].each do |attr|

        data = send("add_#{attr}_analytics", params)

        if !data.blank?
          object.send("#{attr}=",{}) if object.send(attr).nil?
          object.send(attr)[date] = data
          #remove data points if needed
          object.send(attr).shift if object.send(attr).length > AppConstants.number_of_data_points

          object.analytics_summary = {} if object.analytics_summary.blank?
          object.analytics_summary["#{attr}"] = data

          hash[attr.to_sym] = object.send(attr)
          hash[:analytics_summary] =  object.analytics_summary
          updated = true
        end
      end

      if updated == true
        object.channel_ranks = {} if object.channel_ranks.blank?
        object.channel_ranks[date] = get_summary_rank(object)
        hash[:channel_ranks] = object.channel_ranks
        object.update_attributes!(hash)
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] Updating channel rank and analytics #{params}")
      end

      Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] leaving #{params}")

      return object.attributes
    rescue => e
      Rails.logger.error("[MODEL] [SUMMARY_RANK] [ADD_ANALYTICS] error #{params} => #{e.message}")
      return nil
    end

    handle_asynchronously :add_analytics

    private
      def get_summary_rank(object)
        #Dummy rank
        #object.analytics_summary["posts"][:total]
        234
      end
      def get_age_band(age)

        case age
          when 1..12
            return AppConstants.age_band_kids # "1-12"
          when 13..17
            return AppConstants.age_band_teens # "13-17"
          when 18..24
            return AppConstants.age_band_geny # "18-24"
          when 25..34
            return AppConstants.age_band_genx  # "25-34"
          when 35..44
            return AppConstants.age_band_forties # "35-44"
          when 45..54
            return AppConstants.age_band_fifties # "45-54"
          when 55..64
            return AppConstants.age_band_sixties # "55-64"
          else
            return AppConstants.age_band_seniors # "65+"
        end
      end
      #INPUT => { :summary_id => 123, or :location_id => 234 or :entity_id => 234}
      #OUTPUT => {:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45}
      def add_posts_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] exiting #{params}")

        posts = nil
        count = 0
        hash = {:total => 0}

        if !params[:entity_id].blank?
          posts = Hub.where(:entity_id => params[:entity_id]).group(:source_name).count
        elsif !params[:location_id].blank?
          posts = Activity.where(:base_location_id => params[:location_id]).group(:source_name).count
        elsif !params[:summary_id].blank?
          posts = Activity.where(:summary_id => params[:summary_id]).group(:source_name).count
        end

        if posts.blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] - no post found for input params #{params}")
          return nil
        end

        posts.each do |attr|
          hash[attr[0].to_sym] = attr[1]
          hash[:total] += attr[1]
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_POSTS_ANALYTICS] exiting #{params}")
        hash

      end

      #INPUT => { :summary_id => 123, or :location_id => 234 or :entity_id => 234}
      #OUTPUT => {:total => 34, :actwitty => 20, :facebook => 14 }
      def add_likes_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LIKES_ANALYTICS] entering #{params}")


        hash = {:total => 0}
        h = {}

        if !params[:summary_id].blank?
          h = {:summary_id => params[:summary_id]}
        elsif !params[:location_id].blank?
          h = {:location_id => params[:location_id]}
        elsif !params[:entity_id].blank?
          h = {:entity_id => params[:entity_id]}
        end

        if h.blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LIKES_ANALYTICS] no likes found for input params #{params}")
          return nil
        end

        h[:name] = "like"
        campaigns = Campaign.where(h).group(:source_name).count

        campaigns.each do |attr|
          hash[attr[0].to_sym] = attr[1]
          hash[:total] += attr[1]
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_LIKES_ANALYTICS] leaving #{params}")
        hash
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => {:total => 34, :actwitty => 20, :facebook => 14 }
      def add_comments_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_COMMENTS_ANALYTICS] entering #{params}")

        hash = {:total => 0}
        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_COMMENTS_ANALYTICS] no comments found for summary => #{params}")
          return nil
        end

        comments = Comment.where(:summary_id => params[:summary_id]).group(:source_name).count

        comments.each do |attr|
          hash[attr[0].to_sym] = attr[1]
          hash[:total] += attr[1]
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_COMMENTS_ANALYTICS] leaving #{params}")
        hash
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => 232
      def add_subscribers_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SUBSCRIBERS_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SUBSCRIBERS_ANALYTICS] blank summary #{params}")
          return nil
        end

        count = nil
        count = SummarySubscribe.where(:summary_id => params[:summary_id]).count
        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_SUBSCRIBERS_ANALYTICS] leaving #{params}")
        count

      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => {:total => 40,:male => 20, :female => 18, :others => 2,
      #       :age_group => {"18-24" => {:total => 20,:male => 10, :female => 11, :others => 0},
      #       "35-44" => {:total => 20,:male => 10, :female => 7, :others => 2}}}

      def add_demographics_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DEMOGRAPHICS_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DEMOGRAPHICS_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:total => 0,:male => 0, :female => 0, :others => 0, :age_group => {}}
        count = 0
        today = Date.today
        SummarySubscribe.includes(:subscriber).where(:summary_id => params[:summary_id]).all.each do |attr|
          hash[:total] += 1

          attr.subscriber.gender = "male"
          attr.subscriber.dob = "12/15/1978"

          hash[attr.subscriber.gender.to_sym] += 1

          arr = attr.subscriber.dob.split('/')   #mm/dd/yyyy format string to array
          dob= Date.new(Integer(arr[2]) + 10*hash[:total],Integer(arr[0]), Integer(arr[1]))

          d = Date.new(today.year, dob.month, dob.day)
          age = d.year - dob.year - (d > today ? 1 : 0)

          band = get_age_band(Integer(age))
          puts band
          hash[:age_group][band] = {:total => 0, :male => 0, :female => 0, :others => 0} if hash[:age_group][band].blank?

          hash[:age_group][band][:total] +=1
          hash[:age_group][band][attr.subscriber.gender.to_sym] += 1
          count += 1
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DEMOGRAPHICS_ANALYTICS] leaving #{params}")
        hash
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => :share => 24, :views => 90
      def add_actions_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ACTION_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ACTION_ANALYTICS] blank summary #{params}")
          return nil
        end

        hash = {:total => 0}
        shares = SocialCounter.where(:summary_id => params[:summary_id]).group(:action).count
        puts "=========== + " + shares.inspect
        shares.each do |attr|
          hash[attr[0].to_sym] = attr[1]
          hash[:total] += attr[1]
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_ACTION_ANALYTICS] leaving #{params}")
        hash
      end

      #INPUT => { :summary_id => 123}
      #OUTPUT => "total" => 160, image" => 24, "video" => 90, "audio" => 46
      def add_documents_analytics(params)

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENT_ANALYTICS] entering #{params}")

        if params[:summary_id].blank?
          Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENT_ANALYTICS] blank summary #{params}")
          return nil
        end

        count = nil
        hash = {:total => 0}

        docs = Document.where(:summary_id => params[:summary_id]).group(:category).count

        puts docs.inspect
        docs.each do |attr|
          hash[attr[0].to_sym] = attr[1]
          hash[:total] += attr[1]
        end

        Rails.logger.info("[MODEL] [SUMMARY_RANK] [ADD_DOCUMENT_ANALYTICS] leaving #{params}")
        hash
      end

  end
end



# == Schema Information
#
# Table name: summary_ranks
#
#  id                :integer         not null, primary key
#  summary_id        :integer
#  location_id       :integer
#  entity_id         :integer
#  posts             :text
#  likes             :text
#  actions           :text
#  subscribers       :text
#  comments          :text
#  demographics      :text
#  documents         :text
#  channel_ranks     :text
#  views             :text
#  analytics_summary :text
#  created_at        :datetime
#  updated_at        :datetime
#

