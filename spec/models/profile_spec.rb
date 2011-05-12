require 'spec_helper'
require 'active_support/secure_random'

describe Profile do
  #pending "add some examples to (or delete) #{__FILE__}"
  before(:each) do
    @username =   'profiletest'
    @email = 'tester@lemonbag.com'
    @user = Factory.create(:user, :username => @username, :email => "tester@lemonbag.com")
    @profile = Factory.create(:profile, :user_id => @user.id)
    @user.profile = @profiles
  end

  describe 'create profile' do
    it 'creates a profile successfully' do
      @profile.should be_valid
    end

     it "fails on no user added " do
          lambda {
              profile = Factory.create(:profile, :user_id => nil)
          }.should raise_error ActiveRecord::RecordInvalid

     end

     it "fails to create multiple profile for single user id"  do
       lambda {
          profile = Factory.create(:profile, :user_id => @user.id)
       }.should raise_error ActiveRecord::RecordInvalid
     end

    it "fails to create profile with empty first name" do
           profile = Factory.build(:profile, :first_name => '')
           profile.should_not be_valid
    end

    it "fails to create profile with empty last name" do
           profile = Factory.build(:profile, :last_name => '')
           profile.should_not be_valid
    end
  end

  describe 'validations of length of profile fields' do
    attrs_len_hash = {
                  :first_name => 33,
                  :last_name => 33,
                  :nick_name => 129,
                  :mobile_number => 6,
                  :mobile_number => 33,
                  :phone_number => 6,
                  :phone_number => 33,
                  :company_name => 65,
                  :work_area => 65,
                  :interest => 129,
                  :home_page => 251,
                  :twitter_id => 33,
                  :facebook_id => 33,
                  :google_id => 33,
                  :open_id => 65,
                  :home_location => 129,
                  :current_location => 129,
                  :short_status => 201
                }
    attrs_len_hash.each do |attr, length|

      it "fails on creating an entry for #{attr} for length #{length.to_s}"  do
            random_string = ActiveSupport::SecureRandom.hex(length)
            profile = Factory.build(:profile, attr => random_string)
            profile.should_not be_valid
            profile.errors[attr].should_not be_nil
      end


    end
  end

  describe "find a profile for user" do
    it "must find a profile based on user name" do
      profile = User.find_by_username(@username).profile
      profile.should be_valid
    end

    it "must find a profile based on email id" do
      profile = User.find_by_email(@email).profile
      profile.should be_valid
    end

  end


  describe "delete a profile" do
      it "must delete a profile based on email" do
        lambda{
          User.find_by_username(@username).profile.delete
          }.should change(Profile, :count).by(-1)
      end
  end


  describe "find profiles start by first name or last name" do
      before(:each) do
        user1=Factory.create(:user, :username => 'sentence')
        user2=Factory.create(:user, :username => 'sentinel')
        user3=Factory.create(:user, :username => 'sentimental')
        Factory.create(:profile, :user_id => user1.id, :first_name => 'Sento')
        Factory.create(:profile, :user_id => user2.id, :last_name => 'Senta', :first_name => 'Bento' )
        Factory.create(:profile, :user_id => user3.id, :last_name => 'Pinto', :first_name => 'Bento' )
      end

      it 'must find a user whose first name is Sento without join with where' do
        profiles=Profile.where('first_name = ?', 'Sento')
        profiles.count.should == 1
        profile=profiles.first
        profile.should be_valid

        users = User.where('id = ?', profile.user_id )
        user = users.first
        users.count.should == 1
        user.should be_valid
        user.username.should == 'sentence'
      end


    it 'must find a user whose first name is Sento without join' do
        username='Sento'
        user= User.find_by_id(Profile.find_by_first_name('Sento').user_id)
        user.should be_valid
        user.username.should == 'sentence'

    end

    it 'must find a user whose first name is Sento with join' do
       users=User.find(:all, :include => [ :profile ], :conditions => ['profiles.first_name = ?', 'Sento'])
       users.count.should == 1
       user=users.first
       user.should be_valid
       user.username.should == 'sentence'
    end

    it 'must find a user whose first name is Sent* with join' do
       users=User.find(:all, :include => [ :profile ], :conditions => ['profiles.first_name LIKE ? OR profiles.last_name LIKE ? ', 'Sent%', 'Sent%' ])
       users.count.should == 2


      #users.each do |user|
      #  puts user.username
      #end

    end

  end

end
