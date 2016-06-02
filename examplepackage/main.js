
var Agent = require('./agent');

//inherit from Agent
function MainClass(){
  Agent.call(this);
}

var greeting = "";

MainClass.prototype = Object.create(Agent.prototype);
MainClass.prototype.constructor = MainClass;

MainClass.prototype.initialize = function(startMain){
    greeting = "World!";
    startMain();
}

MainClass.prototype.main = function(restartMain) {
    console.log("hello " + greeting);
    restartMain();
}

MainClass.prototype.terminate = function(stopExecution){
    console.log("See you " + greeting);
    stopExecution("");
}

function createAgentObject() {
  var obj = new MainClass();
  obj.configureInterval(true, 1000);
  return obj;
}

// Do not change basepath
var basePath = "/api";
