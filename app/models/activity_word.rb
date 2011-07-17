# == Schema Information
# Schema version: 20110611114344
#
# Table name: activity_words
#
#  id         :integer         not null, primary key
#  word_name  :string(255)     not null
#  created_at :datetime
#  updated_at :datetime
#

class ActivityWord < ActiveRecord::Base

  has_many :related_words, :foreign_key => :related_word_id, :class_name => "WordForm", :dependent => :destroy

  #should not get deleted
  has_many :activities  #:dependent => :nullify # some how if words get deleted activities should still be there

  has_many :documents  #:dependent => :nullify  # some how if words get deleted documents should still be there

  has_many :summaries  #:dependent => :nullify  # some how if words get deleted summaries should still be there

  has_many :hubs
  has_many :entities, :through => :hubs
  has_many :locations, :through => :hubs
  has_many  :users, :through => :hubs

  validates_presence_of    :word_name
  validates_uniqueness_of  :word_name


  class << self

    #return the word object
    #Available Relations
    # synonym = Return the synonym word relationship type.
    # antonym = 	Return the synonym word relationship type.
    # form =  	Return the form word relationship type.
    #hyponym  = 	Return the hyponym word relationship type.
    #variant = Return the variant word relationship type.
    # verb-stem =	Return the verb stem word relationship type.
    #verb-form = 	Return the verb form word relationship type.
    # cross-reference = 	Return the cross-reference word relationship type.
    #same-context =	Return the same context word relationship type.

    def create_activity_word(word, relation = "")

      word.downcase!
      #finding first instead of creating as more chances of find than create for words
      word_rel = ActivityWord.where(:word_name => word)

      begin
        if word_rel.blank?
          puts "hello !"
          word_obj = ActivityWord.create!(:word_name => word.downcase)
        else
          word_obj = word_rel.first
        end
      rescue => e
        Rails.logger.info("ActivityWord => Create_Activity_word => Failed => #{e.message} => for word #{word}")
        return nil
      end

      if relation.blank?
        return word_obj
      end

      #check if give type of relation exists for this word
      rel = WordForm.where(:related_word_id => word_obj.id, :relation_type => relation)
      puts " #{word} <=> #{relation} " + rel.count.to_s
      if !rel.blank?
        return word_obj
      end

      ActivityWord.CreateRelatedWords(word_obj, relation)
      puts
      return word_obj
    end

    #return the objects of related activity words. Defaults to verb-form
    def FindWordForm(act_obj, form = "verb-form")
      a_obj = WordForm.select(:activity_word_id).where(:related_word_id => act_obj.id, :relation_type => form).all
      a_obj.inject(act = []){|arr, element| arr << element.activity_word_id}
      b_act = ActivityWord.where(:id => act).all
      puts b_act
      return b_act
    end

    #return a JSON
    def GetRelatedWords(word, relation)
      related_words = {}
      word =~ /^[A-Z]?[a-z]*/
      if $& == word
        word.downcase!
        related_words =  Wordnik.word.get_related_words(word, :limit => 50, :type => relation)
        puts related_words
      end
      return related_words
    end

    def CreateRelatedWords(word_obj, relation)
      #find words of type relation for input word
      related_words = ActivityWord.GetRelatedWords(word_obj.word_name, relation)

      #create the new words entry in ActivityWord and also create their relation in WordForm
      if !related_words.blank?
        related_words[0]["words"].each do |attr|

          w_obj =  ActivityWord.where(:word_name => attr).first
          begin
            if w_obj.blank?
              puts attr.downcase
              w_obj = ActivityWord.create!(:word_name => attr)
            end

            WordForm.create!(:activity_word_id => w_obj.id , :word_form_name => attr, :related_word_id => word_obj.id,
                           :relation_type => relation)
          rescue
            Rails.logger.warn("Activity Word => CreateRelatedWords => Word Creation Error #{attr}")
          end
        end
      else
        Rails.logger.info("ActiveWord=>CreateRelatedWords => No Related words for #{word_obj.word_name}")
      end
    end

    handle_asynchronously :CreateRelatedWords
  end
end
