class ActivityWord < ActiveRecord::Base

  has_many :related_words, :foreign_key => :related_word_id, :class_name => "WordForm", :dependent => :destroy

  #should not get deleted
  has_many :activities, :dependent => :destroy

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

    def CreateActivityWord(word, relation = "")

      #finding first instead of creating as more chances of find than create for words
      word_rel = ActivityWord.where(:word_name => word)

      begin
        if word_rel.blank?
          puts "hello !"
          word_obj = ActivityWord.create!(:word_name => word)
        else
          word_obj = word_rel.first
        end
      rescue => e
        return nil
      end

      if relation.blank?
        return word_obj
      end

      #icheck if give type of relation exists for this word
      rel = WordForm.where(:related_word_id => word_obj.id, :relation_type => relation)
      puts " #{word} <=> #{relation} " + rel.count.to_s
      if !rel.blank?
        return word_obj
      end

      #find words of type relation for input word
      related_words = ActivityWord.GetRelatedWords(word, relation)

      #create the new words entry in ActivityWord and also create their relation in WordForm
      if !related_words.blank?
        related_words[0]["words"].each do |attr|

          w_obj =  ActivityWord.where(:word_name => attr).first

          if w_obj.blank?
            puts "wow"
            w_obj = ActivityWord.create!(:word_name => attr)
          end

          WordForm.create!(:activity_word_id => w_obj.id , :word_form_name => attr, :related_word_id => word_obj.id,
                          :relation_type => relation)
        end
      else
        Rails.logger.info("ActiveWord=>CreateActivityWord => No Related words for #{word}")
      end
      return word_obj
    end

    #return the objects of related activity words. Defaults to verb-form
    def FindWordForm(act_obj, form = "verb-form")
      a_obj = WordForm.includes(:activity_word).select(:activity_word_id).where(:related_word_id => act_obj.id, :relation_type => form)
      a_obj.inject(act = []){|arr, element| arr << element.activity_word}
      return act
    end

    #return a JSON
    def GetRelatedWords(word, relation)
      word =~ /^[A-Z]?[a-z]*/
      if $& == word
        word.downcase!
        related_words =  Wordnik.word.get_related_words(word, :limit => 50, :type => relation)
        #puts related_words.to_s
      end
      return related_words
    end
  end
end
