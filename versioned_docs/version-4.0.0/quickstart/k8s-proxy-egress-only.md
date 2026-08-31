---
id: k8s-proxy-egress-only
title: Connect a cluster without an ingress
sidebar_label: Connect without an ingress
description: Connect a Kubernetes cluster to Keploy over an outbound tunnel, so the Keploy Proxy needs no public URL, no LoadBalancer and no inbound firewall rule.
tags:
  - kubernetes
  - k8s proxy
  - tunnel
  - networking
  - enterprise
keywords:
  - keploy tunnel
  - egress only
  - no ingress
  - outbound connection
  - keploy.tunnel.enabled
  - operationalBaseUrl
  - connect cluster
---

# Connect a cluster without an ingress

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Dedicated" />

When you connect a Kubernetes cluster to Keploy, the dashboard has to be able to
reach the Keploy Proxy running inside it — to list Deployments, start and stop
recordings, stream logs, and drive replays.

There are two ways to make that possible, and you choose between them on the
**Connect Cluster** screen:

- **Keploy tunnel** — the proxy opens one outbound connection to Keploy and the
  dashboard reaches it back down that connection. Nothing has to be opened
  inbound. This is the default.
- **Ingress URL** — you publish the proxy at a URL, and the browser calls it
  directly.

This page covers the tunnel: when to pick it, what it does and does not carry,
and how to install a cluster that uses it. If you already have a public route to
the proxy, see [K8s Record Replay](./k8s-proxy.md), which uses the ingress path
throughout.

## Why the tunnel exists

The ingress path requires the Keploy Proxy to be reachable _from the internet_.
For many teams that is a non-starter: it means a public hostname, a TLS
certificate, and an inbound firewall rule into a cluster that is otherwise
closed. Some organizations cannot grant that at all.

The tunnel inverts the direction. The proxy dials **out** to Keploy over
ordinary HTTPS egress — the same direction it already sends heartbeats — and
then serves a fixed, explicitly allowlisted slice of its own API back over that
single connection.

```
  Ingress path (browser calls in)
  ┌──────────────┐        ┌───────────────────────────────────────────────┐
  │  Keploy UI   │        │  Your cluster                                 │
  │  (browser)   │───────▶│  Ingress / LoadBalancer ──▶ Keploy Proxy      │
  └──────────────┘        └───────────────────────────────────────────────┘
       inbound route required: public hostname, TLS cert, firewall rule


  Tunnel path (proxy dials out)
  ┌──────────────┐        ┌──────────────┐        ┌───────────────────────┐
  │  Keploy UI   │───────▶│  Keploy      │◀───────│  Keploy Proxy         │
  │  (browser)   │        │  api-server  │  dials │  (ClusterIP only)     │
  └──────────────┘        └──────────────┘  out   └───────────────────────┘
       no inbound route at all; the browser only ever talks to Keploy
```

The browser never talks to your cluster. It calls Keploy, and Keploy forwards
the request down the connection your proxy already opened.

## To choose between the tunnel and an ingress

|                                     | Keploy tunnel                                         | Ingress URL                                                    |
| ----------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Inbound route into the cluster      | Not needed                                            | Required (Ingress, Gateway, LoadBalancer or NodePort)          |
| Public hostname and TLS certificate | Not needed                                            | Required                                                       |
| What the network needs              | Outbound HTTPS to `https://api.keploy.io`             | An inbound rule reaching the proxy                             |
| Available for self-hosted installs  | **No** — see below                                    | Yes                                                            |
| Bulk downloads and log exports      | Yes, over a separate path (not over the tunnel)       | Yes                                                            |
| **API Docs** button on the cluster  | Disabled                                              | Enabled                                                        |
| Best for                            | Closed or regulated clusters, and most Cloud installs | Self-hosted, and Cloud installs that already publish the proxy |

Two rules decide most cases:

- **Self-hosted installs cannot use the tunnel.** A self-hosted deployment must
  not dial out to Keploy Cloud, so `selfHosted=true` and
  `keploy.tunnel.enabled=true` is refused — the Helm render fails and the proxy
  refuses the same combination at startup. The **Connect Cluster** form reflects
  this: choosing **Self-hosted** as the deployment type forces the connectivity
  choice to **Ingress URL** and disables the dropdown.
- **If you already have a working ingress, keep it.** The tunnel is additive, so
  you can enable both, but the dashboard **prefers the ingress URL for every
  operational call whenever one exists**. Only part of the proxy's surface is
  carried over the tunnel, so preferring the tunnel would break routes that work
  fine over an ingress you never stopped running.

## To connect a cluster over the tunnel

### 1. Add the cluster in the dashboard

In [app.keploy.io](https://app.keploy.io), go to **Integration Testing → Clusters**
and connect a new cluster.

### 2. Configure the cluster details

![Connect Cluster dialog with Keploy tunnel selected as the default](/img/k8s-proxy-connect-cluster-tunnel.png)

- **Cluster Name** — optional. Leave it blank and Keploy names the cluster for
  you; you can tell clusters apart by the name shown once the proxy connects.
- **How should Keploy reach this cluster?** — leave this on
  **Keploy tunnel — the agent dials out (no inbound access needed)**.

  With the tunnel selected, there is no **Ingress URL** field to fill in. It
  appears only when you pick **Ingress URL — I will expose the agent at a URL**.

- **Deployment Type** — leave this on **SaaS**. Choosing **Self-hosted** forces
  the ingress path, for the reason given above.

### 3. Run the Helm command

The dashboard generates the install command for you. On a tunnel cluster it
carries two flags that the ingress version does not:

```bash
helm upgrade --install k8s-proxy oci://docker.io/keploy/k8s-proxy-chart --version <version> \
  --namespace keploy \
  --create-namespace \
  --set keploy.accessKey="<access-key>" \
  --set keploy.clusterName="<cluster-name>" \
  --set selfHosted=false \
  --set keploy.ingressUrl="" \
  --set keploy.tunnel.enabled=true
```

- `keploy.tunnel.enabled=true` turns on the outbound connection.
- `keploy.ingressUrl=""` is emitted deliberately rather than omitted. `helm
upgrade` merges over a release's previous values, so passing it blank clears a
  stale ingress from an earlier install instead of silently inheriting it.

Copy the command from the dashboard rather than from this page — it embeds your
cluster's access key and the chart version to install.

Copy it from **this** dialog, though, the one shown right after you create the
cluster. The **Helm Command** button on the cluster's own page rebuilds the
command from the agent's last heartbeat, so on a cluster that has never
connected it cannot yet know the install was egress-only and leaves
`keploy.tunnel.enabled` out. `helm upgrade` does not merge previous values, so
running that command would install an agent with no route in either direction.
If you only have that version, add `--set keploy.tunnel.enabled=true` back
yourself. Once the agent has connected once, the button emits the flag
correctly.

### 4. Verify

```bash
kubectl get pods -n keploy
```

You do **not** need to port-forward the proxy, and you do not need to create an
Ingress or change the Service type. The cluster moves to **Active** once
heartbeats land, and the cluster's **Agent URL** card in the dashboard shows the
Keploy tunnel entry with the note _"Reached through the Keploy tunnel — this
agent dials out."_

<!-- TODO(screenshot): captured from a local rig, pending upload to the
     keploy-devrel S3 bucket then swap this comment for an <img> tag.
     Source: ~/workspace/kd-testing/docs-screenshots/06-egress-only-cluster-working.png
     (Agent URL card reading "Reached through the Keploy tunnel", Deployments
     loaded over the tunnel). Re-shoot on a real environment so the Agent URL
     reads https://api.keploy.io/cluster/<id>/proxy rather than a localhost rig. -->

From here, recording and replay work exactly as they do on an ingress cluster.
Continue with [K8s Record Replay](./k8s-proxy.md) from **Start Recording**.

## Helm values

Set these on the chart if you are managing values files yourself rather than
copying the dashboard's command.

| Value                         | Default | Description                                                                                                                                                                                                        |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `keploy.tunnel.enabled`       | `false` | Master switch. `false` means the proxy never dials out and the release behaves exactly as it does today.                                                                                                           |
| `keploy.tunnel.url`           | `""`    | Tunnel endpoint. Empty falls back to `keploy.apiServerUrl`, which is what a normal Cloud install wants. Set it only if your tunnel is fronted by a different hostname. Must be `https://`.                         |
| `keploy.tunnel.upgradeToken`  | `""`    | HTTP `Upgrade` protocol token. Empty uses the built-in `keploy-tunnel`. Change it only if Keploy support asks you to — both ends must agree.                                                                       |
| `keploy.tunnel.allowInsecure` | `false` | Permits an unencrypted `http://` tunnel URL. Leave it off. It exists for local development against a test acceptor, never against a real api-server.                                                               |
| `keploy.ingressUrl`           | `""`    | Optional. Empty is how an egress-only install declares it has no public URL. Set it whenever an external route _does_ exist — including one this chart did not render, such as your own Ingress or a mesh gateway. |

A minimal egress-only values file:

```yaml
selfHosted: false

service:
  type: ClusterIP

ingress:
  enabled: false
gateway:
  enabled: false

keploy:
  apiServerUrl: "https://api.keploy.io"
  ingressUrl: ""
  tunnel:
    enabled: true
```

## Network requirements

- **Outbound HTTPS** from the `keploy` namespace to `keploy.apiServerUrl`
  (`https://api.keploy.io` by default), or to `keploy.tunnel.url` if you set one.
  No inbound rule of any kind is needed.
- **Corporate egress proxies are supported.** The connection is an ordinary
  outbound HTTPS call, and `HTTPS_PROXY` and `NO_PROXY` are honoured.
- **Long-lived connections must be allowed.** The tunnel is one connection held
  open for its lifetime. A NetworkPolicy or egress proxy that kills long-idle
  outbound connections will show up as repeated reconnects in the proxy's logs.
- **If you front the tunnel with your own hostname** (`keploy.tunnel.url`), that
  edge must forward the `Connection` and `Upgrade` headers verbatim and allow
  long-idle connections — for `nginx`, `proxy_read_timeout 3600`. The connection is
  kept alive by HTTP/2 pings every 20 seconds, but a single request can
  legitimately block for minutes before its first byte.
- **One tunnel per proxy replica, capped at 16 per cluster.** Any replica can
  serve any request, so 16 is ample. Past `replicaCount: 16` the excess replicas
  retry on a backoff and log the refusal; they never displace a working tunnel.

## What the tunnel does and does not carry

The set of routes served over the tunnel is a fixed list compiled into the
proxy. It is **not configurable from the chart**, by design: a value that could
widen it to a whole path prefix would publish the proxy's two intentionally
unauthenticated in-cluster routes (`/mutate`, the admission webhook, and
`/dedup/bytecode`) to the internet. Widening it is a code change and a review.
The proxy logs the exact set it serves at startup under `exposed_routes`.

**Carried:** listing Deployments, starting and stopping recording and replay,
the ATG sandbox lifecycle, status and log streams, the CI shared-token exchange,
debug-bundle management, and the proxy restart/update/revert controls.

**Never carried — bulk downloads.** Log exports, test-asset downloads and debug
bundles are multi-hundred-megabyte bodies, and the tunnel is one connection
shared by every live status stream and log tail; a large transfer would stall
all of them. **These downloads still work on an egress-only cluster.** The proxy
sends the artifact to Keploy over ordinary egress instead, and your browser
downloads it from Keploy. You do not have to do anything differently — the
Download buttons behave the same.

**One thing that genuinely is unavailable:** the **API Docs** link on the cluster
header is disabled on an egress-only cluster. The proxy's OpenAPI browser is an
unauthenticated route, so it cannot be relayed through Keploy without publishing
it to the internet. The
[K8s Proxy API reference](../running-keploy/k8s-proxy-api.md) documents the same
surface.

## Combinations the chart refuses

Both of these fail the Helm render with a message naming the way out, rather
than installing a cluster that looks healthy and cannot work.

**`proxy.rbacMode="off"` with `keploy.tunnel.enabled=true`.** The tunnel exposes
`POST /get-shared-token`, and that route's permission checks are what
`rbacMode="off"` switches off — so anyone reaching the tunnel entry could mint
your cluster's machine token. Without an inbound route this was contained;
relaying the route to the internet changes that. Set `proxy.rbacMode` to
`"audit"` (the default) or `"enforce"`, or keep `"off"` and use an ingress.

**`recording.readOnly=true` with the tunnel on and no inbound route at all.**
`readOnly` forces auto-replay into runner mode, where an external
`replay-runner` outside the cluster polls the proxy's `/replay-jobs/*`
endpoints directly — and the tunnel does not carry those. That install would
record and never replay, silently. Either publish the proxy (and keep the tunnel
on for the browser if you like), set `recording.readOnly=false` if the cluster
can grant the write RBAC auto-replay needs, or turn the tunnel off.

## To migrate an existing cluster

Enabling the tunnel on a cluster that already has an ingress is safe and changes
nothing: the dashboard keeps preferring the ingress for every operational call.
That makes the tunnel the safe half of a two-step migration.

1. Add `--set keploy.tunnel.enabled=true` to your existing install and run
   `helm upgrade`. Confirm the cluster stays **Active**.
2. When you are ready to remove the public route, clear the ingress in the same
   command — `--set keploy.ingressUrl=''` — and tear down the Ingress or
   LoadBalancer. The dashboard falls back to the tunnel entry.

Rolling back is a `helm upgrade` in the other direction, not a migration.

## Troubleshooting

**"No route to this cluster's agent."** The proxy is sending heartbeats, but it
published no ingress URL and has no live tunnel — so there is nowhere to send
the request, and nothing was attempted. Give it one of the two routes: set
`keploy.ingressUrl`, or set `keploy.tunnel.enabled=true`, then re-run
`helm upgrade`.

![Cluster page showing the No route to this cluster's agent panel](/img/k8s-proxy-egress-no-route.png)

**"Agent busy — too many requests at once."** The cluster is connected and the
agent is healthy; every stream slot on its connection is in use. Close other
Keploy tabs holding live log tails or status streams, or scale the `k8s-proxy`
deployment up — each replica adds its own connection.

**The agent does not respond.** Check that the pods are running:

```bash
kubectl get pods -n keploy
```

Then check that the outbound connection is up. The proxy logs the dial and every
reconnect:

```bash
kubectl logs -n keploy deploy/keploy-k8s-proxy | grep -i tunnel
```

A cluster egress firewall or a proxy that blocks long-lived outbound
connections shows up here. The connection is re-established automatically after
an agent restart or a network blip, so a single failure is often worth one retry
before digging further.

Local-network permissions, agent TLS certificates and browser choice are not
involved on the tunnel path — your browser only ever talks to Keploy.
