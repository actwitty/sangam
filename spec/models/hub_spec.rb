require 'spec_helper'

describe Hub do
  pending "add some examples to (or delete) #{__FILE__}"
end
















# == Schema Information
#
# Table name: hubs
#
#  id                       :integer         not null, primary key
#  activity_id              :integer         not null
#  activity_word_id         :integer         not null
#  entity_id                :integer
#  user_id                  :integer         not null
#  location_id              :integer
#  summary_id               :integer         not null
#  source_name              :text            not null
#  status                   :integer         not null
#  source_msg_id            :text
#  status_at_source         :integer
#  category_type            :text
#  backup_created_timestamp :datetime        default(2012-03-06 07:49:50 UTC)
#  created_at               :datetime        not null
#  updated_at               :datetime        not null
#

