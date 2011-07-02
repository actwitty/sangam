# == Schema Information
# Schema version: 20110616040229
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

class Contact < ActiveRecord::Base


  belongs_to :user
  belongs_to :friend, :class_name => 'User'
  belongs_to :loop

  # validate presence of foreign keys
    #validate uniqueness of join
  validates_uniqueness_of :friend_id, :scope => :user_id

  validates :loop, :existence =>  { :allow_nil => true }
  validates :user, :existence => true
  validates :friend, :existence => true

  validates_length_of :relation, :maximum => 64
 # validates_format_of :strength, :with => /^[0-9]+\.[0-9]{4}$/, :allow_blank => true
  validates_inclusion_of :strength,  :in => -255.00..255.00, :allow_nil => true

  validates_inclusion_of :status, :in => 1..6


  validate :is_contact_created_for_self


  @statusKeyToString = {
                  1 => 'New',
                  2 => 'Accept',
                  3 => 'Reject',
                  4 => 'Unconnect',
                  5 => 'Connected',
                  6 => 'Follow'
                }
  @statusStringToKey = {
                          'New' => 1,
                          'Accept'  => 2,
                          'Reject'  => 3,
                          'Unconnect' => 4,
                          'Connected'  => 5,
                          'Follow'  => 6,

                  }


    class << self
      attr_accessor :statusKeyToString
      attr_accessor :statusStringToKey
    end




  def self.follow(user_id, friend_id)
    contact = Contact.find_by_user_id_and_friend_id(user_id, friend_id)

    if contact.nil?
      begin
        contact = Contact.new(:user_id =>user_id,
                              :friend_id =>friend_id,
                              :status => Contact.statusStringToKey['Follow'])

        contact.save!
      rescue ActiveRecord::RecordInvalid => detail
        puts detail
        return false
      end

    end

    return true
  end

   def self.unfollow(user_id, friend_id)
    begin
      Contact.destroy_all(:user_id => user_id,
                            :friend_id => friend_id)
    rescue ActiveRecord::RecordInvalid => detail
          puts detail
          return false
    end
    return true

   end





  def is_contact_created_for_self
    if user_id == friend_id
      errors[:base] << 'Attempt to create a join to self failed.'
    end

  end



  def self.request_new(user_id, friend_id)
        contact_from_friend = Contact.find_by_user_id_and_friend_id(
                                                      friend_id, user_id)
        contact = Contact.new(:user_id=>user_id,
                              :friend_id=>friend_id,
                              :status => Contact.statusStringToKey['New'])
        unless contact_from_friend.nil?
          contact_from_friend.status = Contact.statusStringToKey['Connected']
          contact_from_friend.save!
          contact.status = Contact.statusStringToKey['Connected']
        end

        contact.save!
        return true

  end


  def self.accept_new(user_id, friend_id)
        contact_from_friend = Contact.find_by_user_id_and_friend_id(
                                                      friend_id, user_id)
        unless contact_from_friend.nil?

            contact_from_friend.status = Contact.statusStringToKey['Connected']
            contact_from_friend.save!
            contact=Contact.create(:user_id =>user_id,
                                   :friend_id =>friend_id,
                                   :status => Contact.statusStringToKey['Connected'])
        end

  end

  def self.reject_new(user_id,friend_id)
       Contact.destroy_all(:user_id => friend_id, :friend_id => user_id)
  end

  def self.delete_contacts_from_both_ends(user_id,friend_id)

    #remove the record requested from the friend irrespective of state
    Contact.destroy_all(:user_id => user_id , :friend_id => friend_id)

    Contact.destroy_all(:friend_id => user_id , :user_id => friend_id)


  end





end
