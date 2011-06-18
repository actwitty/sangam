require 'spec_helper'

describe ActivityWord do
  describe "Validation" do
    it "should not allow nil word" do
      lambda{
        w_id = Factory(:activity_word,:word_name => nil)
      }.should raise_error ActiveRecord::RecordInvalid
    end
     it "should not allow duplicate word" do
      lambda{
        w_i = Factory(:activity_word)
        w_id = Factory(:activity_word,:word_name => w_i.word_name)
      }.should raise_error ActiveRecord::RecordInvalid
     end
    it "should allow different cases of same word" do
      lambda{
        w_i = Factory(:activity_word, :word_name => "testhelo")
        w_id = Factory(:activity_word,:word_name => "Testhelo")
      }.should_not raise_error ActiveRecord::RecordInvalid
    end
  end
  describe "Create" do
    include DelayedJobSpecHelper
    it "should create word forms" do
      w_id = ActivityWord.CreateActivityWord("TesTing", "verb-form")
      w_id1 = ActivityWord.CreateActivityWord("test", "form")
      w_id2 = ActivityWord.CreateActivityWord("DEepika", "verb-form")
      w_id3 = ActivityWord.CreateActivityWord("test", "")
      work_off
      w_id1.related_words.count.should == 2
      w_id3.should == w_id1
#      w_id1.should == w_id
    end
  end
  describe "Read" do
    include DelayedJobSpecHelper

    it "should be able to read activity_word_id of all word forms" do
      w_id = ActivityWord.CreateActivityWord("TesTing", "verb-form")
      w_id1 = ActivityWord.CreateActivityWord("test", "")
      w_id2 = ActivityWord.CreateActivityWord("DEepika")
      w_id3 = ActivityWord.CreateActivityWord("test", "verb-form")
      w_id4 = ActivityWord.CreateActivityWord("eating")
      w_id5 = ActivityWord.CreateActivityWord("eat", "verb-form")
      w_id6 = ActivityWord.CreateActivityWord("Drink")
      w_id7 = ActivityWord.CreateActivityWord("tests")
      w_id8 = ActivityWord.CreateActivityWord("eat", "same-context")
      work_off
      objs = ActivityWord.FindWordForm(w_id1)
      objs.should include(w_id7)
      objs = ActivityWord.FindWordForm(w_id8)
      objs.should_not be_blank

    end

  end

end
