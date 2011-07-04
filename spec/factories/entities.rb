# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :entity do |f|
  f.sequence(:entity_guid) {|n|"/m/234#{n}" }
  f.sequence(:entity_name) {|n|"Entity name #{n}" }
  f.sequence(:entity_image) {|n|"http://freebase.com/#{n}" }
  f.sequence(:entity_doc) {|n|
                          {'guid'=>"23456_#{n}",
                            'name'=> "Entity name #{n}",
                            'mid' =>  "/m/234#{n}",
                            '/common/topic/alias'=> ["name_1#{n}", "name_2#{n}" "name_3#{n}"],
                            '/common/topic/image'=>[{'id'=>"http://google.com/images/1#{n}"}, {'id'=>"http://google.com/images/2#{n}"}],
                           'key'=> {'namespace'=> "/wikipedia/en_id#{n}",'value'=>"content #{n}"},
                           'type'=>[{'id'=>"/common/topic#{n}",'name'=>"Topic"},{'id'=>"/common/music#{n}",'name'=>"Music#{n}"} ]
                          }
                          }
end