module.exports = {
  sidebarExplained: [
    {
      type: "category",
      label: "Keploy explained",
      collapsible: false,
      collapsed: false,
      items: [
        "keploy-explained/introduction",
        "keploy-explained/how-keploy-works",
        "keploy-explained/why-keploy",
        "keploy-explained/faq",
      ],
    },
  ],
  sidebarConcepts: [
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "concepts/index",
      },
      items: [
        "concepts/what-is-keploy",
        "concepts/what-are-keploy-features",
        "concepts/what-is-keploy-sdk",
        "concepts/what-are-keploy-sdk-modes",
      ],
    },
  ],
  sidebarInstallation: [
    {
      type: "category",
      label: "Installation",
      collapsible: false,
      collapsed: false,
      items: ["server/introduction", "server/sdk-installation"],
    },
  ],
  sidebarOperations: [
    {
      type: "category",
      label: "Operation guides",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "operation/index",
      },
      items: [
        "operation/record-operations",
        "operation/test-operations",
        "operation/web-ui-operations",
      ],
    },
  ],

  sidebarGo: [
    {
      type: "category",
      label: "QuickStart",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "go/quickstart/quickstart",
      },
      items: [
        "go/quickstart/run-your-first-app-tutorial",
        "go/quickstart/gin-mongo-quickstart",
      ],
    },
    {
      type: "category",
      label: "Go SDK",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "go/index",
      },
      items: [
        "go/installation",
        "go/supported-frameworks",
        "go/integration-with-go-test",
        {
          type: "link",
          label: "Go Pkg Reference",
          href: "https://pkg.go.dev/github.com/keploy/go-sdk",
        },
      ],
    },
  ],
  sidebarDevTools: [
    {
      type: "category",
      label: "Contribution Guide",
      collapsed: true,
      items: ["devtools/introduction"],
    },
  ],
  sidebarJava: [
    {
      type: "category",
      label: "QuickStart",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "java/installation",
      },
      items: [
        "java/run-your-first-app-tutorial",
      ],
    },
    {
      type: "category",
      label: "Java SDK",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "java/installation",
      },
      items: [
        "java/installation",
        "java/run-your-first-app-tutorial",
        "java/integration-with-Junit",
        {
          type: "link",
          label: "Maven Reference",
          href: "https://search.maven.org/artifact/io.keploy/keploy-sdk",
        },
      ],
    },
  ],
  sidebarDevTools: [
    {
      type: "category",
      label: "Contribution Guide",
      collapsed: true,
      items: ["devtools/introduction"],
    },
  ],
};
