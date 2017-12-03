module ApplicationHelper

  def form_errors_check(form_input)
    if form_input.errors.any?
      render partial: 'shared/error_messages', locals: {form_input: form_input}
    end
  end

end
