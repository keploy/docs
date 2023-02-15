module.exports = {
  // Keploy Explanation Sidebar
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
      link: {
        type: "doc",
        id: "operation/index",
      },
      items: [
        "operation/web-ui-operations",
        "operation/record-operations",
        "operation/test-operations",
        "operation/browser-extension-operations",
      ],
    },
    {
      type: "category",
      label: "Simplification",
      collapsible: false,
      collapsed: false,
      // link: {
      //   type: "doc",
      //   id: "concepts/general-glossary",
      // },
      items: [
        "concepts/general-glossary"
      ]
    },
  ],

  // Keploy Go Sidebar
  sidebarSDK: [
    {
      type: "category",
      label: "Sample Quickstart",
      collapsible: true,
      collapsed: false,
      link: {
        type: "doc",
        id: "go/quickstart/index",
      },
      items: [
        "go/quickstart/echo-sql",
        "go/quickstart/gin-mongo",
        "go/quickstart/gin-mongo-2"
      ],
    },

      // Go SDK
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


    // Java SDK
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

      //Ts SDK
    {
      type: "category",
      label: "Typescript SDK",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "typescript/installation",
      },
      items: [
        "typescript/installation",
        "typescript/generate-tests",
        "typescript/supported-frameworks",
        "typescript/mock-library",
        "typescript/testing",
      ],
    },

      // More SDK
    {
      type: "category",
      label: "More SDKs",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "link",
          label: "Python SDK (WIP)",
          href: "https://github.com/keploy/keploy/issues/58",
        },
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
        id:  "devtools/introduction",
      },
      items: [
        "devtools/sdk-contrib-guide",
        "devtools/server-contrib-guide",
        "devtools/ui-contrib-guide",
      ],
    },
  ],
};