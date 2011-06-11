class CreateWordForms < ActiveRecord::Migration
  def self.up
    create_table :word_forms do |t|

      t.integer :activity_word_id, :null => false
      t.integer :related_word_id, :null => false

      t.string  :relation_type, :null => false
      t.string  :word_form_name, :null =>  false

      t.timestamps
    end
    add_index   :word_forms, [:related_word_id,:relation_type, :word_form_name],
                             :name => "index_on_word_forms_relation_type_name", :unique => true
    add_index   :word_forms, [:relation_type, :word_form_name],
                             :name => "index_on_word_forms_type_name"
    add_index   :word_forms, :word_form_name
    add_index   :word_forms, :activity_word_id
  end

  def self.down

    remove_index   :word_forms, :name => "index_on_word_forms_relation_type_name"
    remove_index   :word_forms, :name => "index_on_word_forms_type_name"
    remove_index   :word_forms, :word_form_name
    remove_index   :word_forms, :activity_word_id

    drop_table :word_forms
  end
end
