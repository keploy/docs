module.exports = {
  // Keploy Explanation Sidebar
  sidebarInstallation: [
    {
      type: "category",
      label: "Explanation",
      collapsible: true,
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
      collapsible: true,
      collapsed: false,
      items: [
        "server/server-installation",
        "server/sdk-installation",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      collapsible: true,
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
      collapsible: true,
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
      collapsible: true,
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
      label: "Golang",
      collapsible: true,
      collapsed: true,
      link: {
        type: "doc",
        id: "go/index",
      },
      items: [

          // Installation
        {
          type: "doc",
          label: "Installation",
          id: "go/installation",
        },

       // Integration
        {
          type: "category",
          label: "Integration",
          collapsible: true,
          collapsed: true,
          link: {
            type: "doc",
            id: "go/index",
          },
          items: [
            "go/supported-frameworks",
            {
              type: "link",
              label: "Go Pkg Reference",
              href: "https://pkg.go.dev/github.com/keploy/go-sdk",
            },
          ],
        },
        // Record Test
        {
          type: "doc",
          label: "Record Test",
          id: "go/record",
        },
        // Replay Test
        {
          type: "doc",
          label: "Replay Test ",
          id: "go/replay",
        },

        // Quickstarts
        {
          type: "category",
          label: "Sample Quickstarts",
          collapsible: true,
          collapsed: true,
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

      ],
    },



    // Java SDK
    {
      type: "category",
      label: "Java SDK",
      collapsible: true,
      collapsed: true,
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
      collapsible: true,
      collapsed: true,
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
      collapsible: true,
      collapsed: true,
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
      collapsible: true,
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