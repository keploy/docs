import React from "react";

export const KeployCloud = () => {
  return (
    <section
      id="cloud"
      className="mb-12 mt-24 flex max-w-7xl items-center space-x-5 rounded-lg bg-[color:var(--ifm-card-background-color)] p-5"
    >
      <div className="max-w-3xl mx-auto prose prose-orange">
        <h1> Question? 🤔💭</h1>
        <p className="my-3 block">
          For any support please{" "}
          <a
            href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg"
            className="text-orange-500 underline hover:text-orange-400"
          >
            join keploy slack community
          </a>{" "}
          to get help from fellow users, or{" "}
          <a
            href="https://calendar.app.google/cXVaj6hbMUjvmrnt9"
            className="text-orange-500 underline hover:text-orange-400"
          >
            book a demo
          </a>{" "}
          if you're exploring enterprise use cases.
        </p>
      </div>
    </section>
  );
};
