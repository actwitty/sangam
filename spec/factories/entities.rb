# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :entity do |f|
  f.sequence(:entity_guid) {|n|"/m/234#{n}" }
  f.sequence(:entity_name) {|n|"Entity name #{n}" }
end