require 'spec_helper'

describe Mention do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: mentions
#
#  id                       :integer         not null, primary key
#  author_id                :integer
#  summary_id               :integer
#  activity_id              :integer
#  source_uid               :text
#  name                     :text
#  source_name              :text
#  source_msg_id            :text
#  status_at_source         :integer
#  status                   :integer
#  backup_created_timestamp :datetime        default(2012-03-06 07:49:55 UTC)
#  created_at               :datetime        not null
#  updated_at               :datetime        not null
#

