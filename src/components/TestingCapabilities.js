import React from "react";
import {
  FaSync,
  FaCubes,
  FaRoute,
  FaPlug,
  FaDatabase,
  FaCamera,
  FaTachometerAlt,
  FaShieldAlt,
} from "react-icons/fa";

const capabilities = {
  functional: {
    title: "Functional",
    color: "orange",
    items: [
      { icon: FaSync, label: "Regression testing", subtitle: "Catch behavior regressions in CI" },
      { icon: FaCubes, label: "Integration testing", subtitle: "Validate dependencies (DB/queues/services)" },
      { icon: FaRoute, label: "Flow testing (multi-step)", subtitle: "API journeys with setup + cleanup" },
      { icon: FaPlug, label: "API testing", subtitle: "Endpoint assertions across environments" },
      { icon: FaShieldAlt, label: "Contract testing", subtitle: "OpenAPI contract expectations" },
      { icon: FaCamera, label: "Schema testing", subtitle: "Field-level request/response validation" },
      { icon: FaDatabase, label: "DB validation tests", subtitle: "DB invariants and mutation checks" },
      { icon: FaTachometerAlt, label: "Chaos & fuzz tests", subtitle: "Fault + input chaos testing", badge: "Upcoming" },
    ],
  },
  qualityGates: {
    title: "Quality Gates",
    color: "purple",
    items: [
      { icon: FaCubes, label: "Code Coverage", subtitle: "Line/branch coverage gates" },
      { icon: FaPlug, label: "Schema / API Business Coverage", subtitle: "% API paths + fields exercised" },
      { icon: FaCamera, label: "Baseline assertions", subtitle: "Behavior diffs after normalization" },
      { icon: FaShieldAlt, label: "Contract drifts detection", subtitle: "Breaking changes vs OpenAPI" },
      { icon: FaTachometerAlt, label: "Load & performance metrics", subtitle: "p95 latency + error-rate regression" },
      { icon: FaShieldAlt, label: "Security checks", subtitle: "Auth/schema/input validation" },
      { icon: FaDatabase, label: "Data consistency gate", subtitle: "Cleanup + DB invariants" },
      { icon: FaSync, label: "Crash free rate", subtitle: "0 crashes/panics across runs" },
    ],
  },
};

const CapabilityItem = ({ icon: Icon, label, subtitle, badge, color }) => {
  const colorClasses = {
    orange: {
      chipBorder: "border-orange-200/70 dark:border-orange-500/30",
      chipBg: "bg-orange-50/70 dark:bg-orange-900/10",
      chipText: "text-orange-700 dark:text-orange-200",
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconText: "text-orange-600 dark:text-orange-300",
      hover: "hover:bg-orange-100/70 dark:hover:bg-orange-900/20 hover:border-orange-300/80 dark:hover:border-orange-500/40",
    },
    purple: {
      chipBorder: "border-purple-200/70 dark:border-purple-500/30",
      chipBg: "bg-purple-50/70 dark:bg-purple-900/10",
      chipText: "text-purple-700 dark:text-purple-200",
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconText: "text-purple-600 dark:text-purple-200",
      hover: "hover:bg-purple-100/70 dark:hover:bg-purple-900/20 hover:border-purple-300/80 dark:hover:border-purple-500/40",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="group">
      <div
        className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all ${classes.chipBorder} ${classes.chipBg} ${classes.hover}`}
        title={subtitle || label}
      >
        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${classes.iconBg} ${classes.iconText}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className={`truncate font-medium ${classes.chipText}`}>{label}</span>
        {badge ? (
          <span className="ml-1 rounded-full border border-gray-200 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
            {badge}
          </span>
        ) : null}
      </div>

      {/* Subtitle: visible on mobile, tooltip-only on desktop */}
      {subtitle ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:hidden">{subtitle}</p>
      ) : null}
    </div>
  );
};

export const TestingCapabilities = () => {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          Testing Flexibility
        </span>
        <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Whatever your testing strategy, Keploy fits
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Run the tests you need, then gate merges in CI with measurable signals—coverage, drift, performance, security, and data consistency.
        </p>
      </div>

      {/* Stacked Sections */}
      <div className="mx-auto max-w-5xl">
        {/* Functional */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {capabilities.functional.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">• What you run</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {capabilities.functional.items.map((item, index) => (
              <CapabilityItem
                key={index}
                icon={item.icon}
                label={item.label}
                subtitle={item.subtitle}
                badge={item.badge}
                color="orange"
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gray-200/70 dark:bg-gray-700/70" />

        {/* Quality Gates */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {capabilities.qualityGates.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">• What blocks/permits merges</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {capabilities.qualityGates.items.map((item, index) => (
              <CapabilityItem
                key={index}
                icon={item.icon}
                label={item.label}
                subtitle={item.subtitle}
                badge={item.badge}
                color="purple"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-600 dark:bg-green-900/30 dark:text-green-400">
            ✓
          </span>
          Same test assets can be reused across environments (local → CI → staging) with consistent assertions.
        </p>
      </div>
    </section>
  );
};

export default TestingCapabilities;

