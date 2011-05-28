class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.integer :owner_id , :null => false
      t.string :document_name, :null => false
      t.string :document_type, :null => false
      t.string :document_url,  :null => false

      t.timestamps
    end

    add_index :documents, [:owner_id, :document_name, :document_type], :name => "index_docs_on_owner_name_type"
    add_index :documents, [:document_name, :document_type], :name => "index_docs_on_name_type"
    add_index :documents, :document_type
    add_index :documents, :document_url
  end

  def self.down

    remove_index :documents, :name => "index_docs_on_owner_name_type"
    remove_index :documents, :name => "index_docs_on_name_type"
    remove_index :documents, :document_type
    remove_index :documents, :document_url

    drop_table :documents
  end
end
