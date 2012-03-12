class ActivityWord < ActiveRecord::Base
#
#  #should not get deleted
#  has_many :activities  #:dependent => :nullify # some how if words get deleted activities should still be there
#
#  has_many :documents  #:dependent => :nullify  # some how if words get deleted documents should still be there
#
#  has_many :summaries  #:dependent => :nullify  # some how if words get deleted summaries should still be there
#
#  has_many :hubs
#  has_many :entities, :through => :hubs
#  has_many :locations, :through => :hubs
#  has_many  :users, :through => :hubs

  validates_presence_of    :word_name
  validates_uniqueness_of  :word_name


  class << self

    def create_activity_word(word, relation = "")

      word = word.downcase
      #finding first instead of creating as more chances of find than create for words
      word_rel = ActivityWord.where(:word_name => word)

      begin
        if word_rel.blank?
          word_obj = ActivityWord.create!(:word_name => word)
        else
          word_obj = word_rel.first
        end
      rescue => e
        Rails.logger.error("ActivityWord => Create_Activity_word => Failed => #{e.message} => for word #{word}")
        return nil
      end

      if relation.blank?
        return word_obj
      end

      word_obj
    end
  end
end


# == Schema Information
#
# Table name: activity_words
#
#  id         :integer         not null, primary key
#  word_name  :text            not null
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

