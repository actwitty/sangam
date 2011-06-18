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
  describe "Create" do
    it "should create campaigns on activities"  do

    end
  end
end
