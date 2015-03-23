console.log("index.js");

angular.module("app", ["ngRoute"])
  .factory("AudioStreamingFactory", function(){
    var socket = io.connect("http://localhost:3000");
    socket.on("hello", function(data){
      console.log(data);
    });
    return socket;
  })
  .factory("LibraryFactory", function($http){
    var library = [];

    return {
      requestLibrary: function(callback){
        var request = {
          method: "GET",
          url: "/api/v1/library/list"
        };

        callback = (typeof callback === "function" ? callback: function(){});

        $http(request)
          .success(function(data, status){
            if(status === 200){
              library = data ? data : [];
            }
            callback(data, status);
          })
          .error(function(error){
            console.error(error);
            library = [];
          })
      },
      getLibrary: function(){
        return library;
      }
    }
  })
  .controller("HomeController", function($scope, AudioStreamingFactory){
    console.log("HomeController");
    AudioStreamingFactory;
  })
  .controller("LibraryController", function($scope, LibraryFactory){
    $scope.library = [];
    $scope.binaryClient = new BinaryClient("ws://localhost:3000/stream");

    console.log("binaryClient", $scope.binaryClient);

    LibraryFactory.requestLibrary(function(data, status){
      if(status === 200){
        $scope.library = data;
      }
    });
  });