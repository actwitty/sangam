require 'spec_helper'

describe Location do
  describe "Validations"  do
    it "should validate a valid location" do
      lambda{
        wl = Factory(:location, :location_type => 0)
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
#  describe "Association"  do
#    %w[:web_location :geo_location :unresolved_location].each do |attr|
#      it "should respond to associations" do
#        wl = Factory(:location)
#        wl.should respond_to(eval(attr))
#      end
#    end
#  end

  describe "Read" do
    before(:each) do
      @id1 = Location.create_location(:geo_location => {:geo_latitude => 12.971598739498852, :geo_longitude => 77.5945627000001, :geo_name => "sj"})
      @id2 = Location.create_location(:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"})
      @id3 = Location.create_location(:geo_location => {:geo_latitude => 12.971598739498852, :geo_longitude => 77.5945627000001, :geo_name => "sj"})
      @id4 = Location.create_location(:unresolved_location =>{:unresolved_location_name => "http://google.com"})
      @id5 = Location.create_location(:geo_location => {:geo_latitude => 23.4767, :geo_longitude => 120.6, :geo_name => "sj"})
      @id6 = Location.create_location(:geo_location => {:geo_latitude => 24.4767, :geo_longitude => 121, :geo_name => "sj"})
      @id7 = Location.create_location(:web_location =>{:web_location_url => "http://GOoogLe1.com", :web_location_title => "hello"})
      @id8 = Location.create_location(:web_location =>{:web_location_url => "gooogle1.com", :web_location_title => "hello"})
      @id9 = Location.create_location(:unresolved_location =>{:unresolved_location_name => "http://google.com"})
      @id10 = Location.create_location(:geo_location => {:geo_latitude => 12.971598739498852, :geo_longitude => 78.5945627000001, :geo_name => "sj"})
      @id11 = Location.create_location(:geo_location => {:geo_latitude => 12.971598739498852, :geo_longitude => 78.5945627000001, :geo_name => "sj"})
      @id12 = Location.create_location(:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hahahaha"})
    end
    it "should be able to get location name even if it collides" do
      l = Location.where(:id => @id12.id).first
      l.location_name.should == @id2.location_name
    end
    it "should read  location with give location name" do
      l = Location.where(:id => @id4.id).first
      l.location_name.should == @id4.location_name
    end
    it "should read all location name " do
      l = Location.where(:location_type => 2)
      l.should include(@id1, @id3, @id5, @id6)
    end
    it "should search all urls and return location ids" do
      location_ids = Location.search_location({:web_location => {:web_location_url => "go"}})
      Rails.logger.info "relation returned"
      #location_ids.should be_blank
      location_ids.count.should == 1

    end
#    it "should fetch a location  and return location ids" do
#      location_id = Location.get_location(@id2.id)
#      puts location_id.location_type
#      location_id.web_location.location_id.should == location_id.id
#      location_id.web_location.web_location_url.should == "http://GOOGLE.com"
#
#    end
    it "should fetch NIL location  and return location for invalid location" do
       puts @id8.location_type
       @id8.should_not be_nil

    end
    it "should search all near geo location  and return location ids" do
      location_ids = Location.search_location({:geo_location => {:geo_latitude => 23, :geo_longitude => 120, :range => 50}})
      Rails.logger.info "relation returned"
      puts location_ids[0].location_type
      location_ids.length.should == 2

    end
     it "should search a near geo location  and return its location id" do
      location_ids = Location.search_location({:geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3}})
      Rails.logger.info "relation returned"
      location_ids.each do |loc|
        puts loc.location_type
      end
      location_ids.count.should == 1

    end
  end
  describe "Create"  do
    it "should read all location with give location type" do
      #params = { :location => {:location_type => 2, :web_location_attributes => {:web_location_url => "http://gmail.com"}}}
      lambda{
       Location.create_location({:web_location =>{:web_location_url => "http://google.com", :web_location_title => "hello"}})
       Location.create_location({:web_location => {}})
       Location.create_location({:geo_location => {:geo_latitude => 23.4567, :geo_longitude => 120, :geo_name => "sj"}})
       Location.create_location({:unresolved_location =>{:unresolved_location_name => "http://google.com"}})
       Location.create_location({:geo_location => {:geo_latitude => 23.4567, :geo_longitude => 120, :geo_name => "sj"},
                               :web_location =>{:web_location_url => "http://google.com", :web_location_title => "hello"}})
      }.should change(Location,:count).by(3)
    end
  end
  describe "Join Create" do
     before(:each) do
      @id1 = Location.create_location({:geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}})
      @id2 = Location.create_location({:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}})
      @id3 = Location.create_location({:geo_location => {:geo_latitude => 23.4567, :geo_longitude => 120, :geo_name => "sj"}})
      @id4 = Location.create_location({:unresolved_location =>{:unresolved_location_name => "http://google.com"}})
      @id5 = Location.create_location({:geo_location => {:geo_latitude => 23.4767, :geo_longitude => 120.6, :geo_name => "sj"}})
      @id6 = Location.create_location({:geo_location => {:geo_latitude => 24.4767, :geo_longitude => 121, :geo_name => "sj"}})
      @id7 = Location.create_location({:web_location =>{:web_location_url => "http://GOoogLe1.com", :web_location_title => "hello"}})
      @id8 = Location.create_location({:web_location =>{:web_location_url => "gooogle1.com", :web_location_title => "hello"}})
      @id9 = Location.create_location({:unresolved_location =>{:unresolved_location_name => "http://google.com"}})
      @id10 = Location.create_location({:geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}})
      @id11 = Location.create_location({:geo_location => {:geo_latitude => 123.6567, :geo_longitude => 120.3, :geo_name => "sj"}})

     end
    it "should be able to join locations" do
      #puts @id1.geo_location.id
      #puts @id2.web_location.id
#      if WebLocation.exists?(@id1.web_location)
#        puts "hello"
#      end

      jh1 = Location.join_locations({:geo_join_id => @id1.id,:web_join_id => @id2.id,
                                   :unresolved_join_id => @id4.id})
      jh2 = Location.join_locations({:web_join_id => @id2.id, :geo_join_id => @id1.id,
                                   :unresolved_join_id => @id4.id})
      jh3 = Location.join_locations({:geo_join_id => @id1.id,:web_join_id => @id2.id  })
      jh4 = Location.join_locations({:web_join_id => @id2.id , :geo_join_id => @id1.id})
      jh5 = Location.join_locations({:web_join_id => @id2.id,:unresolved_join_id => @id4.id})
      jh6 = Location.join_locations({:unresolved_join_id => @id4.id, :web_join_id => @id2.id})
      jh7 = Location.join_locations({:unresolved_join_id => @id4.id,:geo_join_id => @id1.id,
                                   :web_join_id => @id2.id})
      jh8 = Location.join_locations({:unresolved_join_id => @id4.id})
      jh9 = Location.join_locations({:geo_join_id => @id1.id,:web_join_id => @id7.id})
      jh10 = Location.join_locations({:geo_join_id => @id6.id,:web_join_id => @id7.id})

      #puts jh.geo_location_id
      #puts jh.web_location_id
      jh1.should_not be_nil
      jh2.should == jh1
      jh3.should_not == jh1
      jh4.should == jh3
      jh5.should_not be_nil
      jh6.should == jh5
      jh7.should == jh1
      jh8.should be_nil
      jo = LocationHub.where(:unresolved_join_id => @id4)
      jo.each do |attr|
        puts attr.web_join_id.to_s + " " + attr.geo_join_id.to_s + " " + attr.unresolved_join_id.to_s

      end
      puts "============"
      Location.SearchJoin(@id4)
#      Location.count.should == 8
#      @id1.destroy
#      @id2.destroy
#      @id6.destroy
#      puts "============"
#      jo = Location.joins(:geo_joins).where(:location_hubs => {:geo_join_id => @id1}).all
#      jo.each do |attr|
#        puts attr.id
#      end
#
#      Location.count.should == 5
    end
  end
end


# == Schema Information
#
# Table name: locations
#
#  id            :integer         not null, primary key
#  location_type :integer         not null
#  location_name :text            not null
#  location_url  :text
#  location_lat  :decimal(10, 7)
#  location_long :decimal(10, 7)
#  created_at    :datetime
#  updated_at    :datetime
#

