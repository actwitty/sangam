def get_fn_name
 puts caller[0][/`([^']*?)'/,1]
end
