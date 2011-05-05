require 'spec_helper'

describe User do
  
  
  # pending "add some examples to (or delete) #{__FILE__}"
  
  before(:each) do
    @user = Factory.build(:user, :username => "LemonBagDummy", :password => "1234", :password_confirmation => "1234", :email => "lemony@lemonbag.com")    
  end
  
  describe "create a user" do 
    
    it "fails if user name is repeated" do
      user = Factory.build(:user, :username => "LemonBagDummy", :password => "1234", :password_confirmation => "1234", :email => "lemony2@lemonbag.com")        
      user.should_not be_valid
      user.errors[:username].should_not be_nil
      puts user.errors[:username]
    end
    
    it "fails if email is repeated" do
      user = Factory.build(:user, :username => "LemonBagDummy2", :password => "1234", :password_confirmation => "1234", :email => "lemony@lemonbag.com")        
      user.should_not be_valid
      user.errors[:email].should_not be_nil
      puts user.errors[:email]
    end
    
    it "fails if username is blank" do
      user = Factory.build(:user, :username => "", :password => "1234", :password_confirmation => "1234", :email => "lemony2@lemonbag.com")        
      user.should_not be_valid
      user.errors[:username].should_not be_nil
      puts user.errors[:username]
    end
    
    it "fails if email is blank" do
      user = Factory.build(:user, :username => "LemonBagDummy2", :password => "1234", :password_confirmation => "1234", :email => "")        
      user.should_not be_valid
      user.errors[:email].should_not be_nil
      puts user.errors[:email]
    end
    
    it "fails if password is blank" do
      user = Factory.build(:user, :username => "LemonBagDummy2", :password => "", :password_confirmation => "", :email => "lemony2@lemonbag.com")        
      user.should_not be_valid
      user.errors[:password].should_not be_nil
      puts user.errors[:password]
    end
    
    it "fails if password mismatch confirmation" do
      user = Factory.build(:user, :password => "password", :password_confirmation => "nope")
      user.should_not be_valid 
      user.errors[:password].should_not be_nil
      puts user.errors[:password]
    end
    
    it "fails if password too short" do
      user = Factory.build(:user, :password => "1", :password_confirmation => "1")
      user.should_not be_valid 
      user.errors[:password].should_not be_nil
      puts user.errors[:password]
    end
    
    it "succeeds if password matches confirmation" do
      user = Factory.build(:user, :password => "somepassword", :password_confirmation => "somepassword")        
      user.should be_valid       
    end
    
    #enable this when the DB support for confirmation is up
    xit "succeeds to create a user and increase users count" do
      lambda{
        user = Factory.create(:user)
        user.should be_valid  
      }.should change(User, :count).by(1)
      
    end
    
    it "succeeds to link a profile to user" do
      user = Factory.build(:user, :password => "somepassword", :password_confirmation => "somepassword")        
      user.should be_valid       
      user.profile.should be_valid     
    end
    
    xit "fails to overwrite an existing user id" do
      lambda{
        user = Factory.build(:user, :id => @user.id)
        #user.should_not be_valid
        #user.errors[:id].should_not be_nil          
      }.should raise_error ActiveRecord::RecordNotUnique
    end
    
  end
  
  
  
  
  
end
