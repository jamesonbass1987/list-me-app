// GLOBAL VARIABLE DECLARATIONS //
let locationListingHashes;
let locationListingIds;
let currentListingId;
let currentListingOwnerId;
let listingsPath;
let currentLocation = window.location.pathname.split('/')[2];;
let currentPath = window.location.pathname;
let currentListingFilter = "Everything";
let currentUser;

//MAIN PAGE LOAD FUNCTIONS

//Check for logged in user and fire appropriate load functions based on current view
$(function () {
    $(document).ready(function () {
        checkUser();
        if ($(".listings.index")[0]) {
            loadListingsIndex();
        } else if ($(".listings.show")[0]) {
            loadListingsShow();
        }
    })
})


//GLOBAL JS FUNCTIONS

//Check for current user, if so, set to global variable
function checkUser() {
    $.getJSON('/logged_in_user', { format: 'json' }, function (resp) {
        currentUser = resp;
    });
}