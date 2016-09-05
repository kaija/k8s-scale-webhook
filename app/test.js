var k8s_api_host = process.env.k8s_api_host;
var k8s_api_token = process.env.k8s_api_token;
const K8Api = require('kubernetes-client');
const k8 = new K8Api({
  url: 'http://my-k8-api-server.com',
  version: 'v1beta1',  // Defaults to 'v1'
  namespace: 'my-project' // Defaults to 'default'
});

function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}

k8.namespaces.replicationcontrollers.get('http-rc', print);
