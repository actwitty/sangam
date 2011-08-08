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

      t.integer  :location_id

      t.integer :status, :null => false     # 0 => saved, 1 => public share, 2 => private
                                            # 3 => shared to group of people or group.When this value is 3,
                                            # we need to see access_visibility table to see the access

      t.timestamps
    end

    add_index :tags, [:author_id, :activity_word_id]

    add_index :tags, :activity_word_id

    add_index :tags, :activity_id
  end

  def self.down
    remove_index :tags, [:author_id, :activity_word_id]

    remove_index :tags, :activity_word_id

    remove_index :tags, :activity_id

    drop_table :tags
  end
end
