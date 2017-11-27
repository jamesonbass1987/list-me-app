class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Listing

    if user.present?
      can :manage, Listing, user_id: user.id
      can :manage, ListingImage, user_id: user.id
      can :create, Tag
      can :manage, User, id: user.id
      cannot :index, User
      cannot :manage, Category
      can :manage, Comment, user_id: user.id
      can :manage, CommentStatus, user: user

      if user.admin?
        can :manage, :all
      end
    end
  end
end
