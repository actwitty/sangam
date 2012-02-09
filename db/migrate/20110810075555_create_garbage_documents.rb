class CreateGarbageDocuments < ActiveRecord::Migration
  def self.up
    create_table :garbage_documents do |t|

      t.text    :table_name, :null => false

      t.text    :url,         :null => false

      t.integer :action,      :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :garbage_documents
  end
end
