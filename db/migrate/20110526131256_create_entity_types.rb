class CreateEntityTypes < ActiveRecord::Migration
  def self.up
    create_table :entity_types do |t|

      t.integer :entity_id,  :null => false
      t.string  :entity_type_uri,  :null => false
      t.string  :entity_type_name,  :null => false

      t.timestamps
    end

    add_index :entity_types, [:entity_id,:entity_type_uri,:entity_type_name  ],
                            :name => "index_on_entity_type_entity_uri_name"

    add_index :entity_types, [:entity_type_uri, :entity_type_name], :name => "index_on_entity_type_uri_name"
    add_index :entity_types, :entity_type_name
  end

  def self.down

    remove_index :entity_types, "index_on_entity_type_entity_id_type"
    remove_index :entity_types, "index_on_entity_type_uri_name"
    remove_index :entity_types, :entity_type_name

    drop_table :entity_types
  end
end
