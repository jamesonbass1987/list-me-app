Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'welcome#index'
  post '/search' => 'welcome#search'

  get '/signup' => 'users#new'
  get '/login' => 'sessions#new'
  delete '/logout' => 'sessions#destroy'

  get '/auth/facebook/callback' => 'sessions#create'
  resources :sessions, only: [:create, :destroy]

  resources :users
  get 'users/:id/settings' => 'users#settings'

  resources :locations, only: [:show, :new, :create, :edit, :update, :destroy]
  resources :locations, only: [:show] do
    resources :listings
  end
end
