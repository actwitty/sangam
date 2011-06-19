class DateTimeInput < SimpleForm::Inputs::DateTimeInput
  def input
    "<div>#{super}</div>".html_safe
  end
end
