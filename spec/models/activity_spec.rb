require 'spec_helper'
require 'factory_girl'

describe Activity do

  before(:each) do
    @u = Factory(:user)
    @u1 = Factory(:user)
    @u2 = Factory(:user)
    @u3 = Factory(:user)
    @aw1 = Factory(:activity_word)
    @aw2 = Factory(:activity_word)

  end

  describe "validations" do


    it "should must not be save with length of activity text more that 1024" do
      str = ""
			(AppConstants.activity_text_length + 1).times do
			  str = str + 'a'
			end
			a=Activity.new(:author_id => @u.id, :activity_word_id => @aw1.id,:activity_text => str,
                     :activity_name => @aw.word_name,:author_full_name => "Alok Srivastava",
                     :author_profile_photo => "images/124"  )
			a.valid?
      a.should_not be_valid
			a.errors[:activity_text].should_not be_blank
    end

     it "can be save with blank activity text" do
      str = ""
			a=Activity.new(:author_id => @u.id, :activity_word_id => @aw1.id,:activity_text =>"",
                     :activity_name => @aw.word_name,:author_full_name => "Alok Srivastava",
                     :author_profile_photo => "images/124"  )
			a.valid?
      a.should_not be_valid
      a.errors[:activity_text].should be_blank
     end

    it "should must not be save without author" do
      lambda{
        a=Activity.create!(:activity_word_id => @aw1.id,:activity_text =>"alok",
                     :activity_name => @aw.word_name,:author_full_name => "Alok Srivastava",
                     :author_profile_photo => "images/124"  )

      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should must not be saved with invalid author" do
      lambda {
        a=Activity.create!(:author_id => 123,:activity_word_id => @aw1.id,:activity_text =>"alok",
                     :activity_name => @aw.word_name,:author_full_name => "Alok Srivastava",
                     :author_profile_photo => "images/124"  )
        a.errors[:author].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end


    it "should must not be saved without activity_name" do
      lambda {
        a=Activity.create!(:author_id => 123,:activity_word_id => @aw1.id,:activity_text =>"alok",
                     :author_full_name => "Alok Srivastava",:author_profile_photo => "images/124"  )
        a.errors[:activity_name].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end
       it "should must not be saved without activity_word_id" do
      lambda {
        a=Activity.create!(:activity_text =>"alok",:activity_name => @aw.word_name,:author_full_name => "Alok Srivastava",
                     :author_profile_photo => "images/124"  )
        a.errors[:activity_word_id].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end
  end


  describe "associations" do

    it "should respond to associations" do
      @act.should respond_to(:author)
    end
  end

  describe "Read Tree"  do


    it "should be able to fetch all immediate comments" do

    end

    it "user should not be able to directly fetch thread of other users" do

    end

    it "user should be able read all his activities as per response needed" do

    end


    it "user should be able read all its root activities" do

    end

  end

  describe "Update Tree" do

    it "should be able to add cmment on the activity" do

    end

    it "should be not allow update of author" do


    end

  end

  describe "Delete Tree" do

    it "Deleting User should be able to delete all his activities" do
        User.destroy(@u2)
        User.find(:all).count.should == 3
     # @u2.activities.delete(@act_child_2)
    end


    it "User should be able to delete *only* his activities" do
      # a  =@u2.activities.delete(@act_child_2) wil not work
      #Need to do load all as in Rails 3 until ActiveRecord dose not get view object returned is still ActiveRecord::relation.
      #This Since the new query API lazy loads the queries, they are not executed until they get to the view. so to force, load users all activities
       a= @u2.activities.all
       a.delete(@act_child_2).should be_nil
       Activity.exists?(@act_child_2).should_not be_false
    end
    it "User should be able to destroy *only* his activities" do
      lambda{
        a=@u2.activities.find(@act_child_2)
        a.destroy
       }.should raise_error
       Activity.exists?(@act_child_2).should_not be_false
    end

    it "should be not be able delete invalid comment " do

    end



    it "should be able delete all comment " do

    end
    it "Deletion of activity should  update the time of user, summary , hub " do

    end
  end

  describe "create_activity " do
    include DelayedJobSpecHelper
    it "should create activity by the class method given" do
#      act = Activity.create_activity(:author_id => @u.id, :activity => "eating" , :text => "pizza at pizza hut with
#                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
#                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
#                              :enrich => true)
#      act2 = Activity.create_activity(:author_id => @u.id, :activity => "eating" , :text => "burger at kfc with
#                                  <mention><name>PIZZA<name><id>235<id><mention>",
#                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
#                              :enrich => true)
#
#      act3 = Activity.create_activity(:author_id => @u.id, :activity => "listening" , :text => "AR rehman's jai ho",
#                              :location => {:geo_location =>{:geo_latitude => 21.45 ,:geo_longitude => 43.45, :geo_name => "marathalli"}},
#                              :enrich => true)
#      act3 = Activity.create_activity(:author_id => @u.id, :activity => "photgraphy" , :text => "",
#                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "lalbagh"}},
#                              :enrich => true)
#      act4 = Activity.create_activity(:author_id => @u.id, :activity => "listening" , :text => "Nakkad wale khisko from delhi belly",
#                              :location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
#                              :enrich => true)
#      act5 = Activity.create_activity(:author_id => @u.id, :activity => "eating" , :text => "Dal chawal and gulab jamoon at sahib singh sultan",
#                              :location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
#                              :enrich => true)
#
#      act.should_not be_nil
#      work_off
#      child = Activity.create_activity(:author_id => @u1.id, :activity => "&comment&" , :text => "Wow man have fun keep
#                                      me posted. @bhaloo - dont eat much mote <mention><name>Alok Srivastava<name><id>234<id><mention> pizza eating <mention><name>PIZZA<name><id>235<id><mention>",
#                                       :parent_id => act.id, :enrich => false )
#      child1 = Activity.create_activity(:author_id => @u.id, :activity => "&comment&" , :text => "Bow Bow man have fun keep
#                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
#      child2 = Activity.create_activity(:author_id => @u2.id, :activity => "&comment&" , :text => "Cow Cow man have fun keep
#                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
#      child3 = Activity.create_activity(:author_id => @u1.id, :activity => "&comment&" , :text => "dow dow man have fun keep
#                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
#
#      act.children.should  include(child3, child2, child1 , child)
#
#
#      @u.entities.each do |attr|
#        puts attr.id
#        puts attr.entity_name
#      end
#      @u.activity_words.each do |attr|
#        puts attr.id
#        puts attr.word_name
#      end
#      @u.entities.each do |attr|
#        puts attr.id
#        puts attr.entity_name
#      end
#      @u.locations.each do |attr|
#        puts attr.id
#        puts attr.location_name
#      end
##       puts act.location.inspect
##      act.destroy
##      Hub.count.should == 0
#       @u.destroy
#       Hub.count.should == 0
#
#      act.destroy
#      act.children.should == []

    end

  end
  describe "Get Snapshots" do
    include DelayedJobSpecHelper
    it "should create the result as per spec"  do
      act = @u.create_activity( :activity => "eating" , :text => "pizza at pizza hut with
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true)


      act3 = @u.create_activity( :activity => "singing" , :text => "AR rehman's jai ho",
                              :location => {:geo_location =>{:geo_latitude => 21.45 ,:geo_longitude => 43.45, :geo_name => "marathalli"}},
                              :enrich => true)
      act4 = @u.create_activity( :activity => "painting" , :text => "Sachin tendulkar  rahul dravid",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "lalbagh"}},
                              :enrich => true)
      act4 = @u.create_activity( :activity => "eating" , :text => "pizza Britney spears  rahul dravid pizza pizza hut",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "tundi"}},
                              :enrich => true)
      act2 = @u1.create_activity( :activity => "eating" , :text => "pizza at sachin tendulkar with
                                  <mention><name>PIZZA<name><id>235<id><mention>",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true)
       act5 = @u1.create_activity( :activity => "photgraphy" , :text => "Burger at Dominos with Rahul Dravid",
                              :location => {:unresolved_location =>{:unresolved_location_name =>  "Cool Place"}},
                              :enrich => true)
       act6 = @u2.create_activity( :activity => "eating" , :text => "Dal roti at McDonald's with MS Dhoni",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "lalbagh"}},
                              :enrich => true)
       act7 = @u2.create_activity( :activity => "photgraphy" , :text => "idli vada at <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> with Robin Uthhapa",
                              :location => {:web_location =>{:web_location_url => "google.com", :web_location_title => "hello"}},
                             :enrich => true)
      act4 = @u.create_activity( :activity => "listening" , :text => "Nakkad wale khisko from delhi belly",
                              :location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
                              :enrich => true)
      act5 = @u1.create_activity( :activity => "eating" , :text => "pizza Dal chawal and gulab jamoon at sahib singh sultan",
                              :location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
                              :enrich => true)

      act.should_not be_nil
      work_off
#      child = Activity.create_activity(:author_id => @u1.id, :activity => "&comment&" , :text => "Wow man have fun keep
#                                      me posted. @bhaloo - dont eat much mote <mention><name>Alok Srivastava<name><id>234<id><mention> pizza eating <mention><name>PIZZA<name><id>235<id><mention>", :parent_id => act.id, :enrich => false )
#      child1 = Activity.create_activity(:author_id => @u.id, :activity => "&comment&" , :text => "Bow Bow man have fun keep
#                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
      params = {}
      params[:user_id] =  @u.id
      params[:current_user] =  @u

      @u.new_contact_request(@u1.id)
      @u1.new_contact_request(@u.id)
      @u.new_contact_request(@u2.id)
      @u2.new_contact_request(@u.id)
      @u.new_contact_request(@u3.id)
      @u3.new_contact_request(@u.id)

      params[:scope] = 0
      params[:order] = "2011-07-05T07:28:56Z"
      h = @u.get_user_activities(1)
      puts h.inspect
      h.should_not be_nil

       h = @u.get_user_entities(1)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_user_locations(1)
      puts h.inspect
      h.should_not be_nil

      wi = ActivityWord.where(:word_name => "eating").first
      e = Entity.where(:entity_name => "pizza").first
      filter = {:word_id => wi.id}

      h = @u.get_related_friends( filter)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_related_entities(@u.id,filter)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_related_locations(@u.id, filter)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_enriched_activities([act[:id], act5[:id], act7[:id]])
      puts h.inspect
      h.should_not be_nil
    end
  end
end


# == Schema Information
#
# Table name: activities
#
#  id                   :integer         not null, primary key
#  activity_word_id     :integer         not null
#  activity_text        :text            not null
#  activity_name        :string(255)     not null
#  author_id            :integer         not null
#  author_full_name     :string(255)     not null
#  author_profile_photo :string(255)     not null
#  parent_id            :integer
#  base_location_id     :integer
#  base_location_data   :text
#  ancestry             :string(255)
#  ancestry_depth       :integer         default(0)
#  created_at           :datetime
#  updated_at           :datetime
#

