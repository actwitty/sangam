require 'spec_helper'

describe Contact do
  before(:each) do
    @owner = Factory.create(:user, :username => 'LemonyGuy')
    @friend = Factory.create(:user, :username => 'LemonGuy2')
    @contact = Factory.build(:contact,
                              :user_id => @owner.id,
                              :friend_id => @friend.id)
    @contact.request_new

  end

  describe "create friendship request" do
    it "must create a new friend request for the user" do
      @contact.should be_valid
      @owner.should be_valid
      @friend.should be_valid
      @contact.status.should  equal(Contact.statusStringToKey['New'])
    end


    it "must fail to repeat friend request" do
      lambda {
        contact = Factory.build(:contact,
                              :user_id => @owner.id,
                              :friend_id => @friend.id)
        contact.request_new
        contact.should_not be_valid
      }.should raise_error ActiveRecord::RecordInvalid
    end


    it "must fail to create friend request to unknown user" do
       lambda {
        contact = Factory.build(:contact,
                              :user_id => @owner.id,
                              :friend_id => -1000)
        contact.request_new
        contact.should_not be_valid
      }.should raise_error ActiveRecord::RecordInvalid

    end

     it "must fail to create friend request for no friend mentioned" do
       lambda {
        contact = Factory.build(:contact,
                              :user_id => @owner.id,
                              :friend_id => nil )
        contact.request_new
        contact.should_not be_valid
      }.should raise_error ActiveRecord::RecordInvalid
     end


     it "must fail to create friend request for no user mentioned" do
       lambda {
        contact = Factory.build(:contact,
                              :user_id => nil,
                              :friend_id => @friend.id )
        contact.request_new
        contact.should_not be_valid
      }.should raise_error ActiveRecord::RecordInvalid
    end


    it "must make a connect when both sides request" do
        contact = Factory.build(:contact,
                              :user_id => @friend.id,
                              :friend_id => @owner.id )
        contact.request_new
        contact.should be_valid
        contact.status.should equal(Contact.statusStringToKey['Connected'])
        contact_from_friend = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                      @owner.id, @friend.id])[0]

        contact_from_friend.should be_valid
        contact_from_friend.status.should equal(Contact.statusStringToKey['Connected'])

    end
  end



  describe "confirm friendship request" do
    before(:each) do
      @tom = Factory.create(:user, :username => 'tom')
      @dick = Factory.create(:user, :username => 'dick')
      @harry = Factory.create(:user, :username => 'harry')
    end
    it  "must confirm the connections" do

      contact1 = Factory.build(:contact,
                              :user_id => @tom.id,
                              :friend_id => @dick.id)

      contact1.request_new
      contact1.should be_valid
      contact1.status.should equal(Contact.statusStringToKey['New'])
      contact2 = Factory.build(:contact,
                              :user_id => @dick.id,
                              :friend_id => @tom.id)
      contact2.accept_new
      contact2.should be_valid
      contact2.status.should equal(Contact.statusStringToKey['Connected'])
      contact1 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                      @tom.id, @dick.id])[0]
      contact1.should be_valid
      contact1.status.should equal(Contact.statusStringToKey['Connected'])

    end


    it  "must reject the connections" do

      contact1 = Factory.build(:contact,
                             :user_id => @tom.id,
                              :friend_id => @dick.id)

      contact1.request_new

      contact1.should be_valid
      contact1.status.should equal(Contact.statusStringToKey['New'])
      contact2 = Factory.build(:contact,
                                  :user_id => @dick.id,
                                  :friend_id => @tom.id)

      contact2.reject_new

      contact1 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                      @tom.id, @dick.id])[0]
      contact1.should be_nil

      contact2 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                     @dick.id, @tom.id])[0]
      contact2.should be_nil
    end

    it  "must break the connections" do

      contact1 = Factory.build(:contact,
                             :user_id => @tom.id,
                             :friend_id => @harry.id)

      contact1.request_new

      contact1.should be_valid
      contact1.status.should equal(Contact.statusStringToKey['New'])
      contact2 = Factory.build(:contact,
                                  :user_id => @harry.id,
                                  :friend_id => @tom.id)

      contact2.accept_new

      contact1 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                      @tom.id, @harry.id])[0]
      contact1.should be_valid

      contact2 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                     @harry.id, @tom.id])[0]
      contact2.should be_valid

      contact2.delete_contacts_from_both_ends

      contact1 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                      @tom.id, @harry.id])[0]
      contact1.should be_nil

      contact2 = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                     @harry.id, @tom.id])[0]
      contact2.should be_nil
    end

  end

  describe "process friendship requests" do
    before(:each) do
      @tim = Factory.create(:user, :username => 'tim')
      @jim = Factory.create(:user, :username => 'jim')
      @him = Factory.create(:user, :username => 'him')
    end

    it 'list all new friends' do
      contact_tim_jim = Factory.build(:contact,
                                  :user => @tim,
                                  :friend => @jim)
      contact_tim_jim.request_new
      contact_him_jim = Factory.build(:contact,
                                      :user => @him,
                                      :friend => @jim)
      contact_him_jim.request_new

      user_id_list = @jim.friends.find(:all,
                                        :select => 'user_id',
                                        :conditions=> ["status = ?" , Contact.statusStringToKey['New']])
      user_id_list.count.should equal(2)


     users_list = User.find(:all,  :joins => :contacts, :conditions => { :contacts =>
                                                         {:status => Contact.statusStringToKey['New'],
                                                         :friend_id => @jim.id } })


    users_list.should =~ [@tim, @him]
    users_list.size.should equal([@tim, @him].size)

    contact_jim_tim = Factory.build(:contact,
                                  :user => @jim,
                                  :friend => @tim)


    contact_jim_tim.accept_new

    users_list = User.find(:all,  :joins => :contacts, :conditions => { :contacts =>
                                                         {:status => Contact.statusStringToKey['New'],
                                                         :friend_id => @jim.id } })


    users_list.should =~ [@him]
    users_list.size.should equal([@him].size)

    users_list = User.find(:all,  :joins => :contacts, :conditions => { :contacts =>
                                                         {:status => Contact.statusStringToKey['Connected'],
                                                         :friend_id => @jim.id } })


    users_list.should =~ [@tim]
    users_list.size.should equal([@tim].size)



    end
  end
end

# == Schema Information
#
# Table name: contacts
#
#  id         :integer         not null, primary key
#  status     :integer
#  user_id    :integer
#  friend_id  :integer
#  loop_id    :integer
#  strength   :decimal(5, 2)   default(100.0)
#  relation   :string(255)     default("Friend")
#  created_at :datetime
#  updated_at :datetime
#

