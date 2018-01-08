$(function(){
    //Add event listeners on page load
    newCommentSubmit();
})

function newCommentSubmit(){
    $("#js-listing-new-comment").click(function (event) {
        event.preventDefault();
    })
}
