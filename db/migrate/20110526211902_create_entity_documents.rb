class CreateEntityDocuments < ActiveRecord::Migration

  #TODO need  to add more fields like urls of related enitiies etc
  def self.up
    create_table :entity_documents do |t|

      t.integer :entity_id, :null => false
      #entity_doc_name should be same enity_name in entity model
      t.text  :entity_doc_name, :null => false
      t.text  :entity_doc_mid, :null => false

      t.text   :entity_doc_description
      t.text  :entity_doc_photo_url
      t.text  :entity_doc_wiki_url

      t.timestamps
    end

    add_index  :entity_documents, :entity_id, :unique => true
    add_index  :entity_documents, :entity_doc_mid, :unique => true
    add_index  :entity_documents, :entity_doc_name

  end

  def self.down
    drop_table :entity_documents
  end
end
