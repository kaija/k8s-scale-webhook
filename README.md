# k8s-scale-webhook
Webhook for auto scale from prometheus alert.

This is an example webhook API to control kubernetes scale replicacontroller.
Please take care the webhook authentication to avoid abused from attach.





Prometheus alert rule example.

```erb
ALERT NGINX_LOAD_HIGH
  IF sum(rate(nginx_connections_processed_total[1m]) )  / ((count(nginx_connections_processed_total {stage="handled"}) -1 ) * 200) > 1
  FOR 1m
  LABELS { severity = "critical", service = "nginx", svc="nginx", pager="webhook" }
  ANNOTATIONS {
    summary = "nginx load high",
    description = "{\"rc\":\"nginx-test-rc\", \"ns\":\"default\", \"min\":2, \"max\":10, \"scale\":\"up\"}",
  }

ALERT NGINX_LOAD_LOW
  IF sum(rate(nginx_connections_processed_total[1m]) )  / ((count(nginx_connections_processed_total {stage="handled"}) -1 ) * 200) < 0.005
  FOR 1m
  LABELS { severity = "critical", service = "nginx", svc="nginx", pager="webhook" }
  ANNOTATIONS {
    summary = "nginx load high",
    description = "{\"rc\":\"nginx-test-rc\", \"ns\":\"default\", \"min\":2, \"max\":10, \"scale\":\"down\"}",
  }

```

Alertmanager

Add the webhook receiver in alertmanager setting

```yaml
  routes:
     ...
  - match:
      pager: webhook
    receiver: webhook-k8s



receivers:
- name: "webhook-k8s"
  webhook_configs:
  - url: 'http://k8s-webhook-svc/webhooks/prom'
    send_resolved: true
```

Ref: 

Kubernetes secret
http://kubernetes.io/docs/user-guide/secrets/
