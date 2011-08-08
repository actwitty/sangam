require 'spec_helper'

describe Tag do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: tags
#
#  id               :integer         not null, primary key
#  author_id        :integer         not null
#  activity_word_id :integer         not null
#  summary_id       :integer
#  activity_id      :integer         not null
#  name             :text            not null
#  tag_type         :integer         not null
#  source_name      :text            not null
#  location_id      :integer
#  status           :integer         not null
#  created_at       :datetime
#  updated_at       :datetime
#

