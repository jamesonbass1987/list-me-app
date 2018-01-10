module ApplicationHelper

  def form_errors_check(form_input)
    if form_input.errors.any?
      render partial: 'shared/error_messages', locals: {form_input: form_input}
    end
  end

  def page_classes
    if current_page?(root_path)
      "welcome_container img_responsive"
    else
      "container-fluid"
    end
  end

  def controller_js_include_tag
    javascript_include_tag "#{controller_name}", "data-turbolinks-track": "reload" if controller_name == 'listings'
  end

end
