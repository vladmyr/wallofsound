var gulp = require("gulp");
var lr = require("tiny-lr")();
var connectLivereload = require("connect-livereload");

gulp.task("start-server", function(){
  lr.listen(35729);
  var app = require("./bin/www");
  app.use(connectLivereload);
});

gulp.task("watch", function(){
  //gulp.watch("./**", ["livereload"]);
});

gulp.task("livereload", function(){
  //lr
  //gulp.src("./**").pipe(connect.reload());
});

gulp.task("default", ["watch", "livereload", "start-server"]);