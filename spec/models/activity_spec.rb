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
                     :activity_name => @aw1.word_name  )
			a.valid?
      a.should_not be_valid
			a.errors[:activity_text].should_not be_blank
    end

     it "can be save with blank activity text" do
      str = ""
			a=Activity.new(:author_id => @u.id, :activity_word_id => @aw1.id,:activity_text =>"",
                     :activity_name => @aw1.word_name )
##      puts a.errors
##			a.valid?
#
#      a.should be_valid

      a.errors[:activity_text].should be_blank
     end

    it "should must not be save without author" do
      lambda{
        a=Activity.create!(:activity_word_id => @aw1.id,:activity_text =>"alok",
                     :activity_name => @aw1.word_name )

      }.should raise_error ActiveRecord::RecordInvalid
    end

    it "should must not be saved with invalid author" do
      lambda {
        a=Activity.create!(:author_id => 123,:activity_word_id => @aw1.id,:activity_text =>"alok",
                     :activity_name => @aw1.word_name  )
        a.errors[:author].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end


    it "should must not be saved without activity_name" do
      lambda {
        a=Activity.create!(:author_id => 123,:activity_word_id => @aw1.id,:activity_text =>"alok"  )
        a.errors[:activity_name].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end
       it "should must not be saved without activity_word_id" do
      lambda {
        a=Activity.create!(:activity_text =>"alok",:activity_name => @aw1.word_name )
        a.errors[:activity_word_id].should_not be_blank
        }.should raise_error ActiveRecord::RecordInvalid
    end
  end


  describe "associations" do

    it "should respond to associations" do
      act = Factory(:activity)
      act.should respond_to(:author)
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

    it "should be able to add comment on the activity" do

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

    end
    it "User should be able to destroy *only* his activities" do

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
      act = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true)


      act3 = @u.create_activity( :word => "singing" , :text => "AR rehman's jai ho",
                              :location => {:geo_location =>{:geo_latitude => 21.45 ,:geo_longitude => 43.45, :geo_name => "marathalli", :geo_city => "bangalore", :geo_region => "karnataka"}},
                              :enrich => true)
      act4 = @u.create_activity( :word => "painting" , :text => "Sachin tendulkar  rahul dravid",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "lalbagh", :geo_city => "bangalore", :geo_country => "india"}},
                              :enrich => true)
      act4 = @u.create_activity( :word => "eating" , :text => "pizza Britney spears  rahul dravid pizza pizza hut",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "tundi"}},
                              :enrich => true)
      act2 = @u1.create_activity( :word => "eating" , :text => "pizza at sachin tendulkar with
                                  <mention><name>PIZZA<name><id>235<id><mention>",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true)
       act5 = @u1.create_activity( :word => "photgraphy" , :text => "Burger at Dominos with Rahul Dravid",
                              :location => {:unresolved_location =>{:unresolved_location_name =>  "Cool Place"}},
                              :enrich => true)
       act6 = @u2.create_activity( :word => "eating" , :text => "Dal roti at McDonald's with MS Dhoni",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "lalbagh"}},
                              :enrich => true)
       act7 = @u2.create_activity( :word => "photgraphy" , :text => "idli vada at <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> with Robin Uthhapa",
                              :location => {:web_location =>{:web_location_url => "google.com", :web_location_title => "hello"}},
                             :enrich => true, :summary_category => "sports")
      act4 = @u.create_activity( :word => "listening" , :text => "Nakkad wale khisko from delhi belly",
                              :location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
                              :enrich => true, :summary_category => "sports")
      act5 = @u1.create_activity( :word => "eating" , :text => "pizza Dal chawal and gulab jamoon at sahib singh sultan",
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

#      @u.follow(@u1.id)
#      @u1.follow(@u.id)
#      @u.follow(@u2.id)
#      @u2.follow(@u.id)
#      @u.follow(@u3.id)
#      @u3.follow(@u.id)
      @u1.subscribe_summary(act[:post][:summary_id])
      @u2.subscribe_summary(act3[:post][:summary_id])
      @u1.subscribe_summary(act6[:post][:summary_id])
      @u.subscribe_summary(act2[:post][:summary_id])
      @u.subscribe_summary(act6[:post][:summary_id])

      params[:scope] = 0
      params[:order] = "2011-07-05T07:28:56Z"
      h = @u.get_user_activities(@u.id,1)
      puts h.inspect
      h.should_not be_nil

       h = @u.get_user_entities(@u.id,1)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_user_locations(@u.id,1)
      puts h.inspect
      h.should_not be_nil

      wi = ActivityWord.where(:word_name => "Eating").first
      e = Entity.where(:entity_name => "roti").first
      l = Location.where(:location_type => AppConstants.location_type_geo, :location_lat => 23.45 ,:location_long => 45.45).first
      filter = {:word_id => wi.id,  :source_name => "actwitty"}

      puts "Related Friends"
      h = @u.get_related_friends( {:filter => {:category_type => "/stories", :entity_id => e.id, :source_name => "actwitty"}})
      puts h.inspect
      h.should_not be_nil
      puts "============================================================="

      puts "Related Entity"
      h = @u.get_related_entities({:user_id => @u1.id,:filter => filter, :page_type => AppConstants.page_state_subscribed})
      puts h.inspect
      h.should_not be_nil
      puts "*************************************************************"
      h = @u.get_related_entities({:user_id => @u1.id,:filter => filter, :page_type => AppConstants.page_state_all})
      puts h.inspect
      h.should_not be_nil
      puts "*************************************************************"
      h = @u.get_related_entities({:user_id => @u1.id,:filter => filter, :page_type => AppConstants.page_state_user})
      puts h.inspect
      h.should_not be_nil
      puts "============================================================="

      puts "Related Location"
      h = @u.get_related_locations({:user_id => @u1.id,:filter => filter, :page_type => AppConstants.page_state_subscribed})
      puts h.inspect
      h.should_not be_nil
      puts "*************************************************************"
      h = @u.get_related_locations({:user_id => @u1.id,:filter => filter, :page_type => AppConstants.page_state_all})
      puts h.inspect
      h.should_not be_nil
      puts "*************************************************************"
      h = @u.get_related_locations({:user_id => @u1.id,:filter => filter, :page_type => AppConstants.page_state_user})
      puts h.inspect
      h.should_not be_nil
      puts "============================================================="

      puts "Enriched Activity"
      h = @u.get_enriched_activities([act[:post][:id], act5[:post][:id], act7[:post][:id]])
      puts h.inspect
      h.should_not be_nil
      puts "============================================================="

      puts "Get Stream 1"
      a =@u.get_stream({:user_id => @u1.id, :page_type => AppConstants.page_state_user, :updated_at => Time.now.utc})
      puts a
      puts "============================================================="

      puts "Get Summary 1"
      a =@u.get_summary({:user_id => @u1.id, :page_type => AppConstants.page_state_user, :updated_at => Time.now.utc})
      puts a
      puts "============================================================="


      puts "Get Stream 2"
      a = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all,:friend => true})
      puts a
      puts "============================================================="

      puts "Get Summary 2"
      a =@u.get_summary({:user_id => @u1.id, :page_type => AppConstants.page_state_all, :friend => true})
      puts a
      puts "============================================================="

      a = Activity.where(:id => act2[:post][:id]).first
      a.destroy
      puts "Get Stream 2A"
      a = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all,:friend => true})
      puts a
      puts "============================================================="

      puts "Get Summary 2A"
      a =@u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_all, :friend => true})
      puts a
      puts "============================================================="

      a = Activity.where(:id => act[:post][:id]).first
      a.destroy
      puts "Get Stream 2B"
      a = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all,:friend => true})
      puts a
      puts "============================================================="

      puts "Get Summary 2B"
      a =@u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_all, :friend => true})
      puts a
      puts "============================================================="

      puts "Get Stream 3"
      a = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_subscribed,:friend => true})
      puts a
      puts "============================================================="

      puts "Get Summary 3"
      a =@u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_subscribed, :friend => true})
      puts a
      puts "============================================================="

      puts "Entity Stream"
      a = @u.get_entity_stream({:entity_id => e.id})
      puts a.inspect
      puts "============================================================="

      puts "location Stream"
      a = @u.get_location_stream( {:location_id => l.id})
      puts a
      puts "============================================================="

      puts "Activity Stream"
      a = @u.get_activity_stream({:word_id => wi.id})
      puts a
      puts "============================================================="

      puts "Top Recent Summary"
      a = @u.get_recent_public_summary
      puts a
      puts "============================================================="
    end
    it "should read create read and delete comments" do
      act = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true, :documents => [{:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:thumb_url => "https://s3.amazonaws.com/abc_thumb.jpg",:url => "https://s3.amazonaws.com/abc.jpg" }])

      puts act
      work_off
      com1 = @u1.create_comment(:activity_id => act[:post][:id], :text => "11111111111 1")
      puts com1
      com2 = @u.create_comment(:activity_id => act[:post][:id], :text => " 2222222222222 ")
      puts com2
      com3 = @u2.create_comment(:activity_id => act[:post][:id], :text => "3333333333333333")
      puts com3
      com4 = @u3.create_comment(:activity_id => act[:post][:id], :text => "444444444444444")
      puts com4
      com5 = @u3.create_comment(:activity_id => act[:post][:id], :text => "555555555555555")
      puts com5

      @c1 = Campaign.create_campaign( :author_id => @u.id, :name => "like", :value => 1,
                             :activity_id => act[:post][:id] )
      puts @c1.inspect

      @c2 = Campaign.create_campaign( :author_id => @u3.id,:name => "like", :value => 2,
                               :activity_id => act[:post][:id] )
      @c3 = Campaign.create_campaign( :author_id => @u1.id,:name => "support", :value => 3,
                               :activity_id => act[:post][:id])

      act1 = @u1.create_activity( :word => "eating" , :text => "pizza at sachin tendulkar",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true, :documents => [{:thumb_url => "https://s3.amazonaws.com/blk_thumb.jpg",
                                                                :url => "https://s3.amazonaws.com/blk.jpg" },
                                                    {:thumb_url => "https://s3.amazonaws.com/bbb_thumb.jpg",:url => "abc" }])
      work_off
      com11 = @u1.create_comment(:activity_id => act1[:post][:id], :text => "aaaaaaaaaaaaaaaaaa")
      puts com1
      com21 = @u.create_comment(:activity_id => act1[:post][:id], :text => " bbbbbbbbbbbbbbbbb ")

      @c21 = Campaign.create_campaign( :author_id => @u3.id,:name => "like", :value => 2,
                               :activity_id => act1[:post][:id] )
      @c31 = Campaign.create_campaign( :author_id => @u1.id,:name => "support", :value => 3,
                               :activity_id => act1[:post][:id])
      com6 = @u3.create_comment(:activity_id => act[:post][:id], :text => "6666666666666666")
      puts com6
      act2 = @u2.create_activity( :word => "eating" , :text => "burger at rahul dravid",
                             :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true, :documents => [{:thumb_url => "https://s3.amazonaws.com/ccc_thumb.jpg",
                                                                :url => "https://s3.amazonaws.com/ccc.jpg" },
                                                    {:thumb_url => "https://s3.amazonaws.com/ddd_thumb.jpg",:url => "https://s3.amazonaws.com/ddd.jpg" }])
      work_off
      l = @u.load_all_comment(act[:post][:id])
      l.should_not be_blank

      @u.remove_comment(com2[:comment][:id])
      Comment.count.should == 7

      a = Activity.where(:id => act[:post][:id]).first
      puts a.comments.size

      h = @u.get_all_activity([act[:post][:id], act1[:post][:id]])
      puts h.inspect
      h.should_not be_blank

      @u.follow(@u1.id)
      @u.follow(@u2.id)

      e = Entity.where(:entity_name => "pizza").first

      a =@u.get_stream({:user_id => @u.id, :filter => {:word_id => act[:post][:word][:id],:entity_id => e.id, :location_id => a.base_location_id},
                       :updated_at => Time.now.utc})
      puts "================"
      puts a
      puts "================"
      a.should_not be_blank
      a = @u.remove_activity(act1[:post][:id])
      a.should be_blank
      @u.documents.first.destroy
      a = @u.get_summary({:user_id => @u.id, :updated_at => act2[:post][:time], :friend => true})
      puts a
    end

    it "should be able to remove summary at last" do
      act = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true)
      act1 = @u.create_activity( :word => "eating" , :text => "",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true)
      act2 = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true)
      work_off
      act3 = @u.create_activity( :word => "eating" , :text => "", :enrich => true)
      act4 = @u1.create_activity( :word => "eating" , :text => "", :enrich => true)

      a = Activity.where(:id => act[:post][:id]).first
      a.destroy
      s = Summary.where(:user_id => @u.id , :activity_word_id => act[:post][:word][:id]).first
      puts s.inspect
      s.should_not be_nil

      a1 = Activity.where(:id => act1[:post][:id]).first
      a1.destroy
      s = Summary.where(:user_id => @u.id , :activity_word_id => act[:post][:word][:id]).first
      puts s.inspect
      s.should_not be_nil

      a2 = Activity.where(:id => act2[:post][:id]).first
      a2.destroy
      s = Summary.where(:user_id => @u.id , :activity_word_id => act[:post][:word][:id]).first
      puts s.inspect
      s.should_not be_nil

      a3 = Activity.where(:id => act3[:post][:id]).first
      a3.destroy
      s = Summary.where(:user_id => @u.id , :activity_word_id => act[:post][:word][:id]).first
      puts s.inspect
      s.should be_nil
    end
    it "should be able to add documents properly" do
       act = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with PIZZA at
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{:url => "https://s3.amazonaws.com/xyz.jpg" },{:url => "http://a.com/xyz.jpg" },
                                               {:url => "http://b.com/xyz.jpg" }, {:url => "http://c.com/xyz.jpg" }])

       act1 = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{ :url => "https://s3.amazonaws.com/xyz.jpg" }])
       work_off
       a = Activity.where(:id => act[:post][:id]).first
       a.documents.size.should == 4
       e = a.entities.where(:entity_name => "pizza").first
       a = @u.remove_entity_from_activity(a.id,e.id)
       puts a
    end
    it "should be able to get the languages based activities" do
      @a1 =  @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with PIZZA at
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{:caption => "hello man",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:caption => "aaaaabbbbbbbccccc",:url => "http://a.com/xyz.jpg" },
                                               {:url => "http://b.com/xyz.jpg" },{:url => "http://c.com/xyz.jpg" }])

      @a1 = @a1[:post]
      @l1 = Location.create_location(:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"})
      @com1 = @u1.create_comment( :activity_id => @a1[:id], :text => "helllllloooo ")

      @e1 = Factory(:entity)

      @doc = Document.where(:activity_id => @a1[:id]).all
      puts Document.count
      @doc.each do |attr|
        puts attr.caption
        puts attr.id
      end
      @com_d = @u2.create_comment( :document_id => @doc.first.id, :text => "Wow nice photo ")

       @e1 = Factory(:entity)
       @c1 = @u1.create_campaign( :name => "like", :value => 1,:activity_id => @a1[:id] )
       @c2 = @u3.create_campaign( :name => "like", :value => 2, :activity_id => @a1[:id] )
       @c3 = @u1.create_campaign( :name => "support", :value => 3, :activity_id => @a1[:id] )
       @c4 = @u1.create_campaign( :name => "like", :value => 1,:activity_id => @a1[:id] )
       @c5 = @u1.create_campaign(:name => "join", :value => 2, :entity_id => @e1.id )
       @c6 = @u1.create_campaign( :name => "join", :value => 2, :location_id => @l1.id )
       @c7 = @u1.create_campaign( :name => "join", :value => 2,:comment_id => @com1[:comment][:id] )
       @c8 = @u1.create_campaign( :name => "join", :value => 2, :document_id => @doc.first.id )
       work_off
       e = Entity.where(:entity_name => "pizza").first
       a =@u1.get_stream({:user_id => @u1.id, :filter => {:entity_id => e.id}, :updated_at => Time.now.utc})
       puts a
       puts a.size
       a.should_not be_nil
    end
    it "should fetch the embedded documents " do
      a = @u.create_activity(:word => "eating" , :text => "pizza at tomato ketchup with PIZZA at
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?v=oIWxnfO7eJM&feature=feedrec wow
                                   http://www.google.com/123 at www.vimeo.com eating with
                                   http://twitpic.com/123/group/564 at dropbox.com/data?id=123 ate ate #eating at #pizza",

                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:caption => "hello man",:url => "https://s3.amazonaws.com/xyz.jpg" },
                                             {:caption => "aaaaabbbbbbbccccc", :url => "http://a.com/xyz.jpg" },
                                             {:url => "http://b.com/xyz.jpg" },
                                             {:caption => "alokalokalok", :url => "http://c.com/xyz.jpg" }],
                              :tags => [{:name => "jump"}, {:name => "Anna hazare"}])
      a1 =  @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with PIZZA at http://www.youtube.com/watch?v=oIWxnfO7eJM&feature=feedrec
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{:caption => "hello man",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:caption => "aaaaabbbbbbbccccc",:url => "http://a.com/xyz.jpg" },
                                               {:url => "http://b.com/xyz.jpg" },{:url => "http://c.com/xyz.jpg" }])

      a2 =  @u.create_activity( :word => "marry" , :text => "pizza at pizza hut with PIZZA at
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{:caption => "hello man",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:caption => "aaaaabbbbbbbccccc",:url => "http://a.com/xyz.jpg" },
                                               {:url => "http://b.com/xyz.jpg" },{:url => "http://c.com/xyz.jpg" }],
                              :tags => [{:name => "mithun"},{:name => "rekha"}])
      a3 =  @u.create_activity( :word => "marry" , :text => "",
                              :location =>  {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true, :documents => [{:caption => "woooooooooo",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg",
                                                              :thumb_url => "http://google.com"}])

      a4 =  @u.create_activity( :word => "marry" , :text => "pizza and sachin tendulkar",
                                                            :enrich => true)

      a5 =  @u.create_activity( :word => "marry" , :text => "",
                              :location =>  {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true)

     h = { :word => "marry" , :text => "sachin tendulakr and rahul dravid
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{ :url => "https://s3.amazonaws.com/2.jpg" },
                                                    {:url => "http://a.com/2.jpg" },
                                               {:url => "http://b.com/2.jpg" },{:url => "http://c.com/2.jpg" }], :status =>
                                            AppConstants.status_public,:tags => [{:name => "sleeping"}, {:name => "maradona"}]}
      a6 =  @u.create_activity( :word => "marry" , :text => "deepika padukone and salman khan looks great",
                              :location =>  {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :enrich => true,:status => AppConstants.status_saved)
      work_off
      id = a[:post][:id]
#
#      b = @u.get_stream({:user_id => @u.id,  :page_type => AppConstants.page_state_user})
#      puts b.inspect
#      b.should_not be_nil

      puts "======================draft====================="

      params = {:filter => {:word_id => a6[:post][:word][:id], :location_id => a6[:location][:id]}}
      puts params.inspect
      a = @u.get_draft_activity(params)
      puts a.inspect

      a = Activity.where(:id => id).first
      s = Summary.where(:id => a.summary_id).first

      puts "=====================summary===================="
      puts s.inspect
#      id = s.document_array[0]

      d=Document.where(:activity_id => id).first
      @u.remove_document(d.id)

      s = Summary.where(:id => a.summary_id).first

      puts "=====================summary again===================="
      puts s.inspect
#      puts Document.count

      summary = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_user})
      puts summary

      #a.destroy
      h[:activity_id] = a.id

      c = @u.update_activity( h)
      puts "=====================update activity===================="
      puts c

      work_off
      summary = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_user})
      puts summary

#      b= @u.get_draft_activity
#      puts b
      s = Summary.where(:id => a.summary_id).first

      puts "=====================summary again again===================="
      puts s.inspect
      summary = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_user})
      puts summary

      Document.all.each do |attr|
        puts attr.inspect
      end

      a = Activity.where(:id => a1[:post][:id]).first
      e = Entity.where(:entity_name => "pizza").first
      puts a.attributes
      puts "======"
      b = @u.remove_entity_from_activity(a.id, e.id)
      puts b
#      a = Activity.where(:id => a2[:post][:id]).first
#      puts a.attributes

      s = Summary.where(:id => a.summary_id).first
      puts "=====================summary again again again===================="
      puts s.inspect

      puts "get document summary"
      a = @u.get_document_summary({:user_id=> @u.id, :page_type => AppConstants.page_state_user, :category => "image"})
      puts a

      puts "get document stream"
      a = @u.get_document_stream({:user_id=> @u.id, :filter => {:source_name => "actwitty"}, :category => "image"})
      puts a

    end
    it "should update the activity status" do
      a = @u.create_activity( :word => "marry" , :text => "sachin tendulakr and rahul dravid
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{ :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:url => "http://a.com/xyz.jpg" },
                                               {:url => "http://b.com/xyz.jpg" },{:url => "http://c.com/xyz.jpg" }], :status =>
                                            AppConstants.status_saved,:tags => [{:name => "sleeping"}, {:name => "maradona"}])
      puts a[:post][:status]
      a = @u.publish_activity({:activity_id => a[:post][:id], :word => "marry" , :text => "sachin tendulakr and rahul dravid
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{ :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:url => "http://a.com/xyz.jpg" },
                                               {:url => "http://b.com/xyz.jpg" },{:url => "http://c.com/xyz.jpg" }], :tags => [{:name => "sleeping"}, {:name => "maradona"}],
                              :status => AppConstants.status_public})

      b = Activity.where(:id => a[:post][:id]).first
      puts b.status

      b.status.should ==  AppConstants.status_public
    end
    it "should update the activity properly " do
      a1 = @u.create_activity(:word => "eating" , :text => " <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?222
                                 ", :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                             {:caption => "2_2", :url => "http://a.com/2_1.jpg" },],

                              :tags => [{:name => "jump2"}, {:name => "Anna hazare 2"}], :status =>
                                            AppConstants.status_saved)
      a = @u.create_activity(:word => "eating" , :text => "pizza at tomato ketchup with PIZZA at
                                   <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?v=oIWxnfO7eJM&feature=feedrec wow
                                   http://www.google.com/123 at www.vimeo.com eating with
                                   http://twitpic.com/123/group/564 at dropbox.com/data?id=123 ate ate #eating at #pizza",

                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:caption => "hello man",:url => "https://s3.amazonaws.com/xyz.jpg" },
                                             {:caption => "aaaaabbbbbbbccccc", :url => "http://a.com/xyz.jpg" },
                                             {:url => "http://b.com/xyz.jpg" },
                                             {:caption => "alokalokalok", :url => "http://c.com/xyz.jpg" }],
                              :tags => [{:name => "jump"}, {:name => "Anna hazare"}], :status =>
                                            AppConstants.status_public)
      h = { :word => "marry" , :text => "i uploaded three pictures http://www.flickr.com/photos/cubagallery/4678462424/
            http://www.flickr.com/photos/itzafineday/131415487/
            http://www.flickr.com/photos/cubagallery/4233446476/",
                              :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{ :url => "https://s3.amazonaws.com/2.jpg" },
                                                    {:url => "http://a.com/2_1.jpg" },
                                               {:url => "http://b.com/2_2.jpg" },{:url => "https://s3.amazonaws.com/xyz.jpg" }], :status =>
                                            AppConstants.status_public,:tags => [{:name => "sleeping"}, {:name => "maradona"}]}
      work_off
      s1 = @u.create_social_counter({:summary_id => a[:post][:summary_id],:activity_id => a[:post][:id], :source_name => "facebook", :action => "share"})
      s2 = @u.create_social_counter({:summary_id => a[:post][:summary_id],:activity_id => a[:post][:id], :source_name => "twitter", :action => "share"})
      s3 = @u.create_social_counter({:summary_id => a1[:post][:summary_id],:activity_id => a1[:post][:id], :source_name => "facebook", :action => "share"})

      b = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts b
      puts "============================="

      h[:activity_id] = a[:post][:id]
      c = nil

      ActiveRecord::Observer.with_observers(:document_observer) do
        c = @u.update_activity( h)
      end
      work_off

      puts c
      c.should_not be_blank

      a = Activity.where(:id => c[:post][:id]).first
      puts a.inspect
      puts "============================="
      b = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts b
#      h[:status] = 2
#      h.delete(:update)
#      c = @u.publish_activity( h)
      work_off
      puts Summary.count
      puts c.inspect
      a = @u.get_draft_activity({:filter => {:word_id => a.activity_word_id}})
      b = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts b
    end


    it "should delete activity properly " do
      a = @u.create_activity(:word => "eating" , :text => "pizza at tomato ketchup with PIZZA at
                                   <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?v=oIWxnfO7eJM&feature=feedrec wow
                                   http://www.google.com/123 at www.vimeo.com eating with
                                   http://twitpic.com/123/group/564 at dropbox.com/data?id=123 ate ate #eating at #pizza",

                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:caption => "hello man",:url => "https://s3.amazonaws.com/xyz.jpg" },
                                             {:caption => "aaaaabbbbbbbccccc", :url => "http://a.com/xyz.jpg" },
                                             {:url => "http://b.com/xyz.jpg" },
                                             {:caption => "alokalokalok", :url => "http://c.com/xyz.jpg" }],
                              :tags => [{:name => "jump"}, {:name => "Anna hazare"}], :status =>
                                            AppConstants.status_public)

      a1 = @u.create_activity(:word => "eating" , :text => " <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?222
                                 ", :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                             {:caption => "2_2", :url => "http://a.com/2_1.jpg" },],

                              :tags => [{:name => "jump2"}, {:name => "Anna hazare 2"}], :status =>
                                            AppConstants.status_public)
      a2 = @u.create_activity(:word => "eating" , :text => "http://www.vimeo.com/watch?333",
                              :location =>  {:web_location =>{:web_location_url => "3OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/3.jpg" },
                                             {:caption => "3_2", :url => "http://a.com/3.jpg" },],

                              :tags => [{:name => "jump3"}, {:name => "Anna hazare 3"}], :status =>
                                            AppConstants.status_public)
      a3 = @u.create_activity(:word => "eating" , :text => "sachin tendulkar http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)

      a4 = @u.create_activity(:word => "eating" , :text => "http://dropbox.com/123 http://www.vimeo.com/watch?555 #pizza",
                              :location =>  {:web_location =>{:web_location_url => "5OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :tags => [{:name => "jump5"}, {:name => "Anna hazare 5"}], :status =>
                                            AppConstants.status_public)
      a5 = @u.create_activity(:word => "eating" , :text => nil,
                              :location =>  {:web_location =>{:web_location_url => "6OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :tags => [{:name => "jump6"}, {:name => "Anna hazare 6"}], :status =>
                                            AppConstants.status_public)
      a6 = @u.create_activity(:word => "eating" , :text => "hanging out with samarth and sachin",
                              :location =>  {:web_location =>{:web_location_url => "7OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :tags => [{:name => "jump7"}, {:name => "Anna hazare 7"}], :status =>
                                            AppConstants.status_saved)
      b = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_user})
      puts b
      b.should_not be_blank
      ActiveRecord::Observer.with_observers(:document_observer) do
        Activity.destroy_all(:id => a[:post][:id])
      end
      puts "======================================="

      b = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_user})
      puts b
      b.should_not be_blank
    end
    it "should create the social counter properly" do
      a = @u.create_activity(:word => "eating" , :text => "pizza at tomato ketchup with PIZZA at
                                   <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?v=oIWxnfO7eJM&feature=feedrec wow
                                   http://www.google.com/123 at www.vimeo.com eating with
                                   http://form6.twitpic.com/ard_yt.jpeg at dropbox.com/data?id=123 ate ate #eating at #pizza",

                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:caption => "hello man",:url => "https://s3.amazonaws.com/xyz.jpg" },
                                             {:caption => "aaaaabbbbbbbccccc", :url => "http://a.com/xyz.jpg" },
                                             {:url => "http://b.com/xyz.jpg" },
                                             {:caption => "alokalokalok", :url => "http://c.com/xyz.jpg" }],
                              :tags => [{:name => "jump"}, {:name => "Anna hazare"}], :status =>
                                            AppConstants.status_public)
      a1 = @u.create_activity(:word => "eating" , :text => " <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?222
                                 ", :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                             {:caption => "2_2", :url => "http://a.com/2_1.jpg" },],

                              :tags => [{:name => "jump2"}, {:name => "Anna hazare 2"}], :status =>
                                            AppConstants.status_public)
      s1 = @u.create_social_counter({:summary_id => a[:post][:summary_id],:activity_id => a[:post][:id], :source_name => "facebook", :action => "share"})
      s2 = @u.create_social_counter({:summary_id => a[:post][:summary_id],:activity_id => a[:post][:id], :source_name => "twitter", :action => "share"})
      s3 = @u.create_social_counter({:summary_id => a1[:post][:summary_id],:activity_id => a1[:post][:id], :source_name => "facebook", :action => "share"})
      #s4 = @u.create_social_counter({:author_id => @u.id ,:summary_id => a1[:post][:summary_id],:activity_id => a1[:post][:id], :source_name => "facebook", :action => "share"})
      puts s1.inspect
      activity_id = a1[:post][:id]
      a = Activity.where(:id => a[:post][:id]).first
      puts a.social_counters

      puts "====================="
      s = Summary.where(:id => a.summary_id).first
      puts s.inspect
      a = @u.get_social_counter({:activity_id => a.id})
      puts a
      a= @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts a
      puts "============Theme Creation========================"
      a = Theme.create_theme({:fg_color => "2345", :bg_color => "2356", :author_id => @u.id, :summary_id => s.id})
      a = Theme.where(:author_id => @u.id, :summary_id => s.id).first
      puts a.inspect
      Theme.create_theme({:url => "2345", :bg_color => "2356", :author_id => @u.id, :summary_id => s.id})
      a =Theme.where(:author_id => @u.id, :summary_id => s.id).first
      puts a.inspect
      d = Document.where(:activity_id => activity_id).first
      @u.create_theme({:document_id => d.id, :author_id => s.user_id, :summary_id => s.id,:theme_type =>AppConstants.theme_document })
      a = Theme.where(:author_id => @u.id, :summary_id => s.id).first
      puts a.inspect
      puts "============Theme Creation Done========================"
      s = Summary.where(:id => s.id).first
      puts s.inspect

#      a = Activity.where(:id => a1[:post][:id]).first
#      a.destroy
#      Activity.destroy_all
      a = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts a
      a = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts a
      a = Activity.where(:id => a1[:post][:id]).first
      a.destroy
      puts "after destroy"
      a = @u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts a
      a = @u.get_summary({:user_id => @u.id, :page_type => AppConstants.page_state_all})
      puts a
    end
    it "should create and use the summary subscription properly" do
      a1 = @u.create_activity(:word => "eating" , :text => " <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?222 http://form6.flickr.com/ wow
                                 ", :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                             {:caption => "2_2", :url => "http://a.com/2_1.jpg" },],

                              :tags => [{:name => "jump2"}, {:name => "Anna hazare 2"}], :status =>
                                            AppConstants.status_public)
      a2 = @u.create_activity(:word => "marry" , :text => "http://www.vimeo.com/watch?333",
                              :location =>  {:web_location =>{:web_location_url => "3OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/3.jpg" },
                                             {:caption => "3_2", :url => "http://a.com/3.jpg" },],

                              :tags => [{:name => "jump3"}, {:name => "Anna hazare 3"}], :status =>
                                            AppConstants.status_public)
      a3 = @u3.create_activity(:word => "marry" , :text => "sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)

      @u1.subscribe_summary(a1[:post][:summary_id])
      @u2.subscribe_summary(a1[:post][:summary_id])
      @u1.subscribe_summary(a3[:post][:summary_id])
      @u1.subscribe_summary(a2[:post][:summary_id])
      puts "get summary 1"
      a = @u1.get_subscriber_summary
      puts a
      puts "Get Followers"
      user = Contact.where(:user_id => @u1.id).all
      puts user.inspect
      puts "get subscriber 1"
      a = @u1.get_summary_subscribers(a1[:post][:summary_id])
      puts a
      @u1.unsubscribe_summary(a3[:post][:summary_id])
      puts "get summary 2"
      a = @u1.get_subscriber_summary
      puts a
      @u1.subscribe_summary( a1[:post][:summary_id])
      puts "get summary 3"
      a = @u1.get_subscriber_summary
      puts a
      puts "get subscriber 2"
      a = @u1.get_summary_subscribers(a1[:post][:summary_id])
      puts a
      @u1.subscribe_summary( a3[:post][:summary_id])
      a = @u1.get_document_stream({:user_id => @u1.id,:category => "image", :page_type => AppConstants.page_state_all})
      puts a
      puts "unsubscribe 1"
      @u1.unsubscribe_summary(a1[:post][:summary_id])

      a = @u1.get_document_stream({:user_id => @u2.id,:category => "image", :page_type => AppConstants.page_state_subscribed })
      puts a
      puts "Summary"
      a = @u1.get_document_summary({:user_id => @u1.id, :category => "image", :page_type => AppConstants.page_state_subscribed,
                                  })
      puts a

      a = Activity.where(:id => a2[:post][:id]).first
      a.destroy
      a = @u1.get_document_summary({:user_id => @u1.id, :category => "image", :page_type => AppConstants.page_state_all})
      puts a
    end
    it "should fetch single activity properly" do
       a1 = @u.create_activity(:word => "eating" , :text => " <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello
                                   http://www.youtube.com/watch?222 http://form6.flickr.com/ wow
                                 ", :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                             {:caption => "2_2", :url => "http://a.com/2_1.jpg" },],

                              :tags => [{:name => "jump2"}, {:name => "Anna hazare 2"}], :status =>
                                            AppConstants.status_public)
       a2 = @u.create_activity(:word => "eating" , :text => "http://www.vimeo.com/watch?333",
                              :location =>  {:web_location =>{:web_location_url => "3OOGLE.com", :web_location_title => "hello"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/3.jpg" },
                                             {:caption => "3_2", :url => "http://a.com/3.jpg" },],

                              :tags => [{:name => "jump3"}, {:name => "Anna hazare 3"}], :status =>
                                            AppConstants.status_public)
       a3 = @u.create_activity(:word => "marry" , :text => "sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)
       a4 = @u.create_activity(:word => "beating" , :text => "sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)
       @u1.subscribe_summary(a1[:post][:summary_id])
       @u2.subscribe_summary(a1[:post][:summary_id])
       @u1.subscribe_summary(a3[:post][:summary_id])
       @u1.subscribe_summary(a3[:post][:summary_id])

       s1 = @u.create_social_counter({:summary_id => a1[:post][:summary_id],:activity_id => a1[:post][:id],
                                      :source_name => "facebook", :action => "share"})
       s2 = @u.create_social_counter({:summary_id => a2[:post][:summary_id],:activity_id => a2[:post][:id],
                                      :source_name => "twitter", :action => "share"})
       s3 = @u.create_social_counter({:summary_id => a3[:post][:summary_id],:activity_id => a3[:post][:id],
                                      :source_name => "facebook", :action => "share"})
       puts "get summary 1"
       a = @u1.get_subscriber_summary
       puts a

       puts "get social counter 1"
       a = @u.get_social_counter({:activity_id => a3[:post][:id]})
       puts a

       s = @u.update_summary({:summary_id => a1[:post][:summary_id], :new_name => "marry"})
       s.should_not be_nil
       puts s.inspect

       puts "get summary 2"
       a = @u1.get_subscriber_summary
       puts a

       puts "get social counter 2"
       a = @u.get_social_counter({:activity_id => a3[:post][:id]})
       puts a

       a = Activity.where(:activity_name => "Eating").all
       puts "============eating============"
       a.each do |attr|
         puts attr.inspect
       end

       a.should be_blank
       a = Activity.where(:activity_name => "Marry").all
       a.should_not be_blank
       puts "============beating============"
       a.each do |attr|
         puts attr.inspect
       end
       s = @u.rename_activity_name({:activity_id => a1[:post][:id], :new_name => "beating"})
       puts s.inspect
       s = @u.rename_activity_name({:activity_id=> a2[:post][:id], :new_name => "beating"})
       puts s.inspect
       s = @u.rename_activity_name({:activity_id => a3[:post][:id], :new_name => "beating"})
       puts s.inspect
       #@u.delete_summary({:summary_id => a3[:post][:summary_id]})
    end

    it "should fetch summary category properly" do
       a1 = @u.create_activity(:word => "Eating" , :text => " <script>alert(alok)</script>
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention>
                                   <mention><name>PIZZA<name><id>235<id><mention> hello Pizza Hut
                                   http://www.youtube.com/watch?222 http://form6.flickr.com/ wow
                                 ", :location =>  {:web_location =>{:web_location_url => "2OOGLE.com", :web_location_title => "maha llo"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/2.jpg" },
                                             {:caption => "2_2", :url => "http://a.com/2_1.jpg" },],:summary_category => "animals",

                              :tags => [{:name => "jump2"}, {:name => "Anna hazare 2"}], :status =>
                                            AppConstants.status_public)
       a2 = @u.create_activity(:word => "eating" , :text => "http://www.vimeo.com/watch?333",
                              :location =>  {:web_location =>{:web_location_url => "3OOGLE.com", :web_location_title => "mallo"}},
                              :enrich => true,
                              :documents => [{:url => "https://s3.amazonaws.com/3.jpg" },
                                             {:caption => "3_2", :url => "http://a.com/3.jpg" },],

                              :tags => [{:name => "jump3"}, {:name => "Anna hazare 3"}], :status =>  AppConstants.status_public)
       a3 = @u.create_activity(:word => "marry" , :text => "sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)
       a4 = @u.create_activity(:word => "Eat" , :text => "sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.46, :geo_name => "madama curie"}},
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)
       a5 = @u.create_activity(:word => "eating" , :text => "sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
                              :enrich => true,
                              :tags => [{:name => "jump4"}, {:name => "Anna hazare 4"}], :status =>
                                            AppConstants.status_public)
       a6 = @u.create_activity(:word => "eating" , :text => "", :enrich => true,
                               :source_name => "facebook", :status => AppConstants.status_public, :source_msg_id => "909090909")
       a7 = @u.create_activity(:word => "eating" , :text => "",:enrich => true,:location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
                              :source_name => "facebook", :status => AppConstants.status_public, :source_msg_id => "1254324")
       s = @u.update_summary_category(:summary_id => a1[:post][:summary_id],:category_id => "animals")
#       work_off
#       puts s.inspect
#       s.should_not be_blank
#
#       s = Summary.where(:id => a1[:post][:summary_id]).first
#       puts s.inspect
#       s.should_not be_blank
#
#       puts "Get Stream 1"
#       a =@u.get_stream({:user_id => @u.id, :page_type => AppConstants.page_state_user, :filter => {:word_id => a1[:post][:word][:id] },
#                         :updated_at => Time.now.utc})
#       a.should_not be_blank
#       puts a.inspect
#
#       a = SummaryRank.add_analytics({:fields => ["posts"], :summary_id => a1[:post][:summary_id] })
#       puts a.inspect
#       a.should_not be_blank
#
#       a5 = @u.create_activity(:word => "eating" , :text => "http://www.youtube.com/watch?222 http://www.flickr.com/ wow",:location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
#                              :enrich => true,:summary_category=>"cars" ,
#                               :status => AppConstants.status_public)
#
#       @u1.subscribe_summary(a5[:post][:summary_id])
#       @u2.subscribe_summary(a5[:post][:summary_id])
#
#       s1 = @u.create_social_counter({:summary_id => a5[:post][:summary_id],:activity_id => a5[:post][:id], :source_name => "facebook", :action => "share"})
#       s2 = @u.create_social_counter({:summary_id => a5[:post][:summary_id],:activity_id => a5[:post][:id], :source_name => "twitter", :action => "share", :desc => "wow"})
#
#       com1 = @u1.create_comment(:activity_id => a5[:post][:id], :text => "11111111111 1")
#       puts com1
#       com2 = @u.create_comment(:activity_id => a5[:post][:id], :text => " 2222222222222 ")
#       puts com2
#
#       @c1 = @u1.create_campaign( :name => "like", :value => 1,:activity_id => a5[:post][:id] )
#       @c2 = @u3.create_campaign( :name => "like", :value => 2, :activity_id => a5[:post][:id] )
#
#       work_off
#
#       a = SummaryRank.add_analytics({:fields => ["likes"], :summary_id => a5[:post][:summary_id] })
#       puts a.inspect
#
#       @u2.unsubscribe_summary(a5[:post][:summary_id])
##
#       work_off
#
#       a = @u.get_analytics({:fields => ["all"], :summary_id => a5[:post][:summary_id] })
#       puts a.inspect
#
#
#       a = @u.get_analytics_summary({ :summary_id => a5[:post][:summary_id] })
#       puts a.inspect
#
#
#       @u1.remove_comment(com1[:comment][:id])
#       @u1.remove_campaign({:activity_id => a5[:post][:id], :user_id => @u1.id, :name => "like"})
#
#       work_off
#       a = @u.get_analytics_summary({ :summary_id => a5[:post][:summary_id] })
#       puts a.inspect
#
#       @u.remove_activity(a5[:post][:id])
#       work_off
#       a = @u.get_analytics_summary({ :summary_id => a5[:post][:summary_id] })
#       puts a.inspect
#       work_off
#       @u.get_user_activities(@u.id,1)
#       a = @u.search_models({:type => "entity",:name => "pi"})
#       puts a.inspect
#       a = @u.search_models({:type => "user",:name => "l"})
#       puts a.inspect
#       a = @u.search_models({:type => "channel",:name => "EA"})
#       puts a.inspect
#      a = @u.search_models({:type => "location",:name => "MA"})
#       puts a.inspect
    end
#    TEST REMOVE ENTITY
#    TEST UPDATE ACTIVITY
#    CLEAN GET STREAM
#    TEST CREATE AND DELETE TAGS - Both hash tags and blog tags
#    TEST DOCUMENT API with filter
#    TEST GET USER LOCATION, ENTITY and Activity, Hash, Documents
#    entity creation problem - Tomato ketchup and tomato and ketchup
#    TEST without activity_text, without location, with text without document and without location, all combination

  end
end
















# == Schema Information
#
# Table name: activities
#
#  id                    :integer         not null, primary key
#  activity_word_id      :integer         not null
#  activity_text         :text
#  activity_name         :text            not null
#  author_id             :integer         not null
#  base_location_id      :integer
#  comments_count        :integer         default(0)
#  documents_count       :integer         default(0)
#  tags_count            :integer         default(0)
#  campaign_types        :integer         not null
#  status                :integer         not null
#  source_name           :text            not null
#  sub_title             :text
#  summary_id            :integer
#  enriched              :boolean
#  meta_activity         :boolean
#  blank_text            :boolean
#  social_counters_array :text
#  created_at            :datetime
#  updated_at            :datetime
#  source_msg_id         :string(255)
#  category_type         :string(255)
#  category_id           :string(255)
#

