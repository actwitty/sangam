require 'spec_helper'

describe WordForm do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: word_forms
#
#  id               :integer         not null, primary key
#  activity_word_id :integer         not null
#  related_word_id  :integer         not null
#  relation_type    :text            not null
#  word_form_name   :text            not null
#  created_at       :datetime
#  updated_at       :datetime
#

