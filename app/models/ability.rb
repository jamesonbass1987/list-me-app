class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Listing

    if user.present?
      can :manage, Listing, user_id: user.id
      can :manage, ListingImage, user_id: user.id
      can :create, Tag
      can :manage, User, id: user.id
      cannot :manage, Category

      if user.admin?
        can :manage, :all
      end
    end
  end
end