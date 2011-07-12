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

    %w[:campaign_name :campaign_value ].each do |attr|
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
         Factory(:campaign, :campaign_name => a )
       }.should raise_error ActiveRecord::RecordInvalid
     end
     it "should have valid user" do
       lambda {
          Campaign.create!(:author_id => 1, :father_id => Factory(:activity).id, :campaign_name => "Like",
          :campaign_value => 1)
        }.should raise_error ActiveRecord::RecordInvalid
     end
    it "should have valid father" do
       lambda {
          Campaign.create!(:author_id => Factory(:user).id, :father_id => 1, :campaign_name => "Like",
          :campaign_value => 1)
        }.should raise_error ActiveRecord::RecordInvalid
    end
    %w[:entity_id :activity_id :location_id ].each do |attr|
      it "should have valid #{attr}" do
         lambda {
            Campaign.create!(:author_id => Factory(:user).id, :father_id => Factory(:activity).id,
                             attr.parameterize.to_sym => 344, :campaign_name => "Like", :campaign_value => 1)
          }.should raise_error ActiveRecord::RecordInvalid
      end
    end
  end
  include DelayedJobSpecHelper
  before(:each) do
   @u1 = Factory(:user)
   @u2 = Factory(:user)
   @u3 = Factory(:user)

   @l1 = Factory(:location)
   @a1 = @u1.create_activity(:author_id => @u1.id, :activity => "eating" , :text => "pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true)
   puts @a1.attributes
   @com1 = Comment.create_comment(:author_id => @u2.id, :activity_id => @a1, :text => "helllllloooo ")
   work_off
   @e1 = Factory(:entity)
   @c1 = Campaign.create_campaign(:author_id => @u1.id, :campaign_name => "like", :campaign_value => 1,
                             :activity => {:user_id => @u2.id, :id => @a1.id} )
   @c2 = Campaign.create_campaign(:author_id => @u3.id, :campaign_name => "like", :campaign_value => 2,
                               :activity => {:user_id => @u2.id, :id => @a1.id} )
   @c3 = Campaign.create_campaign(:author_id => @u1.id, :campaign_name => "support", :campaign_value => 3,
                               :activity => {:user_id => @u2.id, :id => @a1.id} )
   @c4 = Campaign.create_campaign(:author_id => @u1.id, :campaign_name => "like", :campaign_value => 1,
                               :activity => {:user_id => @u2.id, :id => @a1.id} )
   @c5 = Campaign.create_campaign(:author_id => @u3.id, :campaign_name => "join", :campaign_value => 2,
                               :activity => {:user_id => @u2.id, :id => @a1.id} )
   @c6 = Campaign.create_campaign(:author_id => @u3.id, :campaign_name => "join", :campaign_value => 2,
                               :entity => {:id => @e1.id} )
   @c7 = Campaign.create_campaign(:author_id => @u3.id, :campaign_name => "join", :campaign_value => 2,
                               :location => {:id => @l1.id} )
   @c8 = Campaign.create_campaign(:author_id => @u3.id, :campaign_name => "join", :campaign_value => 2,
                               :comment => {:author_id => @u1.id, :id => @com1.id} )
  end
  describe "Create" do
    it "should create campaigns on activities"  do

       @c1.should_not be_nil
       @c2.should_not be_nil
       @c3.should_not be_nil
       @c4.should be_nil
       @c5.should_not be_nil
       @c1.activity_id.should == @a1.id
       @c1.author_id.should == @u1.id
       @c1.father.should_not be_nil
       puts @c1.father.activity_name
       puts @c1.father.activity_text

       puts @c6.father.activity_text
       puts @c7.father.activity_text

       puts @c8.father.activity_name
       puts @c8.father.activity_text

       @a1.destroy


    end
  end
  describe "Delete" do
    it "should delete a campaign properly when deleting only campaign "   do

       #Campaign.delete_campaign(c1.id)
       @a1.destroy
       f = Activity.where(:id =>@c3.father_id)
       f.should be_blank
       @a1 = Factory(:activity)
       c1 = Campaign.create_campaign(:author_id => @u1.id, :campaign_name => "like", :campaign_value => 1,
                               :activity => {:user_id => @u2.id, :activity_id => @a1.id} )
       c2 = Campaign.create_campaign(:author_id => @u3.id, :campaign_name => "like", :campaign_value => 2,
                               :activity => {:user_id => @u2.id, :activity_id => @a1.id} )
       c3 = Campaign.create_campaign(:author_id => @u1.id, :campaign_name => "support", :campaign_value => 3,
                               :activity => {:user_id => @u2.id, :activity_id => @a1.id} )
       c2.father.destroy
       c = Campaign.where(:id => c2.id)
       c.should be_blank

       Campaign.delete_campaign(c1.id)
       c = Campaign.where(:id => c1.id)
       c.should be_blank

       c3.destroy
       c = Campaign.where(:id => c3.id)
       c.should be_blank
    end
  end
  describe "Read" do
    it "should read campaigns properly" do
      Campaign.get_campaign(:activity_id => @a1.id)
    end
  end
end



# == Schema Information
#
# Table name: campaigns
#
#  id             :integer         not null, primary key
#  author_id      :integer         not null
#  activity_id    :integer
#  entity_id      :integer
#  location_id    :integer
#  father_id      :integer         not null
#  campaign_name  :string(255)     not null
#  campaign_value :integer         not null
#  created_at     :datetime
#  updated_at     :datetime
#  comment_id     :integer
#

