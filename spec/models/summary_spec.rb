require 'spec_helper'

describe Summary do
  pending "add some examples to (or delete) #{__FILE__}"
end













# == Schema Information
#
# Table name: summaries
#
#  id                 :integer         not null, primary key
#  user_id            :integer         not null
#  activity_word_id   :integer         not null
#  activity_name      :text            not null
#  activities_count   :integer         default(0)
#  category_id        :text
#  category_type      :text
#  analytics_snapshot :text
#  created_at         :datetime
#  updated_at         :datetime
#

