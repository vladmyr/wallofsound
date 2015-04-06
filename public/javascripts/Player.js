"use strict";

var Player = function(){
  var that = this;

  this.source = new Blob();
  this.audio = new Audio();
  this.audioDuration = 0;
  this.audioMeta = {};
  this.queue = [];
  this.queueIndex = 0;

  this.audio.addEventListener('loadedmetadata', function() {
    that.audioDuration = Math.round(that.audio.duration);
  });
}

Player.prototype.play = function(){
  this.audio.paused && this.audio.play();
}

Player.prototype.stop = function(){
  if(this.audio.duration && !this.audio.paused){
    this.audio.pause();
    this.audio.currentTime = 0.0;
  }
}

Player.prototype.pause = function(){
  !this.audio.paused && this.audio.pause();
}

Player.prototype.setFavourite = function(bool){

}

Player.prototype.getLyrics = function(){

}

Player.prototype.setSource = function(blob){
  this.pause();
  this.audio.src = (window.URL || window.webkitURL).createObjectURL(blob);
  this.audioDuration = 0;
}

//Player.prototype.getDuration = function(format){
//  if(this.audioDuration){
//    if(!format){
//      return this.audioDuration;
//    }else{
//      var hours = Math.floor(this.audioDuration / 3600);
//      var minutes = Math.floor((this.audioDuration - hours * 3600) / 60);
//      var seconds = ("00" + (this.audioDuration - hours * 3600 - minutes * 60)).slice(-2);
//      return hours > 0
//        ? hours + ":" + ("00" + minutes).slice(-2) + ":" + seconds
//        : minutes + ":" + seconds;
//    }
//  }
//}

Player.prototype.getElapsed = function(format){

}

Player.prototype.isPlaying = function(){
  return this.audio.duration ? !this.audio.paused : false;
}

Player.prototype.getQueue = function(){

}

Player.prototype.getVolume = function(){

}

//module.exports = Player;