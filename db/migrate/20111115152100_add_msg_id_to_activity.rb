class AddMsgIdToActivity < ActiveRecord::Migration
  def self.up
    add_column :activities, :source_msg_id, :string
    add_index :activities, :source_msg_id
  end

  def self.down
    remove_index :activities, :source_msg_id
    remove_column :activities, :source_msg_id
  end
end
