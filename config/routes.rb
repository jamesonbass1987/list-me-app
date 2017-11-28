Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'welcome#index'
  post '/search' => 'welcome#search'

  get '/signup' => 'users#new'
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'


  get '/auth/facebook/callback' => 'sessions#create'
  resources :sessions, only: [:create, :destroy]

  resources :users
  resources :categories

  get '/locations/:id/listings/take_my_money' => 'listings#take_my_money'
  resources :locations, only: [:index, :show, :new, :create, :edit, :update, :destroy]
  resources :locations, only: [:show] do
    resources :listings do
      resources :comments, only: [:create, :update, :destroy, :edit]
    end
  end

end
