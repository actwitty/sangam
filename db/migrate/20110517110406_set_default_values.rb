class SetDefaultValues < ActiveRecord::Migration
  def self.up
     change_column :contacts, :strength,:decimal, :precision => 5, :scale => 2, :default => 100.00
     change_column :contacts, :relation, :string, :default => "Friend"
  end

  def self.down
    #not needed
    #raise ActiveRecord::IrreversibleMigration, "Can't remove the default"
  end
end
