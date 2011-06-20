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

    @act = Activity.create!(:activity_word_id => @aw1.id,:activity_text => "hello",
                             :activity_name => "test", :author => @u)

    @act_child_1 = @act.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello1",
                            :activity_name => "test_1", :author_id => @u1.id, :parent => @act )

    @act_child_2 = @act.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello2",
                             :activity_name => "test", :author => @u, :parent => @act)


    @act_child_3 = @act.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello3",
                            :activity_name => "test_3",  :author => @u2, :parent => @act)


    @act_child_2_1 = @act_child_2.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello2_1",
                            :activity_name => "test_2_1",   :author => @u2,
                            :parent => @act_child_2)

    @act_child_3_1 = @act_child_3.children.create!(:activity_word_id =>@aw2.id,:activity_text => "hello3_1",
                             :activity_name => "test_3_1",  :author => @u,
                             :parent => @act_child_3)
    #@act_child_3_1.save

    @act_child_3_1_1 = @act_child_3_1.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello3_1_1",
                             :activity_name => "test_3_1_1",  :author => @u3,
                             :parent => @act_child_3_1)

    @act_child_3_2 = @act_child_3.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello3_2",
                         :activity_name => "test_3_1", :author => @u, :parent => @act_child_3)

    @bct = Activity.create!(:activity_word_id =>@aw2.id,:activity_text => "hello_b",
                             :activity_name => "test_b", :author => @u)


    @bct_child_1 = @bct.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello_b_1",
                            :activity_name => "test_1",  :author => @u, :parent => @bct )

    @act_arr =   [@act, @act_child_1 , @act_child_2, @act_child_3,@act_child_2_1, @act_child_3_1,
                  @act_child_3_1_1,  @act_child_3_2 ]
  end

  describe "validations" do

#    %w[:activity_word_id :activity_text:activity_name :parent].each do |attr|
#      it "should must have #{attr}" do
#        a=Activity.new
#        a.valid?
#        a.should_not be_valid
#        a.errors[attr].should_not be_nil
#      end
#    end

    it "should must not be save with length of activity text more that 1024" do
      str = ""
			2049.times do
			  str = str + 'a'
			end
			a=Activity.new(:activity_word_id => @aw1.id,:activity_text => str  )
			a.valid?
      a.should_not be_valid
			a.errors[:activity_text].should_not be_blank
    end

     it "should must not be save with blank activity text" do
      str = ""
			a=Activity.new(:activity_word_id =>@aw1.id,:activity_text => str  )
			a.valid?
      a.should_not be_valid
      a.errors[:activity_text].should_not be_blank
     end

    it "should must not be save without author" do
      lambda{
        a=Activity.create!(:activity_word_id =>@aw1.id,:activity_text => "hello" )

      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should must not be saved with invalid author" do
      lambda {
        a=Activity.create!(:activity_word_id =>@aw1.id,:activity_text => "hello",
                           :activity_name => "act temp",:author_id => 100 )
        a.errors[:author].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should must not be saved with Invalid parent activity" do
      lambda {
        a=Activity.create!(:activity_word_id => @aw1.id,:activity_text => "hello",:activity_name => "act temp",
                           :author_id => Factory(:user), :parent_id => 1 )
        a.errors[:parent].should_not be_blank
      }.should raise_error ActiveRecord::RecordNotFound
    end
    it "should must not be saved without activity_name" do

    end
       it "should must not be saved without activity_word_id" do

    end
  end


  describe "associations" do

    it "should respond to associations" do
      @act.should respond_to(:author, :parent)
    end
  end

  describe "Read Tree"  do


    it "should be able to find node " do
      Activity.exists?(@act_child_3_1).should_not be_false
      a = Activity.find(@act_child_2_1)
      puts a.activity_name
    end

    it "should be able to fetch all immediate child" do
      @act.children.should include(@act_child_1, @act_child_2, @act_child_3)
    end

    it "should be able to fetch subtree" do
      @act.subtree.all.should == @act_arr
      a = @act.subtree.arrange
      puts a
    end


    it "should be able to fetch subtree at depth 2" do
      @act.subtree(:to_depth => 2).size.should == @act_arr.size - 1
    end

    it "should be able to fetch subtree at depth 2" do
       @act_child_3_1_1.parent.should == @act_child_3_1
    end

    it "user should be able to fetch full thread of activities om his own activities" do
       a= @u.activities.find(@act)
       a.subtree.all.should == @act_arr
    end

    it "user should not be able to directly fetch thread of other users" do
      lambda{
       @u.activities.find(@act_child_3)
      }.should raise_error
    end

    it "user should be able read all his activities by name and count" do
      @u.activities.group("activity_name").order("updated_at DESC").should_not be_nil
    end


    it "user should be able read all its root activities along with their whole subtree" do
      a = @u.activities.find(:all,:conditions => {:ancestry => nil},:order => "updated_at DESC")
      a.should == [@bct,@act]
      a[1].subtree.all.should == @act_arr
    end
    it "user should be able read all its root activities along with their whole subtree" do
      @cct = Activity.create!(:activity_word_id => @aw1.id,:activity_text => "hello_b",
                             :activity_name => "test_c",  :author => @u1)


      @cct_child_1 = @cct.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello_c_1",
                            :activity_name => "test_1", :author => @u2, :parent => @cct )

      @cct_child_1_1 = @cct_child_1.children.create!(:activity_word_id => @aw2.id,:activity_text => "hello_c_1_1",
                            :activity_name => "test_1",  :author => @u, :parent => @cct_child_1 )

      Activity.board(@u)
    end

  end

  describe "Update Tree" do

    it "should be able to add child on fly" do
      a = @act.children.create(:activity_word_id => @aw2.id,:activity_text => "hello",:activity_name => "activity_temp",
                               :author => @u, :parent => @act )
      @act.children.should include(@act_child_1, @act_child_2, @act_child_3, a)
      @act.children.size.should == 4
    end

    it "should be not allow update of author" do

      a = @act.children
      usr = Factory(:user)
      lambda {
        a[2].author = usr
        a[2].save!
      }.should raise_error ActiveRecord::RecordNotSaved

      b = Activity.find(a[2])
      b.author.should_not == usr

    end
    it "should be not allow update of parent" do

      a = @act.children
      usr = Factory(:user)
      parent = Activity.create!(:activity_word_id => @aw1.id,:activity_text => "hello temp",:activity_name => "Act temp",
                              :author => usr)
      #parent = @act_child_1
      lambda {
        a[2].parent = parent
        a[2].save!
      }.should raise_error ActiveRecord::RecordNotSaved

      b = Activity.find(a[2])
      b.parent.should_not == parent

    end


    it "should be allowed to update descendent" do
      a = @act.children
      a[2].activity_text = "alok"
      a[2].save
      Activity.find(:all, :conditions => {:activity_text => "alok"}).should == [a[2]]
    end

    it "User should be allowed to update descendent" do
      a = @u2.activities
      a[1].activity_text = "alok"
      a[1].save
      Activity.find(:all, :conditions => {:activity_text => "alok"}).should == [a[1]]
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

    it "should be not be able delete invalid children " do
      lambda{
          @act_child_3.children.destroy(@act_child_2_1)
        }.should raise_error ActiveRecord::RecordNotFound
    end

    it "should be not be able delete invalid subtree " do
      lambda{
          @act_child_3.subtree.destroy(@act_child_2)
        }.should raise_error ActiveRecord::RecordNotFound
    end

    it "should be able delete subtree " do
      @act.children.delete(@act_child_2)
      @act.subtree.should include(@act_child_2_1)
      @act.subtree.should include(@act_child_3_1_1, @act_child_3, @act_child_3_2)
    end
    it "Deletion of activity should not update the time of parent " do
      @u.activities.destroy(@act_child_1)
      a = @u.activities.find(:all,:conditions => {:ancestry_depth => 0},:order => "updated_at DESC")
      a.should == [@act,@bct]

    end
  end
  describe "Contacts"  do
     it "User should be able to read all activities from himself and friends based  " do

    end
    it "User should be able to read all activities from himself and friends based in order of time of updation " do

    end
  end
  describe "CreateActivity" do
    include DelayedJobSpecHelper
    it "should create activity by the class method given" do
      act = Activity.CreateActivity(:author_id => @u.id, :activity => "eating" , :text => "pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true)
      act.should_not be_nil
      work_off
      child = Activity.CreateActivity(:author_id => @u1.id, :activity => "&comment&" , :text => "Wow man have fun keep
                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
      child1 = Activity.CreateActivity(:author_id => @u.id, :activity => "&comment&" , :text => "Bow Bow man have fun keep
                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
      child2 = Activity.CreateActivity(:author_id => @u2.id, :activity => "&comment&" , :text => "Cow Cow man have fun keep
                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )
      child3 = Activity.CreateActivity(:author_id => @u1.id, :activity => "&comment&" , :text => "dow dow man have fun keep
                                      me posted. @bhaloo - dont eat much mote", :parent_id => act.id, :enrich => false )

      act.children.should == [child3, child2, child1 , child]

    end
  end
  describe "Hub" do

  end

  describe "Locations" do

  end
  describe "Entities" do

  end
  describe "Mentions" do

  end

end

