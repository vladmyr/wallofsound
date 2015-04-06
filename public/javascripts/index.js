console.log("index.js");

angular.module("app", ["ngRoute"])
  .factory("AuthenticationFactory", function(){
    var credentials = {};
  })
  .factory("AudioStreamingFactory", function(){
    var player = new Player();
    var binaryClient;
    var byteLength = 0;

    var onAudioStreamData = function(){};
    var onAudioStreamEnd = function(){};
    var onAudioStreamCallback = function(stream, meta){
      var arrChunk = [];

      byteLength = 0;

      stream.on("data", function(chunk){
        arrChunk.push(chunk);
        byteLength += chunk.byteLength;

        if(typeof onAudioStreamData === "function"){
          onAudioStreamData(byteLength, chunk, arrChunk);
        }
      });
      stream.on("end", function(){
        player.setSource(new Blob(arrChunk));
        player.play();

        if(typeof onAudioStreamEnd === "function"){
          onAudioStreamData(byteLength, arrChunk);
        }
      });
    };

    function togglePlay(){
      player.isPlaying() ? player.pause() : player.play();
    }

    function init(){
      binaryClient = new BinaryClient("ws://localhost:3001");
      binaryClient.on("open", function(){
        //send token
        this.send({}, JSON.stringify({ event: 1 }));
        //this.close();
      });
      binaryClient.on("stream", function(data, meta){
        meta = JSON.parse(meta); //deserialize json
        switch(meta.event){
          case 0:
            onAudioStreamCallback(data, meta);
            break;
          case 1:
            console.log(meta);
            break;
        }
      });
      binaryClient.on("close", function(){
        console.log("connection closed");
      });
    }

    function getStream(id, onDataCallback, onEndCallback){
      onAudioStreamData = onDataCallback;
      onAudioStreamEnd = onEndCallback;

      binaryClient.send({}, JSON.stringify({
        event: 0,
        token: {
          userId: 1
        },
        trackId: id
      }));
      //binaryClient.on("stream", onAudioStreamCallback(data, meta));
    }

    return {
      init: init,
      getStream: getStream,
      togglePlay: togglePlay,
      byteLength: byteLength
    };
  })
  .factory("LibraryFactory", function($http){
    var library = [];
    var count = 0;

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
              library = data ? data.rows : [];
              count = data ? data.count : 0;
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
      },
      getCount: function(){
        return count;
      }
    }
  })
  .controller("HomeController", function($scope, AudioStreamingFactory){
    console.log("HomeController");
  })
  .controller("LibraryController", function($scope, LibraryFactory, AudioStreamingFactory){
    $scope.indexedLibrary = _.indexBy(LOCALS.library, "id");
    $scope.iconPlay = true;
    $scope.buffered = 0;
    $scope.elapsed = 0;
    $scope.count = 0;
    $scope.loadedPersents = 0;
    //$scope.audio = AudioStreamingFactory.getAudio;

    //$scope.getDuration = AudioStreamingFactory.getDuration;
    $scope.getTime = AudioStreamingFactory.getTime;
    $scope.togglePlay = AudioStreamingFactory.togglePlay;
    $scope.play = function(id){
      console.log("action play, id: ", id + ", size: " + $scope.indexedLibrary[id].fileSize);

      $scope.totalByteLength = $scope.indexedLibrary[id].fileSize;
      AudioStreamingFactory.getStream(id, function(byteLength){
        $scope.$apply(function(){
          $scope.loadedPersents = Math.floor(byteLength / $scope.totalByteLength * 100);
          console.log($scope.loadedPersents);
        });
      });
    }

    AudioStreamingFactory.init();
    //LibraryFactory.requestLibrary(function(data, status){
    //  if(status === 200){
    //    $scope.library = LibraryFactory.getLibrary();
    //    $scope.library[0].isFavourite = true;
    //    $scope.count = LibraryFactory.getCount();
    //    console.log("library", $scope.library);
    //    console.log("count", $scope.count);
    //    AudioStreamingFactory.init();
    //    //AudioStreamingFactory.getStream($scope.library[0].filePath);
    //  }
    //});
  });