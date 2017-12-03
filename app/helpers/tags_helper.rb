module TagsHelper

  def display_empty_tag_fields(tag_fields)
    if tag_fields.object.name.nil?
      tag_fields.text_field :name, :class => 'form-control', placeholder: 'Add Tag'
    end
  end

end
