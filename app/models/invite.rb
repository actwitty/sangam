class Invite < ActiveRecord::Base
 
  validates_presence_of   :identifier, :service
  validates_uniqueness_of :identifier, :scope => :service
  class << self
    #############################################################################  
    def check_if_invite_exists(service, identifier)
      invite = Invite.find_by_identifier_and_service(identifier, service)
      if invite.nil?
        return false
      else
        return true
      end
    end
    #############################################################################  
    def create_new_invite(service, identifier, accepted, registered)
      invite = Invite.find_by_identifier_and_service(identifier, service)
      unless invite.nil?
        return false
      end
      invite = Invite.new(:service => service,
                        :identifier => identifier,
                        :accepted => accepted,
                        :registered => registered)
      invite.save!
    end
    #############################################################################
    def mark_invite_accepted(service, identifier)
      invite = Invite.find_by_identifier_and_service(identifier, service)

      if invite.nil?
        invite.accept = true
      end

      invite.save!
    end
    #############################################################################
    def mark_invite_registered(service, identifier)
      invite = Invite.find_by_identifier_and_service(identifier, service)
      if invite.nil?
        invite.accept = true
      end

      invite.save!
    end

  end
end
