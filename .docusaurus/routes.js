
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug','3d6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config','914'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content','c28'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry','0da'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes','244'),
    exact: true
  },
  {
    path: '/about',
    component: ComponentCreator('/about','239'),
    exact: true
  },
  {
    path: '/application-development',
    component: ComponentCreator('/application-development','a0b'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive','f4c'),
    exact: true
  },
  {
    path: '/docs/tags',
    component: ComponentCreator('/docs/tags','0cc'),
    exact: true
  },
  {
    path: '/docs/tags/developer-guide',
    component: ComponentCreator('/docs/tags/developer-guide','f12'),
    exact: true
  },
  {
    path: '/docs/tags/explanation',
    component: ComponentCreator('/docs/tags/explanation','7fa'),
    exact: true
  },
  {
    path: '/docs/tags/faq',
    component: ComponentCreator('/docs/tags/faq','3c2'),
    exact: true
  },
  {
    path: '/docs/tags/go',
    component: ComponentCreator('/docs/tags/go','365'),
    exact: true
  },
  {
    path: '/docs/tags/helloworld',
    component: ComponentCreator('/docs/tags/helloworld','03b'),
    exact: true
  },
  {
    path: '/docs/tags/operation-guide',
    component: ComponentCreator('/docs/tags/operation-guide','79c'),
    exact: true
  },
  {
    path: '/docs/tags/record',
    component: ComponentCreator('/docs/tags/record','660'),
    exact: true
  },
  {
    path: '/docs/tags/reference',
    component: ComponentCreator('/docs/tags/reference','8ce'),
    exact: true
  },
  {
    path: '/docs/tags/references',
    component: ComponentCreator('/docs/tags/references','553'),
    exact: true
  },
  {
    path: '/docs/tags/sdk',
    component: ComponentCreator('/docs/tags/sdk','aaa'),
    exact: true
  },
  {
    path: '/docs/tags/test',
    component: ComponentCreator('/docs/tags/test','df6'),
    exact: true
  },
  {
    path: '/docs/tags/tutorial',
    component: ComponentCreator('/docs/tags/tutorial','c37'),
    exact: true
  },
  {
    path: '/docs/tags/ui',
    component: ComponentCreator('/docs/tags/ui','020'),
    exact: true
  },
  {
    path: '/leadership',
    component: ComponentCreator('/leadership','499'),
    exact: true
  },
  {
    path: '/privacy-policy',
    component: ComponentCreator('/privacy-policy','cde'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search','79a'),
    exact: true
  },
  {
    path: '/security',
    component: ComponentCreator('/security','c00'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs','6ea'),
    routes: [
      {
        path: '/docs/concepts/',
        component: ComponentCreator('/docs/concepts/','303'),
        exact: true,
        'sidebar': "sidebarConcepts"
      },
      {
        path: '/docs/concepts/what-are-keploy-features',
        component: ComponentCreator('/docs/concepts/what-are-keploy-features','081'),
        exact: true,
        'sidebar': "sidebarConcepts"
      },
      {
        path: '/docs/concepts/what-are-keploy-sdk-modes',
        component: ComponentCreator('/docs/concepts/what-are-keploy-sdk-modes','1f6'),
        exact: true,
        'sidebar': "sidebarConcepts"
      },
      {
        path: '/docs/concepts/what-is-keploy',
        component: ComponentCreator('/docs/concepts/what-is-keploy','7f2'),
        exact: true,
        'sidebar': "sidebarConcepts"
      },
      {
        path: '/docs/concepts/what-is-keploy-sdk',
        component: ComponentCreator('/docs/concepts/what-is-keploy-sdk','4a5'),
        exact: true,
        'sidebar': "sidebarConcepts"
      },
      {
        path: '/docs/devtools/introduction',
        component: ComponentCreator('/docs/devtools/introduction','6b0'),
        exact: true,
        'sidebar': "sidebarDevTools"
      },
      {
        path: '/docs/devtools/sdk-contrib-guide',
        component: ComponentCreator('/docs/devtools/sdk-contrib-guide','91f'),
        exact: true
      },
      {
        path: '/docs/devtools/server-contrib-guide',
        component: ComponentCreator('/docs/devtools/server-contrib-guide','ecd'),
        exact: true
      },
      {
        path: '/docs/devtools/ui-contrib-guide',
        component: ComponentCreator('/docs/devtools/ui-contrib-guide','81a'),
        exact: true
      },
      {
        path: '/docs/go/',
        component: ComponentCreator('/docs/go/','706'),
        exact: true,
        'sidebar': "sidebarGo"
      },
      {
        path: '/docs/go/installation',
        component: ComponentCreator('/docs/go/installation','6d7'),
        exact: true,
        'sidebar': "sidebarGo"
      },
      {
        path: '/docs/go/integration-with-go-test',
        component: ComponentCreator('/docs/go/integration-with-go-test','fa7'),
        exact: true,
        'sidebar': "sidebarGo"
      },
      {
        path: '/docs/go/run-your-first-app-tutorial',
        component: ComponentCreator('/docs/go/run-your-first-app-tutorial','837'),
        exact: true,
        'sidebar': "sidebarGo"
      },
      {
        path: '/docs/go/supported-frameworks',
        component: ComponentCreator('/docs/go/supported-frameworks','016'),
        exact: true,
        'sidebar': "sidebarGo"
      },
      {
        path: '/docs/keploy-explained/faq',
        component: ComponentCreator('/docs/keploy-explained/faq','8c0'),
        exact: true,
        'sidebar': "sidebarExplained"
      },
      {
        path: '/docs/keploy-explained/how-keploy-works',
        component: ComponentCreator('/docs/keploy-explained/how-keploy-works','495'),
        exact: true,
        'sidebar': "sidebarExplained"
      },
      {
        path: '/docs/keploy-explained/introduction',
        component: ComponentCreator('/docs/keploy-explained/introduction','71a'),
        exact: true,
        'sidebar': "sidebarExplained"
      },
      {
        path: '/docs/keploy-explained/why-keploy',
        component: ComponentCreator('/docs/keploy-explained/why-keploy','a4d'),
        exact: true,
        'sidebar': "sidebarExplained"
      },
      {
        path: '/docs/operation/',
        component: ComponentCreator('/docs/operation/','80b'),
        exact: true,
        'sidebar': "sidebarOperations"
      },
      {
        path: '/docs/operation/record-operations',
        component: ComponentCreator('/docs/operation/record-operations','87b'),
        exact: true,
        'sidebar': "sidebarOperations"
      },
      {
        path: '/docs/operation/test-operations',
        component: ComponentCreator('/docs/operation/test-operations','e8d'),
        exact: true,
        'sidebar': "sidebarOperations"
      },
      {
        path: '/docs/operation/web-ui-operations',
        component: ComponentCreator('/docs/operation/web-ui-operations','46c'),
        exact: true,
        'sidebar': "sidebarOperations"
      },
      {
        path: '/docs/reference/glossary',
        component: ComponentCreator('/docs/reference/glossary','e4d'),
        exact: true
      },
      {
        path: '/docs/server/introduction',
        component: ComponentCreator('/docs/server/introduction','65d'),
        exact: true,
        'sidebar': "sidebarInstallation"
      },
      {
        path: '/docs/server/sdk-installation',
        component: ComponentCreator('/docs/server/sdk-installation','6f4'),
        exact: true,
        'sidebar': "sidebarInstallation"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/','deb'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
