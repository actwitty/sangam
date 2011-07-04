class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.integer :owner_id , :null => false
      t.integer :activity_id
      t.integer :activity_word_id
      t.string :document_name, :null => false
      t.string :document_type
      t.string :document_data

      t.timestamps
    end

    add_index :documents, [:owner_id,:document_type]
    add_index :documents, :document_type
    add_index :documents, [:activity_word_id, :document_type]
    add_index :documents, :activity_id

  end

  def self.down

    remove_index :documents, [:owner_id,:document_type]
    remove_index :documents, :document_type
    remove_index :documents, [:activity_word_id, :document_type]
    remove_index :documents, :activity_id

    drop_table :documents
  end
end
