require 'spec_helper'

describe Authentication do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
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

