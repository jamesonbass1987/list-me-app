class ListingImagesController < ApplicationController

    def show
        @image = ListingImage.find_by(id: params[:id])
        if @image
            render json: @image
        else
            redirect_to root_path
        end
    end

end
