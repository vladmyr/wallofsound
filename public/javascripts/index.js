console.log("index.js");

angular.module("app", ["ngRoute"])
  .factory("AuthenticationFactory", function(){
    var credentials = {};
  })
  .factory("WebAudioPlayerFactory", function(){
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var soundSource;
    var soundBuffer;

    var encodedBuffer;
    var activeBuffer = new Uint8Array(0);
    var arrChunk = [];

    var chunkIndex = 0;
    var totalChunksLoaded = 0;

    function init(){

    }

    function mergeChunks(chunk1, chunk2){
      var uint8Array = new Uint8Array(chunk1.length + chunk2.length);
      uint8Array.set(chunk1, 0);
      uint8Array.set(chunk2, chunk1.length);
      return uint8Array;
    }

    function loadChunk(chunk){
      if(totalChunksLoaded === 0){
        activeBuffer = chunk;
      }else{
        activeBuffer = mergeChunks(activeBuffer, chunk);
      }

      audioContext.decodeAudioData(activeBuffer.buffer, function(buffer){
        soundBuffer = buffer;
        play();
        console.log("chunk decoded");
      });

      totalChunksLoaded++;
    }

    function play(){

    }

    function stop(){

    }

    function pause(){

    }

    return {
      setSoundBuffer: function(stream){

      },
      addSoundBufferChunk: function(chunk){
        loadChunk(chunk);

      },
      play: function(){

      }
    }
  })
  .factory("AudioStreamingFactory", function(WebAudioPlayerFactory){

    return {
      getStream: function(path){
      }
    };
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
  })
  .controller("LibraryController", function($scope, LibraryFactory, AudioStreamingFactory){
    $scope.library = [];

    LibraryFactory.requestLibrary(function(data, status){
      if(status === 200){
        $scope.library = data;
        console.log("library", data);
      }
      //for commit local/#1 02
    });
  });