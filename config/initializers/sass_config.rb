require "sass"
Sass::Plugin.options[:template_location] = {
   "#{Rails.root}/app/stylesheets" => "#{Rails.root}/public/stylesheets"
}
Sass::Plugin.options[:line_comments] = false
Sass::Plugin.options[:style] = :nested
