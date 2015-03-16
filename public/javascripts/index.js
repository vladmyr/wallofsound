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

var app = angular.module("app", ["ngRoute", "angularFileUpload"]);
app.config(function($interpolateProvider){
    //configure delimiter in order not to collide with mustache
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
});
app.factory("FileUploadFactory", function ($http, FileUploader) {
//    var fileUploadRequest = {
//        method: "POST",
//        url: UrlMapping.API + FILE_UPLOAD
//    }
//    return {
//        sendFile: function (multi){

//        }
//    }
});
app.controller("FileUploadController", function ($scope, FileUploader) {
//    $scope.uploader = new FileUploader();
    $scope.a = "AngularJS";
    $scope.items = [
        { name: "name1", value: "value1" }, 
        { name: "name1", value: "value1" }
    ];

    $scope.uploader = new FileUploader({
        url: "/api/upload",
        headers:{
            "X-CSRF-TOKEN": "token"
        }
    });

    $scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    $scope.uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    $scope.uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    $scope.uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    $scope.uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    $scope.uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    $scope.uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };
});