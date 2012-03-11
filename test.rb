hash = {:topics => {}, :services => {}}
topics_hash = hash[:topics]
topics_hash = topics_hash.sort_by {|k,v| v[:posts][:counts][:total]}.reverse #returns array tuple [ [k,v], [k,v], [k,v]  ]

hash[:topics] = Hash[topics_hash]
puts hash if hash[:topics].size != 0
