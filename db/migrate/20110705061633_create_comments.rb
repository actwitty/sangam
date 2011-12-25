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
      t.integer :summary_id

      t.timestamps
    end

    add_index :comments, :author_id

    add_index :comments, :activity_id

    add_index :comments, :father_id, :unique => true

    add_index :comments, :updated_at

    add_index :comments, :summary_id

    add_index :comments, :source_name

  end



  def self.down
    drop_table :comments
  end
end
