require 'spec_helper'

describe WebLocation do
  describe "Validations"  do

    it "should validate a valid location" do

      lambda{
        wl = Factory.create(:web_location, :location_id => 1, :web_location_url => "http://www.gmail.com")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should validate unique location" do

      lambda{
        loc = Factory(:location)
        wl = Factory.create(:web_location, :location_id =>loc.id, :web_location_url => "http://www.gmail.com")
        wl = Factory.create(:web_location, :location_id =>loc.id, :web_location_url => "http://www.gmail1.com")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept must have urls" do
     lambda{
        wl = Factory.create(:web_location, :location_id => Factory(:location).id, :web_location_url => nil)
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid urls" do
      lambda{
        wl = Factory.create(:web_location, :location_id => Factory(:location).id, :web_location_url => "www.gmail.com/q=eyhe?&x=2323224343")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept must have unique urls" do
     lambda{
        wl = Factory.create(:web_location, :location_id => Factory(:location).id, :web_location_url => "http://gmail.com")
        wl1 = Factory.create(:web_location, :location_id => Factory(:location).id, :web_location_url => "http://gmail.com")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "web_location_url should not be blank " do
      lambda{
        wl = Factory.create(:web_location, :location_id => Factory(:location).id, :web_location_url => "")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid length of urls" do
      lambda{
        a = ""
        255.times do
          a = a+'a'
        end
        wl = Factory.create(:web_location, :location_id => Factory(:location).id, :web_location_url => "www.gmail.com/#{a}")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid image url" do
      lambda{
        wl = Factory.create(:web_location, :location_id => Factory(:location).id,
                            :web_location_url => "http://www.gmail.com", :web_location_image_url => "gmail.com")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid length of urls" do
      lambda{
        a = ""
        255.times do
          a = a+'a'
        end
        wl = Factory.create(:web_location, :location_id => Factory(:location).id,
                            :web_location_url => "http://www.gmail.com", :web_location_image_url => "www.gmail.com/#{a}")
      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid length title " do
      lambda{
        256.times do
          a = a+'a'
        end
        wl = Factory.create(:web_location, :location_id => Factory(:location).id,
                            :web_location_url => "http://www.gmail.com", :web_location_title => "#{a}")
      }.should_not raise_error ActiveRecord::RecordInvalid
    end

    it "should accept only valid length description" do
      lambda{
        a = ""
        1025.times do
          a = a+'a'
        end
        wl = Factory.create(:web_location, :location_id => Factory(:location).id,
                            :web_location_url => "http://www.gmail.com", :web_location_desc => "#{a}")
      }.should raise_error ActiveRecord::RecordInvalid
    end
  end

  describe "Associations" do
    it "should respond to location" do
      loc = Factory(:web_location)
      loc.should respond_to(:location)
    end
  end

  describe "Read" do

    it "should be able to find web location based on location id" do

    end

    it "should be able to find web location based on web url" do

    end

     it "should be able to find all web locations based on web title" do

     end
  end

  describe "Create" do

    it "location should be able to create web location"  do

    end

  end

  describe "Delete" do

    it "location should be able to delete web location"  do

    end

  end

  describe "Update" do

    it "should not allow update of location id"  do

    end
    it "should not allow update of web url"  do

    end
    it "should  allow update of web image url"  do

    end
    it "should  allow update of web title"  do

    end
    it "should  allow update of web desc"  do

    end
  end

end
