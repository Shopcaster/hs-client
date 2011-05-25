//depends: main.js

hs.loadScript = function(location){
  var script = document.createElement("script");
  script.src = location;
  document.body.appendChild(script);
}
