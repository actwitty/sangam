s = "{:users=>[{:uid=>\"972651\", :provider=>\"twitter\", :username=>\"mashable\", :full_name=>\"Pete Cashmore\", :authenticity_token=>\"GQaU1m3VHYv/myGcyr9kDEWtibjo0UjF1o02JZPABH0=\"}], :auth_key=>\"A1B2C3D4E5F6987654321ABCDEFGH\"}"

h = eval(s)
puts h
puts h.class
