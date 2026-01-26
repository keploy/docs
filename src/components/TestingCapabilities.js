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
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconText: "text-orange-600 dark:text-orange-400",
      hoverBorder: "hover:border-orange-300 dark:hover:border-orange-500/50",
    },
    purple: {
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconText: "text-purple-600 dark:text-purple-400",
      hoverBorder: "hover:border-purple-300 dark:hover:border-purple-500/50",
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white/70 p-3 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800/50 ${classes.hoverBorder}`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${classes.iconBg} ${classes.iconText}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {badge ? (
            <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
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

      {/* Two Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Functional Testing */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-orange-50/30 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-orange-950/10">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {capabilities.functional.title}
            </h3>
          </div>
          <div className="space-y-3">
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

        {/* Quality Gates */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-purple-50/30 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-purple-950/10">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {capabilities.qualityGates.title}
            </h3>
          </div>
          <div className="space-y-3">
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

