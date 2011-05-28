class CreateWordForms < ActiveRecord::Migration
  def self.up
    create_table :word_forms do |t|

      t.integer :activity_dict, :null => false
      t.integer :word_form_type,:null => false
      t.string :word_form_name, :null =>  false

      t.timestamps
    end
    add_index   :word_forms, [:activity_dict,:word_form_type, :word_form_name],
                             :name => "index_on_word_forms_dict_type_name"
    add_index   :word_forms, [:word_form_type, :word_form_name],
                             :name => "index_on_word_forms_type_name"
    add_index   :word_forms, :word_form_name
  end

  def self.down

    remove_index   :word_forms, "index_on_word_forms_dict_type_name"
    remove_index   :word_forms, "index_on_word_forms_type_name"
    remove_index   :word_forms, :word_form_name

    remove_table :word_forms
  end
end
