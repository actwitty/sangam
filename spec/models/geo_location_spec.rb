require 'spec_helper'

describe GeoLocation do
  describe "Validations"  do

    it "should validate a valid location" do

      lambda{
        wl = Factory.create(:geo_location, :location_id => 1)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should validate unique location" do

      lambda{
        loc = Factory(:location)
        wl = Factory.create(:geo_location, :location_id => loc.id,
                            :geo_latitude => 87,  :geo_longitude => 126.1, :geo_name => "geo name")
        wl = Factory.create(:geo_location, :location_id =>loc.id,
                            :geo_latitude => 86,  :geo_longitude => 126.1, :geo_name => "geo name")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept must have latitude longitude" do
     lambda{
        l = Factory(:location)
        wl = Factory(:geo_location, :location_id => l.id,:geo_latitude => nil,  :geo_longitude => nil)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid latitude" do
      lambda{
        wl = Factory(:geo_location, :location_id => Factory(:location).id,
                            :geo_latitude => -91.565)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid longitude" do
      lambda{
        wl = Factory(:geo_location, :location_id => Factory(:location).id,
                            :geo_longitude => 181.565)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept must have unique lat long" do
     lambda{
        wl = Factory(:geo_location, :location_id => Factory(:location).id, :geo_latitude => 87,  :geo_longitude => 126.1)
        wl = Factory(:geo_location, :location_id => Factory(:location).id, :geo_latitude => 87,  :geo_longitude => 126.1)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "geo name should not be blank " do
      lambda{
        wl = Factory(:geo_location, :location_id => Factory(:location).id, :geo_name => "")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid length of geo name" do
      lambda{
        a = ""
        1025.times do
          a = a+'a'
        end
        wl = Factory(:geo_location, :location_id => Factory(:location).id, :geo_name => "www.gmail.com/#{a}")
      }.should raise_error ActiveRecord::RecordInvalid
    end
  end

  describe "Associations" do
    it "should respond to location" do
      loc = Factory(:geo_location)
      loc.should respond_to(:location)
    end
  end

 describe "Read" do
    before(:each) do
      @loc1 = Factory(:geo_location)
      @loc2 = Factory(:geo_location)
      @loc3 = Factory(:geo_location)
      @loc4 = Factory(:geo_location)
      @loc5 = Factory(:geo_location)
    end
    it "should be able to find geo location based on location id" do
       l = GeoLocation.where(:location_id => @loc3.location_id)
       l.should == [@loc3]
    end

    it "should be able to find all geo locations based on name" do
        l = GeoLocation.where("geo_name LIKE :loc_url", {:loc_url => "geo%"}).order("created_at DESC")
        puts l[0].class
        l.should ==[ @loc5, @loc4, @loc3, @loc2, @loc1 ]
        #l.should == [@loc3]
    end
    it "should be able to find a geo locations lat" do
        l = GeoLocation.where(:geo_latitude => @loc1.geo_latitude, :geo_longitude => @loc1.geo_longitude).
            order("created_at DESC")
        l.should  == [ @loc1]
        #l.should == [@loc3]
    end
    it "should be able to find a geo locations lat" do
        obj = GeoLocation.first
        obj_l = GeoLocation.last
        puts obj_l.geo_latitude
        puts obj.distance_from([obj_l.geo_latitude, obj_l.geo_longitude])
        l = GeoLocation.near([obj.geo_latitude, obj.geo_longitude], 120).
            order("created_at DESC")
        l.should  == [ @loc1, @loc2]
        #l.should == [@loc3]
    end
 end
    describe "Create" do

    it "location should be able to create geo location"  do
       @loc = Factory(:location)
       lambda {
          wl = @loc.create_geo_location(:geo_latitude => 26.65, :geo_longitude => 24.45, :geo_name => " test")
       }.should change(GeoLocation, :count).by(1)
    end

  end

  describe "Delete" do

    it "location should be able to delete geo location"  do
       @loc = Factory(:location)
       @loc.create_geo_location(:geo_latitude => 26.65, :geo_longitude => 24.45, :geo_name => " test")
       lambda{
         @loc.destroy
        }.should change(GeoLocation, :count).by(-1)
    end

  end

  describe "Update" do

    it "should not allow update of location id"  do
       l = Factory(:location)
       wl = Factory(:geo_location)
       lambda{
         w = GeoLocation.find(wl.id)
         w.location_id= l.id
         w.save!
       }.should raise_error ActiveRecord::RecordNotSaved

    end
    it "should not allow update of lat long"  do
       l = Factory(:location)
       wl = Factory(:geo_location)
       lambda{
         wl = GeoLocation.find(wl.id)
         wl.geo_latitude = 26.544
         wl.geo_longitude = 91.234
         wl.save!
       }.should raise_error ActiveRecord::RecordNotSaved
    end
    it "should  not allow update of geo name"  do
       l = Factory(:location)
       wl = Factory(:geo_location)
       lambda{
         wl.geo_name = "http://a.com"
         wl.save!
       }.should raise_error ActiveRecord::RecordNotSaved
    end

  end
end

