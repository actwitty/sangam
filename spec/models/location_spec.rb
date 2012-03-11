require 'spec_helper'

describe Location do
  describe "Validations"  do
    it "should validate a valid location" do
      lambda{
        wl = Factory(:location)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should validate a nil location name" do
      lambda{
        wl = Factory(:location, :location_name => nil)
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should validate a blank location name" do
      lambda{
        wl = Factory(:location, :location_name => "")
      }.should raise_error ActiveRecord::RecordInvalid
    end
    it "should validate a very long location name" do
      lambda{
        a = ""
        1025.times do
          a = "a" + a
        end
        wl = Factory(:location, :location_name => a)
      }.should raise_error ActiveRecord::RecordInvalid
    end
  end


  describe "Read" do
    before(:each) do
      @id1 = Location.create_location({:lat => 12.971598739498852, :long => 77.5945627000001, :name => "sj1"})
       @id3 = Location.create_location( {:lat => 12.971598739498852, :long => 77.5945627000001, :name => "sj"})
       @id5 = Location.create_location( {:lat => 23.4767, :long => 120.6, :name => "sj"})
      @id6 = Location.create_location({:lat => 24.4767, :long => 121, :name => "sj"})
      @id10 = Location.create_location({:lat => 12.971598739498852, :long => 78.5945627000001, :name => "sj"})
      @id11 = Location.create_location({:lat => 12.971598739498852, :long => 78.5945627000001, :name => "sj"})
     end
    it "should be able to get location name even if it collides" do
      l = Location.where(:id => @id3.id).first
      l.location_name.should == @id1.location_name
    end



  end
  describe "Create"  do
    it "should read all location with give location type" do
      lambda{
       Location.create_location({:lat => 23.4567, :long => 120, :name => "sj"})
       Location.create_location({:lat => 23.4567, :long => 120, :name => "sj"})
      }.should change(Location,:count).by(2)
    end
  end
end













# == Schema Information
#
# Table name: locations
#
#  id               :integer         not null, primary key
#  location_name    :text            not null
#  location_lat     :decimal(18, 15)
#  location_long    :decimal(18, 15)
#  location_city    :text
#  location_country :text
#  location_region  :text
#  source_name      :text
#  source_object_id :text
#  created_at       :datetime        not null
#  updated_at       :datetime        not null
#

