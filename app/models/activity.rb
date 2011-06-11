# == Schema Information
# Schema version: 20110609094335
#
# Table name: activities
#
#  id               :integer         not null, primary key
#  activity_dict_id :integer         not null
#  activity_text    :text            not null
#  activity_name    :string(255)     not null
#  author_id        :integer         not null
#  parent_id        :integer
#  ancestry         :string(255)
#  ancestry_depth   :integer         default(0)
#  created_at       :datetime
#  updated_at       :datetime
#

#TODO add i18n error messages in all validations
#TODO move all constants to environments
class Activity < ActiveRecord::Base

  has_ancestry   :cache_depth => 3


  belongs_to :author, :class_name => "User", :touch => true
   #:touch => true can be un-optimal for deep nested threading
  belongs_to     :parent, :class_name => "Activity",  :foreign_key => "parent_id", :touch => true

  #destroy will happen from activity
  has_many      :hubs, :dependent => :destroy

  has_many      :entities, :through => :hubs
  has_one        :location,:through => :hubs

  has_many    :mentions, :dependent => :destroy #destroy will happen from activity
  has_many    :campaigns, :dependent => :destroy
  has_many    :documents, :dependent => :nullify # documents have life time more than activity

  belongs_to :activity_word

  before_save       :ensure_valid_parent_and_author
  before_destroy    :ensure_before_destroyed
  after_save        :ensure_tables_setup_at_save

  validates_existence_of  :author
  validates_existence_of  :activity_word

  validates_presence_of     :activity_name, :activity_text

  validates_length_of       :activity_text , :in => 1..2048

  validates_length_of   :activity_name,   :in => 1..255

  protected

    def  ensure_tables_setup_at_save
      #TODO all tables setup - hub, mentions, campaigns
    end
    def ensure_before_destroyed
      puts "activity deleted #{self.id} #{self.activity_name}"
      #TODO all tables CLEANUP - hub, mentions, campaigns
    end

    def ensure_valid_parent_and_author

      if !new_record?
        if self.author_id_changed? || self.parent_id_changed?
          puts "changing author"
          Rails.logger.info("Trying to edit" + (self.author_id_changed? ? " author":" parent" ))
          raise ActiveRecord::RecordNotSaved.new(self)
        end

      else
        if self.parent_id.nil?
          Rails.logger.info("Root Activity created by #{self.author}")
          puts "nil parent"
        else
          if !Activity.unscoped.exists?(self.parent)
            puts "invalid parent"
            Rails.logger.error("Invalid Parent of Activity created by #{self.author}")
            errors[:parent] << "Invalid parent of activity is being created"
            raise ActiveRecord::RecordInvalid.new(self)
          end
        end

      end
    end

  public
    def self.board (user, filter_activity = {})
      u = User.all #change it with users in contact
      a = Activity.where(:author_id => u, :ancestry => nil).order("updated_at DESC").limit(5)

      # TODO Add Campaigns to each activity
      # TODO Add user name and photograph Id to each activity

      h = Hash[*a.collect { |v|
                [v, v.subtree.from_depth(1).arrange]
              }.flatten]
      puts h
    end

    def self.page (user, filter_activity = {})
      #TODO Only users activity. if its not root then show only that activity without its parent and child
    end

    #TODO
    def self.top_activities (user)

    end
    #TODO
    def self.campaign_count (user, act_id)

    end
    #TODO
    def self.bookmarked_activity (user)

    end
    #TODO
    def self.parse_activity(xml_data)

    end
    #TODO
    def self.update_activity(act)

    end
    #TODO
    def self.delete_activity(act)

    end
    #TODO
    def self.create_activity(act_hash)

    end
end
