  class CreateEntities < ActiveRecord::Migration
		def self.up
			create_table :entities do |t|

				t.string    :entity_name, :null => false

        #uniqe global uid
        t.string    :entity_guid, :null => false
        t.text      :entity_image

        t.text      :entity_doc

        t.text      :social_counters_array

        t.text      :analytics_summary
        t.string    :rank
        t.integer   :campaigns_count, :default => 0

				t.timestamps
      end

			  add_index :entities, :entity_guid, :unique => true
        add_index :entities, :entity_name
        add_index :entities, :updated_at
        add_index :entities, :rank

		end

		def self.down

			drop_table :entities
		end
	end
