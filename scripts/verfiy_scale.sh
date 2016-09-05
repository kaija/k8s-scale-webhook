#!/bin/sh
echo "scale nginx-test-rc up"
curl -X POST -d 'rc=nginx-test-rc' -d 'ns=default' -d 'min=2' -d 'max=5' -d 'scale=up' http://localhost:8080/webhooks/verify | python -mjson.tool
sleep 60
echo "scale nginx-test-rc down"
curl -X POST -d 'rc=nginx-test-rc' -d 'ns=default' -d 'min=2' -d 'max=5' -d 'scale=down' http://localhost:8080/webhooks/verify | python -mjson.tool
