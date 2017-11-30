# Specifications for the Rails Assessment

Specs:
- [x] Using Ruby on Rails for the project | Uses Rails Framework
- [x] Include at least one has_many relationship (x has_many y e.g. User has_many Recipes) | Models contain a variety of has_many relationships
- [x] Include at least one belongs_to relationship (x belongs_to y e.g. Post belongs_to User) | Models contain a variety of belongs_to relationships
- [x] Include at least one has_many through relationship (x has_many y through z e.g. Recipe has_many Items through Ingredients) | Listings have many comment statuses, through comments // Listings have many tags through listing tags
- [x] The "through" part of the has_many through includes at least one user submittable attribute (attribute_name e.g. ingredients.quantity) | Comments act as join table between listings and comment statuses
- [x] Include reasonable validations for simple model objects (list of model objects with validations e.g. User, Recipe, Ingredient, Item) | Validations are present across models
- [x] Include a class level ActiveRecord scope method (model object & class method name and URL to see the working feature e.g. User.most_recipes URL: /users/most_recipes) | Listing model has a class method to find highest price item, which in conjunction with the 'take_my_money' url brings users to the highest price item in that location
- [x] Include a nested form writing to an associated model using a custom attribute writer (form URL, model name e.g. /recipe/new, Item) | Listings have custom attribute writers for listing images and tags
- [x] Include signup (how e.g. Devise) | Signup via email and/or Facebook Oauth
- [x] Include login (how e.g. Devise) | Signup via email and/or Facebook Oauth
- [x] Include logout (how e.g. Devise) | Signup via email and/or Facebook Oauth
- [x] Include third party signup/login (how e.g. Devise/OmniAuth) | Signup via email and/or Facebook Oauth
- [x] Include nested resource show or index (URL e.g. users/2/recipes) | Location/:id/Listings
- [x] Include nested resource "new" form (URL e.g. recipes/1/ingredients) | New listings nested and attached to locations
- [x] Include form display of validation errors (form URL e.g. /recipes/new) | Validation errors are checked across all forms

Confirm:
- [x] The application is pretty DRY
- [x] Limited logic in controllers
- [x] Views use helper methods if appropriate
- [x] Views use partials if appropriate
