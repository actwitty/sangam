class Invite < ActiveRecord::Base
 
  validates_presence_of   :identifier, :service
  validates_uniqueness_of :identifier, :scope => :service
  class << self
    #############################################################################  
    def check_if_invite_exists(query_hash)
      begin
        Rails.logger.info("[MODEL][Invite] check_if_invite_exists #{query_hash.inspect} ")


        query_string_arr = []
        query_string = ""
        query_string_arr << query_string

        query_hash.each_pair do |k,v|
          if query_string.length == 0
            query_string = query_string + " ( service IN (?) AND identifier IN (?) ) "
          else
            query_string = query_string + " OR ( service IN (?) AND identifier IN (?) ) "
          end

          query_string_arr += [k,v]
        end 

        query_string_arr[0] = query_string


        invite = Invite.find(:all, :conditions => query_string_arr).first
        if invite.nil?
          return false
        else
          Rails.logger.info("[MODEL][Invite] Invite already exists --> #{invite.inspect} ") 
          return true
        end
      rescue Exception => exc
        Rails.logger.error("[MODEL][Invite] Raised exception in checking invite #{exc.message}")
        return false
      end

    end
    #############################################################################  
    def create_new_invite(service, identifier, accepted, registered)
      begin
        invite = Invite.find_by_identifier_and_service(identifier, service)
        unless invite.nil?
          return false
        end
        invite = Invite.new(:service => service,
                        :identifier => identifier,
                        :accepted => accepted,
                        :registered => registered)
        invite.save!
        return true
      rescue Exception => exc
        Rails.logger.error("[MODEL][Invite] Raised exception in saving invite #{exc.message}")
        return false
      end
    end
    #############################################################################
    def mark_invite_accepted(service, identifier)
      begin
        invite = Invite.find_by_identifier_and_service(identifier, service)

        unless invite.nil?
          invite.accepted = true
          invite.save!
        end
      rescue Exception => exc
        Rails.logger.error("[MODEL][Invite] Raised exception in saving invite #{exc.message}")
      end

    end
    #############################################################################
    def mark_invite_registered(service, identifier)
      begin
        invite = Invite.find_by_identifier_and_service(identifier, service)
        unless invite.nil?
          invite.registered = true
          invite.save!
        end
      rescue Exception => exc
        Rails.logger.error("[MODEL][Invite] Raised exception in saving invite #{exc.message}")
      end
        

    end

  end
end


# == Schema Information
#
# Table name: invites
#
#  id         :integer         not null, primary key
#  identifier :string(255)
#  service    :string(255)
#  accepted   :boolean
#  registered :boolean
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

