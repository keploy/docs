module.exports = {
  // Keploy Explanation Sidebar
  sidebarExplained: [
    {
      type: "category",
      label: "Explanation",
      collapsible: false,
      collapsed: false,
      items: [
        "keploy-explained/introduction",
        "keploy-explained/how-keploy-works",
        "keploy-explained/why-keploy",
        "keploy-explained/faq",
      ],
    },
    {
      type: "category",
      label: "Installation",
      collapsible: false,
      collapsed: false,
      items: [
        "server/introduction", 
        "server/sdk-installation",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "concepts/index",
      // },
      items: [
        "concepts/what-is-keploy",
        "concepts/what-are-keploy-features",
        "concepts/what-is-keploy-sdk",
        "concepts/what-are-keploy-sdk-modes",
      ],
    },
    {
      type: "category",
      label: "Operations",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "operation/index",
      // },
      items: [
        "operation/web-ui-operations",
        "operation/record-operations",
        "operation/test-operations",
      ],
    },
  ],

  // Keploy Installation Sidebar
  sidebarInstallation: [
    {
      type: "category",
      label: "Explanation",
      collapsible: false,
      collapsed: false,
      items: [
        "keploy-explained/introduction",
        "keploy-explained/how-keploy-works",
        "keploy-explained/why-keploy",
        "keploy-explained/faq",
      ],
    },
    {
      type: "category",
      label: "Installation",
      collapsible: false,
      collapsed: false,
      items: [
        "server/introduction", 
        "server/sdk-installation",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "concepts/index",
      // },
      items: [
        "concepts/what-is-keploy",
        "concepts/what-are-keploy-features",
        "concepts/what-is-keploy-sdk",
        "concepts/what-are-keploy-sdk-modes",
      ],
    },
    {
      type: "category",
      label: "Operations",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "operation/index",
      // },
      items: [
        "operation/web-ui-operations",
        "operation/record-operations",
        "operation/test-operations",
      ],
    },
  ],

  // Keploy Concepts Sidebar
  sidebarConcepts: [
    {
      type: "category",
      label: "Explanation",
      collapsible: false,
      collapsed: false,
      items: [
        "keploy-explained/introduction",
        "keploy-explained/how-keploy-works",
        "keploy-explained/why-keploy",
        "keploy-explained/faq",
      ],
    },
    {
      type: "category",
      label: "Installation",
      collapsible: false,
      collapsed: false,
      items: [
        "server/introduction", 
        "server/sdk-installation",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "concepts/index",
      // },
      items: [
        "concepts/what-is-keploy",
        "concepts/what-are-keploy-features",
        "concepts/what-is-keploy-sdk",
        "concepts/what-are-keploy-sdk-modes",
      ],
    },
    {
      type: "category",
      label: "Operations",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "operation/index",
      // },
      items: [
        "operation/web-ui-operations",
        "operation/record-operations",
        "operation/test-operations",
      ],
    },
  ],
  
  // Keploy Go Sidebar
  sidebarGo: [
    {
      type: "category",
      label: "QuickStart",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id:   "go/quickstart/quickstart",
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
    {
      type: "category",
      label: "More SDKs",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "link",
          label: "TypeScript SDK (WIP)",
          href: "https://github.com/keploy/keploy/issues/61",
        },
        {
          type: "link",
          label: "Python SDK (WIP)",
          href: "https://github.com/keploy/keploy/issues/58",
        },
      ],
    },
  ],

  // Keploy DevTools Sidebar
  sidebarDevTools: [
    {
      type: "category",
      label: "Contribution Guide",
      collapsed: true,
      items: ["devtools/introduction"],
    },
  ],

  // Keploy Java Sidebar
  sidebarJava: [
    {
      type: "category",
      label: "QuickStart",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id:   "go/quickstart/quickstart",
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
    {
      type: "category",
      label: "More SDKs",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "link",
          label: "TypeScript SDK (WIP)",
          href: "https://github.com/keploy/keploy/issues/61",
        },
        {
          type: "link",
          label: "Python SDK (WIP)",
          href: "https://github.com/keploy/keploy/issues/58",
        },
      ],
    },
  ],

  // Keploy Operations Sidebar
  sidebarOperations: [
    {
      type: "category",
      label: "Explanation",
      collapsible: false,
      collapsed: false,
      items: [
        "keploy-explained/introduction",
        "keploy-explained/how-keploy-works",
        "keploy-explained/why-keploy",
        "keploy-explained/faq",
      ],
    },
    {
      type: "category",
      label: "Installation",
      collapsible: false,
      collapsed: false,
      items: [
        "server/introduction", 
        "server/sdk-installation",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "concepts/index",
      // },
      items: [
        "concepts/what-is-keploy",
        "concepts/what-are-keploy-features",
        "concepts/what-is-keploy-sdk",
        "concepts/what-are-keploy-sdk-modes",
      ],
    },
    {
      type: "category",
      label: "Operations",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "operation/index",
      // },
      items: [
        "operation/web-ui-operations",
        "operation/record-operations",
        "operation/test-operations",
      ],
    },
  ],

  // Keploy Contributions Sidebar
  sidebarContributions: [
    {
      type: "category",
      label: "Contribution Guides",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "operation/index",
      },
      items: [
        "devtools/sdk-contrib-guide",
        "devtools/server-contrib-guide",
        "devtools/ui-contrib-guide",
      ],
    },
  ],

  // Keploy Devtools Sidebar
  sidebarDevTools: [
    {
      type: "category",
      label: "Contribution Guide",
      collapsed: true,
      items: ["devtools/introduction"],
    },
  ],
};
