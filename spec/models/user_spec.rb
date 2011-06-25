require 'spec_helper'

describe User do
  
  
  # pending "add some examples to (or delete) #{__FILE__}"
  
    before(:each) do
      @user = Factory.create(:user, :password => '1234567',
                                    :password_confirmation => '1234567',
                                    :email => 'lemony@lemonbag.com')
    end


  describe "create a user" do

    it "succeeds on default user build" do
      @user.should be_valid
    end
    
    it "fails if email is repeated" do
      lambda{
        user = Factory.create(:user,  :email => 'lemony@lemonbag.com')
        user.should_not be_valid
        user.errors[:email].should_not be_nil
      }.should raise_error ActiveRecord::RecordInvalid
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
    end
    it "succeeds to find a user by username"  do
        @local_dummy_user.should be_valid
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
  


  describe "manage contacts for user" do
    before(:each) do
        @tom = Factory.create(:user,  :username => 'tom')
        @dick = Factory.create(:user,  :username => 'dick')
        @harry = Factory.create(:user,  :username => 'harry')
    end

    it "must create a new contact requests for a user" do
      @tom.get_contacts.count.should equal(0)
      @tom.get_pending_request_contacts.count.should equal(0)

      @dick.new_contact_request(@tom.id)
      @harry.new_contact_request(@tom.id)
      @tom.get_pending_request_contacts.count.should equal(2)
      @tom.get_contacts.count.should equal(0)

      @dick.get_raised_contact_requests_raised.count.should equal(1)

      @tom.accept_a_contact_request(@dick.id)
      @dick.get_raised_contact_requests_raised.count.should equal(0)

      @tom.get_pending_request_contacts.count.should equal(1)
      @tom.get_contacts.count.should equal(1)

      @tom.reject_a_contact_request(@harry.id)
      @tom.get_pending_request_contacts.count.should equal(0)

      @tom.get_contacts.count.should equal(1)
      @dick.get_contacts.count.should equal(1)
      @tom.disconnect_a_contact(@dick.id)

      @tom.disconnect_a_contact(100000)


      @tom.get_contacts.count.should equal(0)
      @dick.get_raised_contact_requests_raised.count.should equal(0)
      @dick.get_contacts.count.should equal(0)

    end

  end

  describe "change full name when profile name is changed" do
    before(:each) do
      @a_user = Factory.create(:user)
      @a_user.profile = Factory.create(:profile,
                                         :user_id => @a_user.id,
                                         :email => @a_user.email)

    end

    it "must have full name from profile"   do
      name_from_profile=@a_user.profile.first_name + " " +  @a_user.profile.last_name
      b_user=User.all(:conditions => ["id = ?" , @a_user.id]).first
      b_user.full_name.should eq(name_from_profile)
    end

    it "must have full name from profile on change"   do
      @a_user.profile.first_name="InterestingNewName"
      @a_user.profile.save
      name_from_profile=@a_user.profile.first_name + " " +  @a_user.profile.last_name
      b_user=User.all(:conditions => ["id = ?" , @a_user.id]).first
      b_user.full_name.should eq(name_from_profile)
    end
  end

  describe "destroy user and dependencies" do

  end



  
  
  
end
1