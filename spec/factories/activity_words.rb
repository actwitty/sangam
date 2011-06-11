# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :activity_word do |f|
  f.sequence(:word_name) {|n|"word #{n}"}
end