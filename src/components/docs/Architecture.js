import React from "react";

/*
 * <Architecture />: where each part of Keploy's integration testing runs and
 * how data moves between them. The numbered flows match the list the page
 * puts under the diagram. Colours come from the theme tokens, so it follows
 * light and dark mode. Below 720px a stacked layout replaces the drawing.
 *
 * Facts it encodes (k8s-proxy chart): the node agent DaemonSet and the
 * auto-replay pods run in the release namespace (`keploy`); the sidecar
 * agent runs in the app's pod.
 */

const LINE = 21;

function Box({x, y, w, h, title, lines = [], kind = "node"}) {
  const cx = x + w / 2;
  const block = 18 + lines.length * LINE;
  const top = y + (h - block) / 2 + 15;
  return (
    <g className={`kd-arch__${kind}`}>
      <rect x={x} y={y} width={w} height={h} rx="10" />
      <text x={cx} y={top} className="kd-arch__title" textAnchor="middle">
        {title}
      </text>
      {lines.map((l, i) => (
        <text
          key={l}
          x={cx}
          y={top + 24 + i * LINE}
          className="kd-arch__sub"
          textAnchor="middle"
        >
          {l}
        </text>
      ))}
    </g>
  );
}

function Zone({x, y, w, h, label, kind = "zone"}) {
  return (
    <g className={`kd-arch__${kind}`}>
      <rect x={x} y={y} width={w} height={h} rx="14" />
      <text x={x + 16} y={y + 25} className="kd-arch__label">
        {label}
      </text>
    </g>
  );
}

function Flow({d, n, at}) {
  return (
    <g className="kd-arch__flow">
      <path d={d} markerEnd="url(#kd-arch-arrow)" />
      <circle cx={at[0]} cy={at[1]} r="13" />
      <text x={at[0]} y={at[1] + 5} textAnchor="middle">
        {n}
      </text>
    </g>
  );
}

export function Architecture() {
  return (
    <div className="kd-arch">
      <svg
        className="kd-arch__wide"
        viewBox="0 0 840 620"
        role="img"
        aria-labelledby="kd-arch-t kd-arch-d"
      >
        <title id="kd-arch-t">How Keploy is built</title>
        <desc id="kd-arch-d">
          In your Kubernetes cluster, a Keploy agent in your service&apos;s pod,
          or a node agent in the keploy namespace, captures traffic for
          k8s-proxy. k8s-proxy keeps the tests and mocks in sync with Keploy
          Cloud and runs auto-replay pods. Your CI runner replays the tests
          against each pull request&apos;s image and reports to Keploy Cloud.
        </desc>
        <defs>
          <marker
            id="kd-arch-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="kd-arch__head" />
          </marker>
        </defs>

        <Zone x={8} y={8} w={504} h={604} label="Your Kubernetes cluster" />

        <Zone
          x={24}
          y={46}
          w={472}
          h={150}
          label="Your app's namespace"
          kind="inner"
        />
        <Zone x={40} y={80} w={440} h={104} label="Pod" kind="pod" />
        <Box
          x={56}
          y={110}
          w={196}
          h={60}
          title="Your service"
          lines={["unchanged"]}
        />
        <Box
          x={268}
          y={110}
          w={196}
          h={60}
          title="Keploy agent"
          lines={["sidecar mode"]}
          kind="keploy"
        />

        <Zone
          x={24}
          y={228}
          w={472}
          h={368}
          label="Namespace: keploy"
          kind="inner"
        />
        <Box
          x={40}
          y={266}
          w={212}
          h={150}
          title="Node agent"
          lines={["DaemonSet mode", "eBPF on each node"]}
          kind="keploy"
        />
        <Box
          x={268}
          y={266}
          w={212}
          h={150}
          title="k8s-proxy"
          lines={[
            "installed with Helm",
            "starts recordings",
            "keeps tests and mocks",
          ]}
          kind="keploy"
        />
        <Box
          x={40}
          y={446}
          w={440}
          h={134}
          title="Auto-replay pods"
          lines={["your service + mocks", "learns noise, flags unstable tests"]}
        />

        <Zone x={540} y={8} w={292} h={276} label="Keploy Cloud" kind="cloud" />
        <Box x={556} y={44} w={260} h={54} title="Keploy Console" />
        <Box x={556} y={110} w={260} h={54} title="Tests, mocks and reports" />
        <Box
          x={556}
          y={176}
          w={260}
          h={92}
          title="Keploy branches"
          lines={["and reviews"]}
        />

        <Zone x={540} y={332} w={292} h={280} label="Your CI runner" />
        <Box
          x={556}
          y={368}
          w={260}
          h={100}
          title="keploy cloud replay"
          lines={["pull request's image", "+ mocks"]}
          kind="keploy"
        />
        <Box
          x={556}
          y={490}
          w={260}
          h={106}
          title="Pull request check"
          lines={["pass, wait for review,", "or fail"]}
        />

        {/* 1: captured traffic to k8s-proxy, from the sidecar agent... */}
        <Flow d="M366 170 V264" n="1" at={[366, 212]} />
        {/* ...or from the node agent, which watches the pod with eBPF */}
        <path className="kd-arch__plain kd-arch__dashed" d="M226 266 V184" />
        <path
          className="kd-arch__plain"
          d="M252 341 H266"
          markerEnd="url(#kd-arch-arrow)"
        />
        {/* 2: k8s-proxy and Keploy Cloud */}
        <Flow d="M480 310 H526 V137 H554" n="2" at={[526, 222]} />
        {/* 3: auto-replay */}
        <Flow d="M374 416 V444" n="3" at={[400, 430]} />
        {/* 4: CI replay and Keploy Cloud */}
        <Flow d="M686 366 V270" n="4" at={[686, 308]} />
        {/* CI result to the pull request */}
        <path
          className="kd-arch__plain"
          d="M686 468 V488"
          markerEnd="url(#kd-arch-arrow)"
        />
      </svg>

      <ol className="kd-arch__stack">
        <li className="kd-arch__card">
          <strong>Your Kubernetes cluster</strong>
          <span>
            Your service, with a <em>Keploy agent</em> in its pod (sidecar
            mode), or a <em>node agent</em> on each node (DaemonSet mode).
          </span>
          <span>
            <em>k8s-proxy</em>, the node agent and the <em>auto-replay pods</em>{" "}
            run in the <code>keploy</code> namespace.
          </span>
        </li>
        <li className="kd-arch__card">
          <strong>Keploy Cloud</strong>
          <span>
            The Console, tests, mocks and reports, Keploy branches and reviews.
          </span>
        </li>
        <li className="kd-arch__card">
          <strong>Your CI runner</strong>
          <span>
            <code>keploy cloud replay</code> runs the pull request&apos;s image
            with mocks and sets the pull request check.
          </span>
        </li>
      </ol>
    </div>
  );
}
