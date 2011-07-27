require 'spec_helper'

describe Comment do
  pending "add some examples to (or delete) #{__FILE__}"
end



# == Schema Information
#
# Table name: comments
#
#  id          :integer         not null, primary key
#  author_id   :integer         not null
#  activity_id :integer
#  document_id :integer
#  father_id   :integer         not null
#  text        :text            not null
#  created_at  :datetime
#  updated_at  :datetime
#

