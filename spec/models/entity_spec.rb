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
    @e3 = Entity.CreateEntities(@u.id,@h)
    @h['mid'] = "/m/abcd1"
    @e4 = Entity.CreateEntities(@u.id, @h)
    @h['mid'] = "/m/abcd2"
    @h['type'][0]['name'] = "music"
    @e5 = Entity.CreateEntities(@u.id,@h)
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
    it "should have not have nil entity_doc" do
      lambda{
        en = Factory(:entity, :entity_doc => nil)
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
      @e.should respond_to(:users, :activities, :activity_dicts, :hubs, :locations, :entity_ownership)
    end
  end

  describe "Read" do
    it "should be able to read entity_doc based on entity guid " do
      @h['mid'] = @e.entity_guid
      eid = Entity.CreateEntities(@u.id, @h)
      eid.entity_doc.should == @e.entity_doc

    end
    it "should be able to all entity based on entity type " do
       eids = Entity.SearchEntityByType('Topic')
       eids.should_not be_blank
       eids.should include(@e3, @e4)
       puts eids
       eids.each do |eid|
         puts eid.entity_name
       end
    end
    it "should be able to entity based on entity name " do
       eids = Entity.FindEntityByName('Entity name 1')
       eids.should_not be_blank
       eids.should include(@e3, @e4, @e5)
       puts eids
       eids.each do |eid|
         puts eid.entity_name
       end
    end
    it "should be able to entity based on entity Guid " do
       eid = Entity.FindEntityByGUID('/m/abcd')
       eid.should_not be_nil
       eid.should ==@e3
       puts eid
       eid.destroy
    end
  end

end
