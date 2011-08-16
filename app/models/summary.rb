class Summary < ActiveRecord::Base

  serialize :entity_array,   Array
  serialize :document_array, Array
  serialize :activity_array, Array
  serialize :location_array, Array
  serialize :tag_array, Array
  serialize :social_counters, Array

  has_many    :activities, :order => "updated_at DESC"

  has_many    :entities, :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :locations, :through => :hubs, :uniq => true, :order => "updated_at DESC"

  has_many    :documents,:order => "updated_at DESC"

  has_many    :tags,     :order => "updated_at DESC"

  belongs_to  :user, :touch => true
  belongs_to  :activity_word, :touch => true

  validates_presence_of :activity_name
  validates_length_of   :activity_name , :in => 1..AppConstants.activity_name_length

  validates_uniqueness_of :user_id, :scope => :activity_word_id

  before_destroy :ensure_proper_destroy
  after_destroy  :check_destroy
  public
    def check_destroy
      puts "summary after destroy"
    end
    def rebuild_a_summary

       s = self

       if self.nil?
         return
       end

       Rails.logger.info("[MODEL] [SUMMARY] [reset_summary] resetting activity summary #{self.inspect}")

       #Recreate Document Array for given summary
       s.activity_array = []
       a = Activity.where(:summary_id => self.id, :blank_text => false).group(:id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
       s.activity_array = a.keys if !a.blank?


       #Recreate Document Array for given summary
       s.document_array = []
       a = Document.where(:summary_id => self.id).group(:id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
       s.document_array = a.keys if !a.blank?

       #Recreate Location Array for given summary
       s.location_array = []
       a = Activity.where(:summary_id => self.id, :base_location_id.not_eq => nil).group(:base_location_id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
         s.location_array = a.keys if !a.blank?

       #Recreate Entity Array for given summary
       s.entity_array = []
       a = Hub.where(:summary_id => self.id, :entity_id.not_eq => nil).group(:entity_id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
       s.entity_array = a.keys if !a.blank?

       #Recreate Entity Array for given summary
       s.tag_array = []
       a = Tag.where(:summary_id => self.id).group(:id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count
       s.tag_array = a.keys if !a.blank?

       s.update_attributes(s.attributes)

       Summary.reset_counters(self.id,:activities, :tags, :documents)

    end

    def ensure_proper_destroy
      puts "before summary destroy"
      if self.activities.size == 1
        Rails.logger.info("Summary Getting Deleted #{self.inspect}")
      else
        Rails.logger.info("Summary Safe #{self.inspect}")
        #cant call rebuild_a_summary from here as this is making the transaction itself false
        false
      end
    end

  public
    include RingBuffer

    #INPUT => {"document" => [1,2,3]},
    #         {"location" => [1,2,3]},
    #         {"activity" => [2]}.
    #         {"entity" => [2,4,5]}
    #         {"tag"  => [2,3,4]}
    def serialize_data(params)
        array = []
        hash = {}

        params.keys.each do |attr|
          serial = "#{attr}_array"

          if self[serial].nil?
            self[serial] = []
          end

          array = self[serial]

          #removes duplicates from params
          common = array & params[attr]
          params[attr] = params[attr] - common

          array = ring_buffer(array, AppConstants.max_number_of_a_type_in_summmary, params[attr])

          hash[serial.to_sym] = array
        end

        self.update_attributes(hash)
    end
    def deserialize_data

    end
    class << self

      #INPUT => :activity_word_id => 123, :user_id => 123, :activity_name => "eating""
      def create_summary(params)
         summary = Summary.create!(:activity_word_id => params[:activity_word_id], :user_id => params[:user_id],
                             :activity_name => params[:activity_name],:document_array => [],
                             :activity_array => [], :location_array => [], :entity_array => [], :tag_array => [])
      rescue => e
         Rails.logger.info("Summary => create_summary => Rescue " +  e.message )
         summary = nil
         #Validation Uniqueness fails
         if /has already been taken/ =~ e.message
           params.delete(:activity_name)
           summary = Summary.where(params).first
           Rails.logger.info("Summary => create_summary => Rescue => Uniq index found " + params.to_s)
         end
        return summary
      end
    end
end





# == Schema Information
#
# Table name: summaries
#
#  id               :integer         not null, primary key
#  user_id          :integer         not null
#  activity_word_id :integer         not null
#  activity_name    :string(255)     not null
#  activities_count :integer
#  documents_count  :integer
#  tags_count       :integer
#  location_array   :text
#  entity_array     :text
#  activity_array   :text
#  document_array   :text
#  tag_array        :text
#  created_at       :datetime
#  updated_at       :datetime
#

