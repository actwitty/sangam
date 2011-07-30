class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|

      t.integer :author_id, :null => false

      t.integer :activity_id

      t.integer :document_id

      t.integer :father_id, :null => false

      t.text    :text, :null =>false

      t.integer :status, :null => false                 # 0 => saved, 1 => public share, 2 => private
                                        # 3 => shared to group of people or group.When this value is 3,
                                        # we need to see access_visibility table to see the access


      t.text    :source_name, :null => false            #"actwitty", "facebook", # "twitter",
                                        # "G+", "DropBox", "Mobile +919980906102","a@b.com
      t.timestamps
    end

    add_index :comments, [:author_id,  :activity_id]

    add_index :comments, :activity_id

    add_index :comments, [:author_id,  :document_id]

    add_index :comments, :document_id

    add_index :comments, :father_id, :unique => true

    add_index :comments, :updated_at

    add_index :comments, [:status, :author_id ]

    add_index :comments, [:source_name, :author_id]

  end



  def self.down

    remove_index :comments, [ :author_id,  :activity_id]

    remove_index :comments, :activity_id

    remove_index :comments, [ :author_id,  :document_id]

    remove_index :comments, :document_id

    remove_index :comments, :father_id

    remove_index :comments, :updated_at

    remove_index :comments, [:status, :author_id ]

    remove_index :comments, [:source_name, :author_id]

    drop_table :comments

  end
end
