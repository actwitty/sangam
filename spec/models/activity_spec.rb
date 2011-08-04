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
			a.valid?
      a.should be_valid
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
                              :location => {:geo_location =>{:geo_latitude => 21.45 ,:geo_longitude => 43.45, :geo_name => "marathalli"}},
                              :enrich => true)
      act4 = @u.create_activity( :word => "painting" , :text => "Sachin tendulkar  rahul dravid",
                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "lalbagh"}},
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
                             :enrich => true)
      act4 = @u.create_activity( :word => "listening" , :text => "Nakkad wale khisko from delhi belly",
                              :location => {:unresolved_location =>{:unresolved_location_name => "samarth's house"}},
                              :enrich => true)
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

      @u.follow(@u1.id)
      @u1.follow(@u.id)
      @u.follow(@u2.id)
      @u2.follow(@u.id)
      @u.follow(@u3.id)
      @u3.follow(@u.id)

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
      filter = {:word_id => wi.id, :entity_id => e.id}

      h = @u.get_related_friends( filter)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_related_entities(@u1.id,filter)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_related_locations(@u1.id, filter)
      puts h.inspect
      h.should_not be_nil

      h = @u.get_enriched_activities([act[:post][:id], act5[:post][:id], act7[:post][:id]])
      puts h.inspect
      h.should_not be_nil
      a =@u.get_stream({:user_id => @u1.id,  :updated_at => Time.now.utc})
      puts a.inspect

      a = @u.get_stream({:user_id => @u.id, :friend => true})
      puts a
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

     a =@u.get_stream({:user_id => @u.id, :filter => {:word_id => act[:post][:word][:id], :entity_id => e.id},
                       :updated_at => Time.now.utc})
     puts a.inspect
      a.should_not be_blank
      a = @u.remove_activity(act1[:post][:id])
      a.should be_blank
      @u.documents.first.destroy
      a = @u.get_summary({:user_id => @u.id, :updated_at => Time.now.utc, :friend => true})
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
                              :enrich => true, :documents => [{:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg" },
                                                    {:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "http://a.com/xyz.jpg" },
                                               {:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "http://b.com/xyz.jpg" },
                                           {:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "http://c.com/xyz.jpg" }])

       act1 = @u.create_activity( :word => "eating" , :text => "pizza at pizza hut with
                                   <mention><name>Alok Srivastava<name><id>#{@u.id}<id><mention> <mention><name>PIZZA<name><id>235<id><mention>",
                              :location =>  {:web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}},
                              :enrich => true, :documents => [{:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",
                                                                :url => "https://s3.amazonaws.com/xyz.jpg" }])
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
                                                    {:caption => "aaaaabbbbbbbccccc", :thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "http://a.com/xyz.jpg" },
                                               {:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "http://b.com/xyz.jpg" },
                                           {:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",:url => "http://c.com/xyz.jpg" }])

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
       @c1 = Campaign.create_campaign( :author_id => @u1.id, :name => "like", :value => 1,
                                 :activity_id => @a1[:id] )
       @c2 = Campaign.create_campaign( :author_id => @u3.id,:name => "like", :value => 2,
                                   :activity_id => @a1[:id] )
       @c3 = Campaign.create_campaign( :author_id => @u1.id,:name => "support", :value => 3,
                                   :activity_id => @a1[:id] )
       @c4 = Campaign.create_campaign( :author_id => @u1.id,:name => "like", :value => 1,
                                   :activity_id => @a1[:id] )
       @c5 = Campaign.create_campaign( :author_id => @u1.id,:name => "join", :value => 2,
                               :entity_id => @e1.id )
       @c6 = Campaign.create_campaign( :author_id => @u1.id,:name => "join", :value => 2,
                               :location_id => @l1.id )
       @c7 = Campaign.create_campaign( :author_id => @u1.id,:name => "join", :value => 2,
                               :comment_id => @com1[:comment][:id] )
       @c8 = Campaign.create_campaign( :author_id => @u1.id,:name => "join", :value => 2,
                               :document_id => @doc.first.id )
       work_off
       a =@u1.get_stream({:user_id => @u1.id, :updated_at => Time.now.utc})
       puts a
       puts a.size
       a.should_not be_nil
    end
end
end










# == Schema Information
#
# Table name: activities
#
#  id               :integer         not null, primary key
#  activity_word_id :integer         not null
#  activity_text    :text
#  activity_name    :string(255)     not null
#  author_id        :integer         not null
#  base_location_id :integer
#  comments_count   :integer
#  documents_count  :integer
#  campaign_types   :integer         default(1)
#  status           :integer         default(1)
#  source_name      :string(64)      default("actwitty")
#  sub_title        :string(255)
#  summary_id       :integer
#  enriched         :boolean
#  created_at       :datetime
#  updated_at       :datetime
#

