require 'spec_helper'

describe EntityDocument do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: entity_documents
#
#  id                     :integer         not null, primary key
#  entity_id              :integer         not null
#  entity_doc_name        :text            not null
#  entity_doc_mid         :text            not null
#  entity_doc_description :text
#  entity_doc_photo_url   :text
#  entity_doc_wiki_url    :text
#  created_at             :datetime
#  updated_at             :datetime
#

