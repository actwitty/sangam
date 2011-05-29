# == Schema Information
# Schema version: 20110528065055
#
# Table name: contacts
#
#  id         :integer(4)      not null, primary key
#  status     :string(255)
#  pending    :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer(4)
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

  validates_inclusion_of :status, :in => 1..5


  validate :is_contact_created_for_self


  @statusKeyToString = {
                  1 => 'New',
                  2 => 'Accept',
                  3 => 'Reject',
                  4 => 'Unconnect',
                  5 => 'Connected'
                }
  @statusStringToKey = {
                          'New' => 1,
                          'Accept'  => 2,
                          'Reject'  => 3,
                          'Unconnect' => 4,
                          'Connected'  => 5,

                  }


    class << self
      attr_accessor :statusKeyToString
      attr_accessor :statusStringToKey
    end


  def is_contact_created_for_self
    if user_id == friend_id
      errors[:base] << 'Attempt to create a join to self failed.'
    end

  end


  def request_new
        self.status = Contact.statusStringToKey['New']

        contact_from_friend = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                      self.friend_id, self.user_id])[0]
        unless contact_from_friend.nil?
          contact_from_friend.status = Contact.statusStringToKey['Connected']
          contact_from_friend.save!
          self.status = Contact.statusStringToKey['Connected']
        end

        self.save!
        return true

  end


  def accept_new
        contact_from_friend = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                     self.friend_id, self.user_id])[0]
        unless contact_from_friend.nil?

            contact_from_friend.status = Contact.statusStringToKey['Connected']
            contact_from_friend.save!
            self.status = Contact.statusStringToKey['Connected']

        end
        self.save!
  end

  def reject_new

      contact_from_friend = Contact.all(:conditions => ['user_id = ? AND friend_id = ? ',
                                                     self.friend_id, self.user_id])[0]
      unless contact_from_friend.nil?
        contact_from_friend.destroy
      end
  end

  def delete_contacts_from_both_ends
    #remove the record requested from the friend irrespective of state
    Contact.destroy_all(:user_id => self.user_id , :friend_id => self.friend_id)

    Contact.destroy_all(:friend_id => self.user_id , :user_id => self.friend_id)

  end




end
