import React, { useState, useRef } from 'react';
import Link from '@docusaurus/Link';
import useThemeContext from '../hooks/useThemeContext';

const navItems = [
  {
    label: 'Products',
    megaMenu: [
      {
        title: 'Unit Testing',
        description: 'Generate unit tests with mocks in seconds',
        image: 'https://keploy.io/_next/static/media/unit-test.c96bb42c.svg',
        href: '/docs/server/installation/',
        height: '280px',
        width: '340px',
      },
      {
        title: 'API Testing',
        description: 'Automatically record, replay, and validate APIs',
        image: 'https://keploy.io/_next/static/media/api-test.c9383d11.svg',
        href: '/docs/running-keploy/about-api-testing/',
        height: '280px',
        width: '340px',
      },
      {
        title: 'Integration Testing',
        description: 'Open-source testing infrastructure for devs',
        image: 'https://keploy.io/_next/static/media/integration-test.842196d5.svg',
        href: '/docs/keploy-explained/introduction/',
        height: '280px',
        width: '340px',
      },
    ],
  },
  {
    label: 'Solutions',
    megaMenu: [
      {
        title: 'Code Coverage',
        image: 'https://keploy.io/_next/static/media/code-coverages.2e8db773.svg',
        href: 'https://keploy.io/code-coverage',
        height: '180px',
        width: '240px',
      },
      {
        title: 'Developer Productivity',
        image: 'https://keploy.io/_next/static/media/developer-productivity.093de83a.svg',
        href: 'https://keploy.io/developer-productivity',
        height: '180px',
        width: '240px',
      },
      {
        title: 'CI Pipelines',
        image: 'https://keploy.io/_next/static/media/ci-cd.aebe9002.svg',
        href: 'https://keploy.io/docs/ci-cd/github/',
        height: '180px',
        width: '240px',
      },
    ],
  },
  {
    label: 'Developers',
    megaMenu: [
      {
        title: 'Docs',
        image: 'https://keploy.io/_next/static/media/doc.66b286fa.svg',
        href: 'https://keploy.io/docs/',
        height: '160px',
        width: '200px',
      },
      {
        title: 'Technical Blog',
        image: 'https://keploy.io/_next/static/media/blogs.38596f15.svg',
        href: 'https://keploy.io/blog',
        height: '160px',
        width: '200px',
      },
      {
        title: 'Community Stories',
        image: 'https://keploy.io/_next/static/media/community.d62a63d8.svg',
        href: 'https://www.g2.com/products/keploy/reviews',
        height: '160px',
        width: '200px',
      },
      {
        title: 'Tutorials',
        image: 'https://keploy.io/_next/static/media/tutorials.7666a675.svg',
        href: 'https://www.youtube.com/playlist?list=PLuImHQnqnB_b3MbF1_873XeMhXkaZPpwV',
        height: '160px',
        width: '200px',
      },
      {
        title: 'Migration Guide',
        image: 'https://keploy.io/_next/static/media/migration.8de1314d.svg',
        href: 'https://keploy.io/blog/technology/migration-guide-from-restassured-to-keploy',
        height: '160px',
        width: '200px',
      },
    ],
  },
  { label: 'Pricing', href: 'https://keploy.io/pricing' },
  {
    label: 'Resources',
    megaMenu: [
      {
        title: 'About Us',
        image: 'https://keploy.io/_next/static/media/about-us.e6182882.svg',
        href: 'https://keploy.io/about',
        height: '140px',
        width: '180px',
      },
      {
        title: 'Events',
        image: 'https://keploy.io/_next/static/media/events.8cfbfeeb.svg',
        href: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2l-psdTCNCLYAJ-Jt5ESyGP7gi1_U70ySTjtFNr0Kmx5UagNJnyzg7lNjA3NKnaP6qFfpAgcdZ',
        height: '140px',
        width: '180px',
      },
      {
        title: 'Partner With Us',
        image: 'https://keploy.io/_next/static/media/partner-with-us.d899cd43.svg',
        href: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2l-psdTCNCLYAJ-Jt5ESyGP7gi1_U70ySTjtFNr0Kmx5UagNJnyzg7lNjA3NKnaP6qFfpAgcdZ',
        height: '140px',
        width: '180px',
      },
      {
        title: 'Contact Us',
        image: 'https://keploy.io/_next/static/media/contact.8d4fbcb2.svg',
        href: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2l-psdTCNCLYAJ-Jt5ESyGP7gi1_U70ySTjtFNr0Kmx5UagNJnyzg7lNjA3NKnaP6qFfpAgcdZ',
        height: '140px',
        width: '180px',
      },
      {
        title: 'Community Forum',
        image: 'https://keploy.io/_next/static/media/community-forum.f92d4c5e.svg',
        href: 'https://github.com/keploy',
        height: '140px',
        width: '180px',
      },
    ],
  },
];

const rightIcons = [
  {
    icon: '/img/vscode.svg',
    label: 'VS Code',
    value: '543K',
    href: 'https://marketplace.visualstudio.com/items?itemName=keploy.keploy',
  },
  {
    icon: '/img/github.svg',
    label: 'GitHub',
    value: '10.2K',
    href: 'https://github.com/keploy/keploy',
  },
];

const versions = [
  {
    label: '3.0.0',
    href: 'https://keploy.io/docs/server/installation/',
  },
  {
    label: '2.0.0',
    href: 'https://keploy.io/docs/2.0.0/server/installation/',
  },
  {
    label: '1.0.0',
    href: 'https://keploy.io/docs/1.0.0/keploy-explained/introduction/',
  },
];

function ThemeToggle() {
  const { isDarkTheme, setLightTheme, setDarkTheme } = useThemeContext();
  return (
    <button
      aria-label="Switch between dark and light mode"
      className="mx-2 p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-gray-700 transition"
      onClick={() => (isDarkTheme ? setLightTheme() : setDarkTheme())}
    >
      {isDarkTheme ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" /></svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" /></svg>
      )}
    </button>
  );
}

function VersionDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative ml-2">
      <button
        className="flex items-center px-3 py-1 rounded-md font-semibold text-base hover:bg-orange-50 dark:hover:bg-gray-800 transition"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        3.0.0
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50 border border-orange-100 dark:border-gray-700">
          {versions.map((v) => (
            <a
              key={v.label}
              href={v.href}
              className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-md"
            >
              {v.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.649.242 2.872.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" /></svg>
  );
}

function KeployLogo() {
  return (
    <svg height="40px" width="120px" version="1.1" viewBox="0 0 654 211" xmlns="http://www.w3.org/2000/svg">
      <title>print 2</title>
      <defs>
        <linearGradient id="linearGradient-1" x1="4.79894665e-14%" x2="4.79894665e-14%" y1="5.9372743e-14%" y2="100.010525%">
          <stop offset="0%" stopColor="#FAD961" />
          <stop offset="100%" stopColor="#F76B1C" />
        </linearGradient>
        <linearGradient id="linearGradient-2" x1="-1.2055617e-14%" x2="-1.2055617e-14%" y1="-6.0644458e-15%" y2="100.005594%">
          <stop offset="0%" stopColor="#FAD961" />
          <stop offset="100%" stopColor="#F76B1C" />
        </linearGradient>
      </defs>
      <g id="Material-Design-Stickersheet" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g id="print-2" fillRule="nonzero">
          <g id="print">
            <g id="Group">
              <g id="Path" fill="url(#linearGradient-1)" transform="translate(79.554233, 36.680212) scale(-1, 1) rotate(-180.000000) translate(-79.554233, -36.680212) translate(34.084532, 0.000000)">
                <path d="M90.9394012,0 C75.7888846,23.901637 27.9278103,93.9988661 3.25939689,67.4484092 C-2.85282459,60.870658 0.148344297,52.1761496 7.96880165,42.8877998 C32.1549743,37.1481312 63.6189036,21.8042754 90.9394012,0" />
              </g>
              <g id="Shape" fill="url(#linearGradient-2)" transform="translate(90.500000, 121.222430) scale(-1, 1) rotate(-180.000000) translate(-90.500000, -121.222430) translate(0.000000, 31.444860)">
                <path d="M158.050239,73.7953285 C156.099683,71.6433718 151.694738,72.4448182 148.211088,75.5835573 C144.734636,78.7246909 143.499044,83.0190262 145.4496,85.1712223 C147.400156,87.3236579 151.805101,86.5272399 155.283952,83.3861063 C158.765203,80.2420993 160.000795,75.9480035 158.050239,73.7953285 L158.050239,73.7953285 Z M180.127748,53.0482344 C180.103756,53.1600586 180.094159,53.2740378 180.067768,53.3887354 C160.888502,140.991116 12.4963071,208.620551 0.506266678,166.919955 C-8.44853606,135.775608 104.356211,117.656501 104.356211,117.656501 C106.72135,117.245362 108.523395,115.189426 108.523395,112.711814 C108.523395,110.145605 106.588674,108.053032 104.098056,107.751323 C38.0905747,110.416186 26.2751967,69.8683128 26.2751967,69.8683128 C13.7376571,29.341272 52.5707528,0 52.5707528,0 C33.850455,75.1096814 114.497422,43.7594057 114.497422,43.7594057 C180.996261,21.0832849 183.33069,39.134387 180.127748,53.0482344" />
              </g>
            </g>
            <g id="text-logo-path-group" fill="#FF914D" stroke="#FFFFFF" strokeWidth="1.92115385" transform="translate(213.938936, 79.355753)">
              <g id="text-logo-path-0">
                <path id="Shape" d="M0,83.9928462 L0,83.9928462 L0,7.93436538 C1.07584615,7.75505769 2.76646154,7.48609615 5.07184615,7.12748077 C7.36442308,6.78167308 9.56734615,6.60876923 11.6806154,6.60876923 L11.6806154,6.60876923 C13.8835385,6.60876923 15.8303077,6.78167308 17.5209231,7.12748077 C19.2115385,7.48609615 20.6267885,8.09446154 21.7666731,8.95257692 C22.9193654,9.8235 23.7902885,11.0210192 24.3794423,12.5451346 C24.9685962,14.06925 25.2631731,16.0736538 25.2631731,18.5583462 L25.2631731,18.5583462 L25.2631731,41.4969231 L55.2331731,7.08905769 C61.7522885,7.08905769 66.4270962,8.31219231 69.2575962,10.7584615 C72.1009038,13.1919231 73.5225577,16.0992692 73.5225577,19.4805 L73.5225577,19.4805 C73.5225577,21.9651923 72.8885769,24.309 71.6206154,26.5119231 C70.3526538,28.7148462 68.3354423,31.2251538 65.5689808,34.0428462 L65.5689808,34.0428462 L47.5677692,52.0440577 C49.95,54.7208654 52.4667115,57.5001346 55.1179038,60.3818654 C57.7690962,63.2764038 60.3626538,66.0940962 62.8985769,68.8349423 C65.4345,71.5757885 67.8871731,74.1885577 70.2565962,76.67325 C72.6260192,79.1579423 74.67525,81.3160385 76.4042885,83.1475385 L76.4042885,83.1475385 C76.4042885,85.2608077 76.0200577,87.1371346 75.2515962,88.7765192 C74.4703269,90.4159038 73.4265,91.8119423 72.1201154,92.9646346 C70.8009231,94.1173269 69.3344423,94.9754423 67.7206731,95.5389808 C66.0940962,96.1025192 64.3714615,96.3842885 62.5527692,96.3842885 L62.5527692,96.3842885 C58.608,96.3842885 55.3804615,95.3980962 52.8701538,93.4257115 C50.3598462,91.4533269 47.9584038,89.1287308 45.6658269,86.4519231 L45.6658269,86.4519231 L25.3976538,62.8217308 L25.3976538,94.6936731 C24.3218077,94.9754423 22.6311923,95.2572115 20.3258077,95.5389808 C18.0332308,95.82075 15.7854808,95.9616346 13.5825577,95.9616346 L13.5825577,95.9616346 C11.3796346,95.9616346 9.43286538,95.7951346 7.74225,95.4621346 C6.05163462,95.1291346 4.62998077,94.5335769 3.47728846,93.6754615 C2.33740385,92.8045385 1.47288462,91.6070192 0.883730769,90.0829038 C0.294576923,88.5587885 0,86.5287692 0,83.9928462 Z M80.7653077,59.2291731 L80.7653077,59.2291731 C80.7653077,52.9021731 81.8091346,47.4525 83.8967885,42.8801538 C85.9844423,38.3078077 88.7060769,34.5551538 92.0616923,31.6221923 C95.4173077,28.6892308 99.2532115,26.5311346 103.569404,25.1479038 C107.885596,23.7646731 112.291442,23.0730577 116.786942,23.0730577 L116.786942,23.0730577 C121.897212,23.0730577 126.54,23.8351154 130.715308,25.3592308 C134.890615,26.8833462 138.489577,28.9902115 141.512192,31.6798269 C144.547615,34.38225 146.904231,37.6097885 148.582038,41.3624423 C150.272654,45.1150962 151.117962,49.1943462 151.117962,53.6001923 L151.117962,53.6001923 C151.117962,56.8789615 150.202212,59.3764615 148.370712,61.0926923 C146.552019,62.8089231 143.996885,63.9231923 140.705308,64.4355 L140.705308,64.4355 L105.183173,69.7763077 C106.259019,72.9654231 108.417115,75.3476538 111.657462,76.923 C114.897808,78.4983462 118.650462,79.2860192 122.915423,79.2860192 L122.915423,79.2860192 C126.847385,79.2860192 130.561615,78.7801154 134.058115,77.7683077 C137.554615,76.7565 140.404327,75.5717885 142.60725,74.2141731 L142.60725,74.2141731 C144.156981,75.1491346 145.456962,76.4875385 146.507192,78.2293846 C147.570231,79.9584231 148.10175,81.7835192 148.10175,83.7046731 L148.10175,83.7046731 C148.10175,88.0208654 146.084538,91.2355962 142.050115,93.3488654 L142.050115,93.3488654 C138.950654,94.98825 135.492577,96.1025192 131.675885,96.6916731 C127.846385,97.2808269 124.247423,97.5754038 120.879,97.5754038 L120.879,97.5754038 C115.192385,97.5754038 109.922019,96.7749231 105.067904,95.1739615 C100.213788,93.5858077 95.9936538,91.2099808 92.4075,88.0464808 C88.8213462,84.8701731 85.9844423,80.8805769 83.8967885,76.0776923 C81.8091346,71.2748077 80.7653077,65.6586346 80.7653077,59.2291731 Z M103.415712,53.6001923 L103.415712,53.6001923 L128.044904,49.5849808 C127.763135,47.6638269 126.7065,45.7426731 124.875,43.8215192 C123.0435,41.9003654 120.347481,40.9397885 116.786942,40.9397885 L116.786942,40.9397885 C114.494365,40.9397885 112.515577,41.3240192 110.850577,42.0924808 C109.185577,42.87375 107.821558,43.8599423 106.758519,45.0510577 C105.708288,46.2421731 104.914212,47.5805769 104.376288,49.0662692 C103.838365,50.5391538 103.518173,52.0504615 103.415712,53.6001923 Z M162.875423,109.3905 L162.875423,109.3905 L162.875423,40.2289615 C162.875423,37.6546154 163.438962,35.54775 164.566038,33.9083654 C165.693115,32.2561731 167.217231,30.7512692 169.138385,29.3936538 L169.138385,29.3936538 C172.084154,27.4725 175.766365,25.9355769 180.185019,24.7828846 C184.590865,23.643 189.534635,23.0730577 195.016327,23.0730577 L195.016327,23.0730577 C200.792596,23.0730577 206.152615,23.8095 211.096385,25.2823846 C216.052962,26.7552692 220.311519,29.0414423 223.872058,32.1409038 C227.432596,35.2403654 230.224673,39.1082885 232.248288,43.7446731 C234.259096,48.3938654 235.2645,53.9331923 235.2645,60.3626538 L235.2645,60.3626538 C235.2645,66.4975385 234.399981,71.8767692 232.670942,76.5003462 C230.929096,81.1239231 228.476423,84.9918462 225.312923,88.1041154 C222.149423,91.2291923 218.326327,93.5665962 213.843635,95.1163269 C209.360942,96.6660577 204.37875,97.4409231 198.897058,97.4409231 L198.897058,97.4409231 C194.772981,97.4409231 190.949885,96.8069423 187.427769,95.5389808 L187.427769,95.5389808 L187.427769,119.457346 C186.492808,119.739115 184.955885,120.052904 182.817,120.398712 C180.678115,120.757327 178.507212,120.936635 176.304288,120.936635 L176.304288,120.936635 C174.203827,120.936635 172.308288,120.782942 170.617673,120.475558 C168.927058,120.168173 167.505404,119.579019 166.352712,118.708096 C165.200019,117.849981 164.3355,116.678077 163.759154,115.192385 C163.17,113.7195 162.875423,111.785538 162.875423,109.3905 Z M187.293288,44.3786538 L187.293288,76.1161154 C188.458788,76.6796538 189.701135,77.1471346 191.020327,77.5185577 C192.326712,77.8899808 193.754769,78.0756923 195.3045,78.0756923 L195.3045,78.0756923 C205.204846,78.0756923 210.155019,72.1713462 210.155019,60.3626538 L210.155019,60.3626538 C210.155019,54.2149615 208.931885,49.6490192 206.485615,46.6648269 C204.052154,43.6934423 200.510827,42.20775 195.861635,42.20775 L195.861635,42.20775 C194.042942,42.20775 192.416365,42.4318846 190.981904,42.8801538 C189.547442,43.3156154 188.317904,43.8151154 187.293288,44.3786538 L187.293288,44.3786538 Z M247.655942,84.915 L247.655942,84.915 L247.655942,1.32559615 C248.731788,1.13348077 250.287923,0.864519231 252.324346,0.518711538 C254.373577,0.172903846 256.448423,0 258.548885,0 L258.548885,0 C260.662154,0 262.564096,0.147288462 264.254712,0.441865385 C265.945327,0.74925 267.366981,1.32559615 268.519673,2.17090385 C269.659558,3.01621154 270.549692,4.18811538 271.190077,5.68661538 C271.817654,7.18511538 272.131442,9.13188462 272.131442,11.5269231 L272.131442,11.5269231 L272.131442,95.1163269 C271.055596,95.2956346 269.486654,95.5517885 267.424615,95.8847885 C265.362577,96.2177885 263.274923,96.3842885 261.161654,96.3842885 L261.161654,96.3842885 C259.048385,96.3842885 257.146442,96.2434038 255.455827,95.9616346 C253.765212,95.6798654 252.349962,95.1035192 251.210077,94.2325962 C250.057385,93.3616731 249.173654,92.1897692 248.558885,90.7168846 C247.956923,89.2311923 247.655942,87.2972308 247.655942,84.915 Z M284.446038,60.2089615 L284.446038,60.2089615 C284.446038,54.5351538 285.361788,49.3992692 287.193288,44.8013077 C289.024788,40.2033462 291.605538,36.3034038 294.935538,33.1014808 C298.265538,29.88675 302.229519,27.4084615 306.827481,25.6666154 C311.412635,23.9375769 316.548519,23.0730577 322.235135,23.0730577 L322.235135,23.0730577 C327.908942,23.0730577 333.051231,23.9631923 337.662,25.7434615 C342.285577,27.5237308 346.249558,30.0212308 349.553942,33.2359615 C352.858327,36.4506923 355.426269,40.3570385 357.257769,44.955 C359.089269,49.5401538 360.005019,54.6248077 360.005019,60.2089615 L360.005019,60.2089615 C360.005019,66.1645385 359.089269,71.4797308 357.257769,76.1545385 C355.426269,80.8165385 352.858327,84.7292885 349.553942,87.8927885 C346.249558,91.0690962 342.285577,93.4769423 337.662,95.1163269 C333.051231,96.7557115 327.908942,97.5754038 322.235135,97.5754038 L322.235135,97.5754038 C316.548519,97.5754038 311.412635,96.7044808 306.827481,94.9626346 C302.229519,93.2335962 298.265538,90.7617115 294.935538,87.5469808 C291.605538,84.33225 289.024788,80.4130962 287.193288,75.7895192 C285.361788,71.17875 284.446038,65.9852308 284.446038,60.2089615 Z M309.555519,60.2089615 L309.555519,60.2089615 C309.555519,66.0748846 310.682596,70.5703846 312.93675,73.6954615 C315.190904,76.8077308 318.335192,78.3638654 322.369615,78.3638654 L322.369615,78.3638654 C326.404038,78.3638654 329.497096,76.7821154 331.648788,73.6186154 C333.813288,70.4551154 334.895538,65.9852308 334.895538,60.2089615 L334.895538,60.2089615 C334.895538,54.4455 333.794077,50.0012308 331.591154,46.8761538 C329.375423,43.7638846 326.25675,42.20775 322.235135,42.20775 L322.235135,42.20775 C318.200712,42.20775 315.075635,43.7638846 312.859904,46.8761538 C310.656981,50.0012308 309.555519,54.4455 309.555519,60.2089615 Z M365.422673,28.8365192 L365.422673,28.8365192 C366.780288,27.4789038 368.586173,26.2941923 370.840327,25.2823846 C373.094481,24.2705769 375.559962,23.7646731 378.236769,23.7646731 L378.236769,23.7646731 C381.605192,23.7646731 384.390865,24.4690962 386.593788,25.8779423 C388.796712,27.2867885 390.4425,29.9123654 391.531154,33.7546731 L391.531154,33.7546731 L402.84675,73.3688654 L403.480731,73.3688654 C404.659038,70.0900962 405.786115,66.5231538 406.861962,62.6680385 C407.937808,58.8257308 409.00725,54.8681538 410.070288,50.7953077 C411.120519,46.7096538 412.100308,42.624 413.009654,38.5383462 C413.931808,34.4655 414.745096,30.4566923 415.449519,26.5119231 L415.449519,26.5119231 C418.920404,24.6804231 422.692269,23.7646731 426.765115,23.7646731 L426.765115,23.7646731 C430.146346,23.7646731 432.938423,24.4947115 435.141346,25.9547885 C437.344269,27.4020577 438.445731,29.88675 438.445731,33.4088654 L438.445731,33.4088654 C438.445731,35.9832115 438.119135,38.9866154 437.465942,42.4190769 C436.81275,45.8387308 435.935423,49.4697115 434.833962,53.3120192 C433.7325,57.1671346 432.426115,61.1311154 430.914808,65.2039615 C429.416308,69.2896154 427.847365,73.2984231 426.207981,77.2303846 C424.568596,81.1751538 422.890788,84.8957885 421.174558,88.3922885 C419.471135,91.8887885 417.793327,95.0394808 416.141135,97.8443654 L416.141135,97.8443654 C413.477135,102.544788 410.979635,106.380692 408.648635,109.352077 C406.330442,112.336269 404.114712,114.673673 402.001442,116.364288 C399.900981,118.042096 397.794115,119.188385 395.680846,119.803154 C393.567577,120.417923 391.364654,120.725308 389.072077,120.725308 L389.072077,120.725308 C385.037654,120.725308 381.765288,119.527788 379.254981,117.13275 C376.744673,114.737712 375.252577,111.619038 374.778692,107.776731 L374.778692,107.776731 C377.878154,105.381692 380.964808,102.717692 384.038654,99.7847308 C387.1125,96.8517692 389.891769,93.8611731 392.376462,90.8129423 L392.376462,90.8129423 C390.724269,90.3518654 388.963212,89.2183846 387.093288,87.4125 C385.223365,85.6066154 383.180538,82.2638077 380.964808,77.3840769 L380.964808,77.3840769 C379.888962,74.9890385 378.755481,72.3058269 377.564365,69.3344423 C376.360442,66.35025 375.118096,62.937 373.837327,59.0946923 C372.54375,55.2395769 371.205346,50.8401346 369.822115,45.8963654 C368.438885,40.9525962 366.972404,35.2659808 365.422673,28.8365192 Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const { isDarkTheme } = useThemeContext();
  const timeoutRef = useRef(null);

  const handleMouseEnter = (label) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 300); // 300ms delay before hiding
  };

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${isDarkTheme ? 'bg-[#18181b] shadow-lg' : 'bg-white bg-opacity-90 shadow'} flex items-center justify-between px-8 py-2`}>
      {/* Logo */}
      <Link to="/" className="flex items-center mr-8">
        <KeployLogo style={{ height: '40px', width: '120px' }} />
      </Link>
      {/* Center nav items */}
      <div className="flex space-x-2 relative h-12 items-center">
        {navItems.map((item, idx) => (
          <div
            key={item.label}
            className="relative group h-full flex items-center"
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            {item.megaMenu ? (
              <button className={`px-4 py-2 h-full flex items-center rounded-md font-sans font-medium text-base border-0 bg-transparent transition-colors duration-200 ${isDarkTheme ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-orange-600'}`}>
                {item.label}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            ) : (
              <Link to={item.href} className={`px-4 py-2 h-full flex items-center rounded-md font-sans font-medium text-base border-0 bg-transparent transition-colors duration-200 ${isDarkTheme ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-orange-600'}`}>
                {item.label}
              </Link>
            )}
          </div>
        ))}
        
        {/* Mega menu dropdown - with hover handling */}
        {openMenu && navItems.find(item => item.label === openMenu)?.megaMenu && (
          <div 
            className="absolute left-0 top-14 min-w-max backdrop-blur-md bg-white/3 rounded-2xl shadow-2xl p-6 flex gap-6 animate-fade-in z-50"
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-3 gap-6">
              {navItems.find(item => item.label === openMenu).megaMenu.map((card) => (
                <Link
                  to={card.href}
                  key={card.title}
                  className="relative group w-[340px] h-[280px] overflow-hidden rounded-2xl shadow-md border border-orange-200 dark:border-orange-700 transition-transform duration-200 hover:scale-[1.02]"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="text-gray-800 font-semibold text-lg">{card.title}</div>
                    <div className="text-sm text-gray-700 mt-1">{card.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Right icons and button */}
      <div className="flex items-center space-x-2">
        {/* Search Button (Docusaurus default) */}
        <div className="hidden md:block">
          <div className="DocSearch DocSearch-Button" tabIndex={0} role="button" aria-label="Search (Ctrl+K)">
            <span className="DocSearch-Button-Container">
              <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              <span className="DocSearch-Button-Placeholder">Search</span>
            </span>
            <span className="DocSearch-Button-Keys"><kbd className="DocSearch-Button-Key">Ctrl</kbd><kbd className="DocSearch-Button-Key">K</kbd></span>
          </div>
        </div>
        {/* Theme Toggle */}
        <ThemeToggle isDarkTheme={isDarkTheme} />
        {/* Github Link */}
        <a
          href="https://github.com/keploy/keploy"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700 transition !w-10 !h-10 flex items-center justify-center"
          aria-label="GitHub repository"
        >
          <GithubIcon />
        </a>
        {/* Version Dropdown */}
        <VersionDropdown />
      </div>
    </nav>
  );
}
