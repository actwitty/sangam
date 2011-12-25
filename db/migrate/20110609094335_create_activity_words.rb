class CreateActivityWords < ActiveRecord::Migration
  def self.up
    create_table :activity_words do |t|
      t.text :word_name, :null => false
      t.timestamps
    end
    add_index :activity_words, :word_name, :unique => true
    add_index :activity_words, :updated_at
  end

  def self.down
    drop_table :activity_words
  end
end
