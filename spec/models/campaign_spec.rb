require 'spec_helper'

describe Campaign do

  describe "Validations" do
    %w[:author  :father ].each do |attr|
      it "should have valid #{attr}" do
         lambda {
           puts attr.parameterize.to_sym
           Factory(:campaign, attr.parameterize.to_sym => nil)
         }.should raise_error ActiveRecord::RecordInvalid
      end
    end
    it "should have valid father activity" do
       lambda {
         Factory(:campaign, :father => nil)
       }.should raise_error ActiveRecord::RecordInvalid
    end

    %w[:name :value ].each do |attr|
      it "should have valid #{attr}" do
         lambda {
           puts "hello"
           Factory(:campaign, attr.parameterize.to_sym => nil )
          }.should raise_error ActiveRecord::RecordInvalid
      end
    end

     it "should have valid length of campaign name" do
       lambda {
         a = ""
         256.times {a = 'a' + a}
         Factory(:campaign, :name => a )
       }.should raise_error ActiveRecord::RecordInvalid
     end
     it "should have valid user" do
       lambda {
          Campaign.create!(:author_id => 1, :father_id => Factory(:activity).id, :name => "Like",
          :value => 1)
        }.should raise_error ActiveRecord::RecordInvalid
     end
    it "should have valid father" do
       lambda {
          Campaign.create!(:author_id => Factory(:user).id, :father_id => 1, :name => "Like",
          :value => 1)
        }.should raise_error ActiveRecord::RecordInvalid
    end
    %w[:entity_id :activity_id :location_id ].each do |attr|
      it "should have valid #{attr}" do
         lambda {
            Campaign.create!(:author_id => Factory(:user).id, :father_id => Factory(:activity).id,
                             attr.parameterize.to_sym => 344, :name => "Like", :value => 1)
          }.should raise_error ActiveRecord::RecordInvalid
      end
    end
  end
  include DelayedJobSpecHelper
  before(:each) do
   @u1 = Factory(:user)
   @u2 = Factory(:user)
   @u3 = Factory(:user)

   @l1 = Location.create_location(:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"})
   @a1 = @u1.create_activity( :word => "eating123456789" , :text => "pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "123456789011 marathalli"}},
                              :enrich => true)
   @a1 = @a1[:post]
   @a= Activity.where(:id => @a1[:id]).first
   @com1 = @u2.create_comment( :activity_id => @a1[:id], :text => "helllllloooo ")

   @e1 = Factory(:entity)
   @c1 = Campaign.create_campaign( :author_id => @u1.id, :name => "like", :value => 1,
                             :activity_id => @a1[:id] )
   @c2 = Campaign.create_campaign( :author_id => @u3.id,:name => "like", :value => 2,
                               :activity_id => @a1[:id] )
   @c3 = Campaign.create_campaign( :author_id => @u1.id,:name => "support", :value => 3,
                               :activity_id => @a1[:id] )
   @c4 = Campaign.create_campaign( :author_id => @u1.id,:name => "like", :value => 1,
                               :activity_id => @a1[:id] )

   @c6 = Campaign.create_campaign( :author_id => @u3.id,:name => "join", :value => 2,
                               :entity_id => @e1.id )
   @c7 = Campaign.create_campaign( :author_id => @u3.id,:name => "join", :value => 2,
                               :location_id => @l1.id )
   @c8 = Campaign.create_campaign( :author_id => @u3.id,:name => "join", :value => 2,
                               :comment_id => @com1[:comment][:id] )
     work_off
  end
  describe "Create" do
    it "should create campaigns on activities"  do

       @c1.should_not be_nil
       @c2.should_not be_nil
       @c3.should_not be_nil
       @c4.should be_blank
       @c5.should be_nil
       @c1.activity_id.should == @a1[:id]

       c= Campaign.where(:id => @c1.id).first
       c.author_id.should == @u1.id
       c.father.should_not be_nil
       puts c.father.activity_name
       puts c.father.activity_text

       c= Campaign.where(:id => @c6.id).first
       c.father.should_not be_nil
       puts c.father.activity_text

       c= Campaign.where(:id => @c7.id).first
       c.father.should_not be_nil
       puts c.father.activity_text

       c= Campaign.where(:id => @c8.id).first
       c.father.should_not be_nil
       puts c.father.activity_name
       puts c.father.activity_text

       @a.destroy
       @e1.destroy
       @l1.destroy
    end
  end
  describe "Delete" do
    it "should delete a campaign properly when deleting only campaign "   do

       #Campaign.delete_campaign(c1.id)
       @a.destroy
       c= Campaign.where(:id => @c3.id).first
       c.should be_nil
       @a1 = @u2.create_activity( :word => "eating" , :text => "pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true)
       @a1 = @a1[:post]
       c1 = Campaign.create_campaign( :author_id => @u1.id,:name => "like", :value => 1,
                               :activity_id => @a1[:id] )
       c2 = Campaign.create_campaign( :author_id => @u3.id,:name => "like", :value => 2,
                               :activity_id =>  @a1[:id] )
       c3 = Campaign.create_campaign( :author_id => @u1.id,:name => "support", :value => 3,
                               :activity_id => @a1[:id] )
       c= Campaign.where(:id => c2.id).first
       c.father.destroy
       c = Campaign.where(:id => c2.id).first
       c.should be_blank

       Campaign.delete_campaign(c1.id)
       c = Campaign.where(:id => c1.id).first
       c.should be_blank
       c = Campaign.where(:id => c3.id).first
       c.destroy
       c = Campaign.where(:id => c3.id).first
       c.should be_blank
    end

    it "should be able to remove a campaign" do
      @c4 = Campaign.create_campaign(:author_id => @u1.id, :name => "like", :value => 1,
                               :activity_id =>  @a1[:id] )
      @c4.should be_blank
      puts @c1
      a = @u1.remove_campaign(@c1.id)
      puts a
      @c4 = Campaign.create_campaign( :author_id => @u1.id,:name => "like", :value => 1,
                               :activity_id => @a1[:id] )
      @c4.should_not be_blank

      @c5 = @u2.create_campaign( :name => "like", :value => 1,
                               :activity_id  => @a1[:id] )
      @c5.should_not be_blank
    end

  end
  describe "Read" do
    it "should get all campaigns of an activity or entity or location or comment" do
      a = @u1.get_all_campaign({:activity_id => @a1[:id]})
      a.should_not be_blank
    end
    it "should read campaigns properly" do
      Campaign.get_campaign(:activity_id => @a1[:id])
    end
  end
end






# == Schema Information
#
# Table name: campaigns
#
#  id          :integer         not null, primary key
#  author_id   :integer         not null
#  activity_id :integer
#  entity_id   :integer
#  location_id :integer
#  comment_id  :integer
#  document_id :integer
#  father_id   :integer         not null
#  name        :string(255)     not null
#  value       :integer         not null
#  created_at  :datetime
#  updated_at  :datetime
#

