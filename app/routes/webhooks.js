var express = require('express');
var router = express.Router();

//Retrive environment variable
var k8s_api_host = process.env.KUBERNETES_SERVICE_HOST;
var k8s_api_token = process.env.KUBERNETES_API_TOKEN;
var k8s_api_user = process.env.k8s_api_user;
var k8s_api_pass = process.env.k8s_api_pass;
var k8s_namespace = process.env.k8s_namespace;

//Ignore Kubernetes API TLS unauthroized
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var k8s_auth = {};
if(k8s_api_token) {
  k8s_auth['bearer'] = k8s_api_token;
}else if(k8s_api_user && k8s_api_pass){
  k8s_auth['user'] = k8s_api_user;
  k8s_auth['pass'] = k8s_api_pass;
}
if(!k8s_namespace){
  k8s_namespace = 'default';
}

const K8SApi = require('kubernetes-client');
const k8s = new K8SApi({
  url: 'https://' + k8s_api_host,
  version: 'v1',
  auth: k8s_auth
});
/* test k8s api
function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}
k8s.ns.rc.get('ats', print);

k8s.namespaces.replicationcontrollers.patch({
  name: 'ats',
  body: { spec: { replicas: 3 } }
}, function(err, result){
  console.log(err);
  console.log(result);
});
*/

function scale(msg, cb) {
  var rc = msg.rc;
  var ns = msg.ns;
  var min = msg.min || 2;
  var max = msg.max || 10;
  var scale = msg.scale;
  if(scale != 'up' && scale != 'down') {
    cb("scale message incorrect", null);
    return;
  }
  k8s.ns(ns).rc.get(rc, function(err, data){
    if(err){
      cb("not able to retrive data from kubernetes", null);
      return;
    }else{
      var replica = data.spec.replicas;
      if (scale == 'up') {
        replica ++;
        k8s.ns(ns).rc.patch({
          name: rc,
          body: { spec: { replicas: replica } }
        }, function(err, data){
          cb(null, "scale up");
          return;
        });
      } else if(scale == 'down'){
        replica --;
        if (replica < min) {
          replica = min;
        }
        k8s.ns(ns).rc.patch({
          name: rc,
          body: { spec: { replicas: replica } }
        }, function(err, data){
          cb(null, "scale down");
          res.send(data);
        });
      }else{
        cb("this case should not happen", null);
        return;
      }
    }
  });
}

router.all('/prom', function(req, res, next) {
  var aggregate = [];
  console.log(req.body);
  message = req.body;
  if (message.status == 'firing') {
    var msg = JSON.parse(message.commonAnnotations.description);
    console.log(msg);
    scale(msg, function(error, result){
      var body = {};
      body['error'] = error;
      body['result'] = result;
      res.send(body);
    });
  }else{
    // ignore resolved status
    res.send({});
  }
});

router.all('/verify', function(req, res, next) {
  scale(req.body, function(error, result){
    var body = {};
    body['error'] = error;
    body['result'] = result;
    res.send(body);
  });
});

module.exports = router;
