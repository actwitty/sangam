class CreateGarbageDocuments < ActiveRecord::Migration
  def self.up
    create_table :garbage_documents do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :garbage_documents
  end
end
