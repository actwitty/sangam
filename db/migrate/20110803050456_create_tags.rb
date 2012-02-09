class CreateTags < ActiveRecord::Migration
  def self.up
    create_table :tags do |t|

      t.integer  :author_id, :null => false
      t.integer  :activity_word_id, :null => false
      t.integer  :summary_id

      t.integer  :activity_id, :null => false
      t.text     :name, :null => false

      t.integer  :tag_type, :null => false   # 1= > mentioned tags like hash tags,
                                             #2 => added tags like added in blogs by user explicitly
                                             #3 => added by semantic sources like zemanta


      t.text     :source_name, :null => false    # "actwitty", "facebook", # "twitter",
                                                 # "G+", "DropBox", "Mobile +919980906102","a@b.com
      t.text    :source_msg_id              #id of message to which this document belongs .. at source like fb, t, g+ etc
      t.integer :status_at_source


      t.integer :status, :null => false     # 0 => saved, 1 => public share, 2 => private
                                            # 3 => shared to group of people or group.When this value is 3,
                                            # we need to see access_visibility table to see the access


      t.datetime :backup_created_timestamp, :default => Time.now.utc

      t.timestamps
    end

    add_index :tags, :author_id

    add_index :tags, :activity_word_id

    add_index :tags, :summary_id

    add_index :tags, :activity_id

    add_index :tags, :updated_at

    add_index :tags, :backup_created_timestamp
  end

  def self.down
    drop_table :tags
  end
end
