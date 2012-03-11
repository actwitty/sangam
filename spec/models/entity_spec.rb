require 'spec_helper'

describe Entity do
  before(:each) do
    @e = Factory(:entity)
    @u = Factory(:user)
    @e2 = Factory(:entity)
    @h = {'guid'=>"23456_",'name'=> "Entity name 1",'mid' =>  "/m/abcd",
                            '/common/topic/alias'=> ["name_1_1", "name_1_2" "name_1_3"],
                            '/common/topic/image'=>[{'id'=>"http://google.com/images/1_3"}, {'id'=>"http://google.com/images/1_2"}],
                           'key'=> {'namespace'=> "/wikipedia/en_id_1_1",'value'=>"content 1_1"},
                           'type'=>[{'id'=>"/common/topic_1_1",'name'=>"Topic"},{'id'=>"/common/music_1_2",'name'=>"Music_1_2"} ]
                          }
    @e3 = Entity.create_entities(@h)
    @h['mid'] = "/m/abcd1"
    @e4 = Entity.create_entities( @h)
    @h['mid'] = "/m/abcd2"
    @h['type'][0]['name'] = "music"
    @e5 = Entity.create_entities(@h)
  end
  describe "Validations"  do

    it "should have not have nil id" do
      lambda{
        en = Factory(:entity, :entity_guid => nil)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should have not have nil name" do
      lambda{
        en = Factory(:entity, :entity_name => nil)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should have not have blank name" do
      lambda{
        en = Factory(:entity, :entity_name => "")
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should have not have blank image" do
      lambda{
        en = Factory(:entity)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should have not have name with length more than 255" do
      lambda{
        a = ""
        256.times{
          a = a + "a"
        }

        en = Factory(:entity, :entity_name => a)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should have not have guid with length more than 255" do
      lambda{
        a = ""
        256.times{
          a = a + "a"
        }

        en = Factory(:entity, :entity_guid => a)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should have not same entity guid for two entities" do
      lambda{
        en = Factory(:entity, :entity_guid => @e.entity_guid)
      }.should raise_error ActiveRecord::RecordInvalid
    end
  end

  describe "Associations" do
    it "should respond to associations" do
      @e.should respond_to(:users, :activities, :activity_words, :hubs, :locations, :entity_ownership)
    end
  end

  describe "Read" do


  end

end











# == Schema Information
#
# Table name: entities
#
#  id               :integer         not null, primary key
#  entity_name      :text            not null
#  entity_guid      :text            not null
#  entity_type_id   :text
#  entity_type_name :text
#  entity_svc       :text
#  created_at       :datetime        not null
#  updated_at       :datetime        not null
#

