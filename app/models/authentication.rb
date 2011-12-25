# == Schema Information
# Schema version: 20110616040229
#
# Table name: authentications
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  provider   :string(255)
#  uid        :string(255)
#  salt       :string(255)
#  token      :string(255)
#  secret     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Authentication < ActiveRecord::Base
  belongs_to :user
  has_one :foreign_profile

  validates :uid, :provider, :presence => true
  validates_uniqueness_of :user_id, :scope => :provider, :allow_nil => true
  validates_uniqueness_of :uid, :scope => :provider
  before_save :make_salt

  attr_accessible :provider, :uid, :token, :secret, :user_id, :data_sync_status
  def make_salt
    self.salt = Digest::SHA1.hexdigest("--#{Time.now.utc}--#{uid}--")
  end

  def self.find_all_uids_present_in_actwitty(provider, uid_list)
     Authentication.all(:select => "uid", :conditions=>['uid in (?) and provider = ? and user_id is NOT NULL',
                        uid_list, provider]).map(&:uid)
  end

end
