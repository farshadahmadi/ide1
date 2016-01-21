liquidiot-devicelib
===================

JavaScript library for querying and interacting with LiquidIOT devices.


### Install (npm)

    npm install https://github.com/ahn/liquidiot-devicelib.git


### Example:

```javascript
var devicelib = require('liquidiot-devicelib');

devicelib.devices('*').http('/app');
```


### Bower + Browserify

    bower install https://github.com/ahn/liquidiot-devicelib.git

The bower version uses a `dist/devicelib.js` file which is runnable in the browser.
The file can be built with the`./build-browserify.sh` script (requires `browserify`).


