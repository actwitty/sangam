Factory.define :loop do |l|
  l.sequence(:name) { |n| "LemonyLoop#{n}" }
end