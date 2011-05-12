require 'spec_helper'

describe User do
  
  
  # pending "add some examples to (or delete) #{__FILE__}"
  
    before(:each) do
      @user = Factory.create(:user,  :username => 'DummyUser',
                                    :password => '1234567',
                                    :password_confirmation => '1234567',
                                    :email => 'lemony@lemonbag.com')
    end


  describe "create a user" do

    it "succeeds on default user build" do
      @user.should be_valid
    end
    it "fails if user name is repeated" do
      lambda{
        user = Factory.create(:user, :username => 'DummyUser')
        user.should_not be_valid
        user.errors[:username].should_not be_nil
        }.should raise_error ActiveRecord::RecordInvalid
    end
    
    it "fails if email is repeated" do
      lambda{
        user = Factory.create(:user,  :email => 'lemony@lemonbag.com')
        user.should_not be_valid
        user.errors[:email].should_not be_nil
      }.should raise_error ActiveRecord::RecordInvalid
    end
    
    it "fails if username is blank" do

        user = Factory.create(:user, :username => '')
        user.should be_valid
        user.username.should == user.email

    end
    
    it "fails if email is blank" do
      user = Factory.build(:user,:email => '')
      user.should_not be_valid
      user.errors[:email].should_not be_nil
      puts user.errors[:email]
    end
    
    it "fails if password is blank" do
      user = Factory.build(:user, :password => '',
                                  :password_confirmation => '')
      user.should_not be_valid
      user.errors[:password].should_not be_nil
      puts user.errors[:password]
    end
    
    it "fails if password mismatch confirmation" do
      user = Factory.build(:user, :password => "password",
                                  :password_confirmation => "nopenomatch")
      user.should_not be_valid 
      user.errors[:password].should_not be_nil
      puts user.errors[:password]
    end
    
    it "fails if password too short" do
      user = Factory.build(:user, :password => "1",
                                  :password_confirmation => "1")
      user.should_not be_valid 
      user.errors[:password].should_not be_nil
      puts user.errors[:password]
    end
    
    it "does not create a profile for unconfirmed user" do
      user = Factory.build(:user)
      user.should be_valid
      user.profile.should be_nil
    end
    
    it "fails to overwrite an existing user id" do
      lambda{
        user = Factory.create(:user, :id => @user.id)
      }.should raise_error ActiveRecord::RecordNotUnique
    end
    
  end


  describe "update user fields" do
    before(:each) do
        @local_dummy_user = User.find_by_username('DummyUser')
        @modified_username='DummyIsNotNiceName'
    end
    it "succeeds to find a user by username"  do
        @local_dummy_user.should be_valid
    end
    it "succeeds to change username in user table" do

        @local_dummy_user.username=@modified_username
        @local_dummy_user.save
        @local_dummy_user = User.find_by_username( @modified_username)
        @local_dummy_user.should be_valid
        @local_dummy_user.username.should == @modified_username
    end

    it "fails to change username to non unique in user table" do

        user1 =   Factory.create(:user)
        user2 =   Factory.create(:user)

        user1.username="RepeatedNames"
        user2.username=user1.username
        user1.save
        lambda {
          user2.save!
        }.should raise_error  ActiveRecord::RecordInvalid
    end

    it "fails to change email to non unique in user table" do

           user1 =   Factory.create(:user)
           user2 =   Factory.create(:user)
           user1.username="someemailid@lemonbag.com"
           user2.username=user1.username
           user1.save
           lambda {
             user2.save!
           }.should raise_error  ActiveRecord::RecordInvalid
    end
  end
  

  describe "destroy user and dependencies" do

  end
  
  
  
end
