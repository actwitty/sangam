class CreateEntityTypes < ActiveRecord::Migration
  def self.up
    create_table :entity_types do |t|

      t.integer :entity_id,  :null => false
      t.string  :entity_type_uri
      t.string  :entity_type_name,  :null => false

      t.timestamps
    end

    add_index :entity_types, :entity_id

    add_index :entity_types, :entity_type_uri
    add_index :entity_types, :entity_type_name
  end

  def self.down
    drop_table :entity_types
  end
end
