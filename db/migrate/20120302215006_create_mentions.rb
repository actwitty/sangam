class CreateMentions < ActiveRecord::Migration
  def self.up
    create_table :mentions do |t|

      t.integer  :author_id

      t.integer  :summary_id

      t.integer  :activity_id

      t.text     :source_uid
      t.text     :name


      t.text     :source_name    # "actwitty", "facebook", # "twitter",
                                                 # "G+", "DropBox", "Mobile +919980906102","a@b.com
      t.text    :source_msg_id              #id of message to which this document belongs .. at source like fb, t, g+ etc
      t.integer :status_at_source


      t.integer :status

      t.datetime :source_created_at, :default => Time.now.utc

      t.timestamps
    end

    add_index :mentions, :author_id

    add_index :mentions, :summary_id

    add_index :mentions, :activity_id

    add_index :mentions, :updated_at

    add_index :mentions, :source_created_at
  end

  def self.down
    drop_table :mentions
  end
end
