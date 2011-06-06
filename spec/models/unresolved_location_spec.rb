require 'spec_helper'

describe UnresolvedLocation do
  describe "Validations"  do
    it "should validate a valid location" do

      lambda{
        wl = Factory(:unresolved_location, :location_id => 1)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should validate unique location" do

      lambda{
        loc = Factory(:location)
        wl = Factory.create(:unresolved_location, :location_id => loc.id)

        wl = Factory.create(:unresolved_location, :location_id =>loc.id)
      }.should raise_error ActiveRecord::RecordInvalid
    end
     it "unresolved name should not be blank " do
      lambda{
        wl = Factory(:unresolved_location, :location_id => Factory(:location).id, :unresolved_location_name => "")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid length of geo name" do
      lambda{
        a = ""
        1025.times do
          a = a+'a'
        end
        wl = Factory(:unresolved_location, :location_id => Factory(:location).id, :unresolved_location_name => "www.gmail.com/#{a}")
      }.should raise_error ActiveRecord::RecordInvalid
    end
  end
  describe "Associations" do
    it "should respond to location" do
      loc = Factory(:unresolved_location)
      loc.should respond_to(:location)
    end
  end

 describe "Read" do
   before(:each) do
      @loc1 = Factory(:unresolved_location)
      @loc2 = Factory(:unresolved_location)
      @loc3 = Factory(:unresolved_location)
      @loc4 = Factory(:unresolved_location)
      @loc5 = Factory(:unresolved_location)
    end
    it "should be able to find unresolved location based on location id" do
       l = UnresolvedLocation.where(:location_id => @loc3.location_id)
       l.should == [@loc3]
    end
   it "should be able to find all unresolved locations based on name" do
        l = UnresolvedLocation.where("unresolved_location_name LIKE :loc_url", {:loc_url => "Un%"}).
            order("created_at DESC")
        l.should  == [ @loc1, @loc2, @loc3, @loc4, @loc5]
        #l.should == [@loc3]
  end
 end
 describe "Create" do
    it "location should be able to create unresolved location"  do
       @loc = Factory(:location)
       lambda {
          wl = @loc.create_unresolved_location(:unresolved_location_name => "test")
       }.should change(UnresolvedLocation, :count).by(1)
    end
 end
 describe "Delete" do
    it "location should be able to delete unresolved location"  do
       @loc = Factory(:location)
       @loc.create_unresolved_location(:unresolved_location_name => "test")
       lambda{
         @loc.destroy
        }.should change(UnresolvedLocation, :count).by(-1)
    end
 end
 describe "Update"  do
        it "should not allow update of location id"  do
       l = Factory(:location)
       wl = Factory(:unresolved_location)
       lambda{
         w = UnresolvedLocation.find(wl.id)
         w.location_id= l.id
         w.save!
       }.should raise_error ActiveRecord::RecordNotSaved

    end
    it "should not allow update of unresolved location name"  do
       l = Factory(:location)
       wl = Factory(:unresolved_location)
       lambda{
         wl= UnresolvedLocation.find(wl.id)
         wl.unresolved_location_name = "alok"
         wl.save!
       }.should raise_error ActiveRecord::RecordNotSaved
    end
 end
end
