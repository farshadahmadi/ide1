#!/bin/bash

./kill_process_listening_to_port.sh 8081

PORT=8081 NODE_ENV=development npm start 2> logi-err.log > logi.log &
