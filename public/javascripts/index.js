console.log("index.js");

//#1
//function fnShowUsrHover() {
//    console.log("hover action");
//}

//$(document).on("mouseenter", ".user", fnShowUsrHover);

//$(document).ready(function () {
//    var counter = 0;
//    var addDynamicUser = setInterval(function () {
//        $(".user-container").append(
//            $("<div></div>").addClass("user")
//            .css("background-color", "#ccc")
//            .css("margin-bottom", "4px")
//            .css("width", "100px")
//            .css("height", "20px"));
//        counter++;
//        if (counter > 9) {
//            clearTimeout(addDynamicUser);
//        }
//    }, 500);
//})

//#2
//function makeAMessenger(madness, sparta) {
//    madness.call(sparta);
//}

//function initiateMadness() {
//    var sparta = {
//        name : "Sparta"
//    };
    
//    function madness() {
//        alert("THIS. IS. " + this.name.toUpperCase() + ".");
//    }
    
//    document.onclick = makeAMessenger(madness, sparta);
//}

//initiateMadness();

//#3
//function handleScroll() {
//    console.log("run after scroll end for 200 ms");
//}

//$(window).scroll(function() {
//    clearTimeout($.data(this, "scrollTimer"));
//    $.data(this, "scrollTimer", setTimeout(handleScroll, 200));
//});

var app = angular.module("app", []);
app.controller("LibraryController", function ($scope) {

});