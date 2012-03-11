require 'spec_helper'

describe LocalAction do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: local_actions
#
#  id         :integer         not null, primary key
#  author_id  :integer
#  summary_id :integer
#  meta       :text            default("--- {}\n\n")
#  name       :text
#  created_at :datetime        not null
#  updated_at :datetime        not null
#

