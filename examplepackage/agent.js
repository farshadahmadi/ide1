
function Agent() {
  this.main;
  this.initialize;
  this.terminate;
  this.timer = true;
  this.repeat = true;
  this.interval = 1000;
}

Agent.prototype.s = function() {
    this.createInterval(this.main, function(restartMainMessage){
        if(restartMainMessage){
            console.log(restartMainMessage);
        }
        if(this.timer) {
            this.s();
        } else {
            this.terminate(function(stopExecutionMessage){
                if(stopExecutionMessage){
                    console.log(stopExecutionMessage);
                }
            });
        }
    }.bind(this), this.interval);
}

Agent.prototype.createInterval = function(f, param, interval) {
    setTimeout( function() {f(param);}, interval );
}

Agent.prototype.configureInterval = function(repeat, interval) {
  this.repeat = repeat;
  this.interval = interval;
}

Agent.prototype.start = function() {
  this.initialize(function(startMainMessage){
      if(startMainMessage){
          console.log(startMainMessage);
      }
          this.timer = true;
          this.main(function(restartMainMessage){
              if(restartMainMessage){
                  console.log(restartMainMessage);
              }
              console.log("app-started-without-error");
              if(this.repeat) {
                  this.s();
              }
          }.bind(this));
      
  }.bind(this));
}

Agent.prototype.stop = function() {
    this.timer = false;
    if(!this.repeat) {
        this.terminate(function(stopExecutionMessage){
            if(stopExecutionMessage){
                console.log(stopExecutionMessage);
            }
        });
    }
}

module.exports = Agent;

