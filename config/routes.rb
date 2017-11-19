Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'static#index'

  resources :users

  resources :locations, only: [:index, :show, :new, :create, :edit, :update, :destroy]
  resources :locations, only: [:show] do
    resources :listings, only: [:index, :show]
  end
end
