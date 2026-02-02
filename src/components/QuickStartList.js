const quickstarts = [
  // java list
  {
    title: "OpenHospital",
    language: "Java",
    server: "Local",
    description:
      "A sample OpenHospital app to demonstrate how Keploy records test cases and mocks through the UI and tests them seamlessly.",
    link: "/docs/quickstart/openhospital/",
  },

  {
    title: "PetClinic",
    language: "Java",
    server: "Local",
    description:
      "A sample PetClinic app to demonstrate how Keploy records test cases and mocks through the UI and tests them seamlessly.",
    link: "/docs/quickstart/pet-clinic/#instructions-for-starting-using-api-backend-binary",
  },

  {
    title: "PetClinic",
    language: "Java",
    server: "Docker",
    description:
      "A sample PetClinic app to demonstrate how Keploy records test cases and mocks through the UI and tests them seamlessly.",
    link: "/docs/quickstart/pet-clinic/#instructions-for-starting-using-docker",
  },

  {
    title: "Employee-Manager",
    language: "Java",
    server: "Local",
    description:
      "A sample Employee-Manager app to demonstrate Keploy integration capabilities using SpringBoot and PostgreSQL.",
    link: "/docs/quickstart/samples-java/#instructions-for-starting-using-binary",
  },

  {
    title: "Employee-Manager",
    language: "Java",
    server: "Docker",
    description:
      "A sample Employee-Manager app to demonstrate Keploy integration capabilities using SpringBoot and PostgreSQL.",
    link: "/docs/quickstart/samples-java/#instructions-for-starting-using-docker",
  },

  /*{
    title: "Springboot + MongoDB",
    language: "Java",
    server: "Local",
    description:
      "A sample REST API app to demonstrate how seamlessly Keploy integrates with Spring Boot and MongoDB.",
    link: "/docs/quickstart/java-spring-boot-mongo/",
  },*/

  {
    title: "Springboot + XML",
    language: "Java",
    server: "Local",
    description:
      "A sample REST API app to demonstrate XML responses with Spring Boot and JAXB integration.",
    link: "/docs/quickstart/java-spring-boot-xml/",
  },

  // Golang list
  {
    title: "Echo + Postgres",
    language: "Go",
    server: "Docker",
    description:
      "A Sample url shortener app to test Keploy integration capabilities using Echo and PostgreSQL.",
    link: "/docs/quickstart/samples-echo/#using-docker-compose-",
  },
  {
    title: "Echo + Postgres",
    language: "Go",
    server: "Local",
    description:
      "A Sample url shortener app to test Keploy integration capabilities using Echo and PostgreSQL.",
    link: "/docs/quickstart/samples-echo/#running-app-locally-on-linuxwsl-",
  },

  /*{
    title: "Gin + Mongo",
    language: "Go",
    server: "Docker",
    description:
      "A sample url shortener app to test Keploy integration capabilities using Gin and mongoDB.",
    link: "/docs/quickstart/samples-gin/#using-docker-compose-",
  },*/

  /*{
    title: "Gin + Mongo",
    language: "Go",
    server: "Local",
    description:
      "A sample url shortener app to test Keploy integration capabilities using Gin and mongoDB.",
    link: "/docs/quickstart/samples-gin/#running-app-locally-on-linuxwsl-",
  },
  */

  {
    title: "Gin + Redis",
    language: "Go",
    server: "Docker",
    description:
      "A sample User Authentication app to demonstrate how seamlessly Keploy integrates with Gin and Redis.",
    link: "/docs/quickstart/samples-redis/#using-docker-compose-",
  },
  {
    title: "Gin + Redis",
    language: "Go",
    server: "Local",
    description:
      "A sample User Authentication app to demonstrate how seamlessly Keploy integrates with Gin and Redis.",
    link: "/docs/quickstart/samples-redis/#running-app-locally-on-linuxwsl-",
  },
  {
    title: "Mux + Postgres",
    language: "Go",
    server: "Docker",
    description:
      "A sample Product Catalog app to demonstrate how seamlessly Keploy integrates with Mux and Postgres.",
    link: "/docs/quickstart/samples-mux/#using-docker-compose-",
  },
  {
    title: "Mux + Postgres",
    language: "Go",
    server: "Local",
    description:
      "A sample Product Catalog app to demonstrate how seamlessly Keploy integrates with Mux and Postgres.",
    link: "/docs/quickstart/samples-mux/#running-app-locally-on-linuxwsl-",
  },
  {
    title: "Mux + Mysql",
    language: "Go",
    server: "Docker",
    description:
      "A sample URL Shortener app to demonstrate Keploy integration capabilities using Mux and MySQL.",
    link: "/docs/quickstart/samples-mysql/#using-docker-compose-",
  },
  {
    title: "Mux + Mysql",
    language: "Go",
    server: "Local",
    description:
      "A sample URL Shortener app to demonstrate Keploy integration capabilities using Mux and MySQL.",
    link: "/docs/quickstart/samples-mysql/#running-app-locally-on-linuxwsl-",
  },

  /*
  {
    title: "FastHttp + Postgres",
    language: "Go",
    server: "Docker",
    description:
      "A sample CRUD application to demonstrate how seamlessly Keploy integrates with FastHttp and Postgres.",
    link: "/docs/quickstart/samples-fasthttp/#using-docker-compose-",
  },
  */

  {
    title: "FastHttp + Postgres",
    language: "Go",
    server: "Local",
    description:
      "A sample CRUD application to demonstrate how seamlessly Keploy integrates with FastHttp and Postgres.",
    link: "/docs/quickstart/samples-fasthttp/#running-app-locally-on-linuxwsl-",
  },

  // rust list

  /*{
    title: "Rust + MongoDB (Graphql)",
    language: "Rust",
    server: "Local",
    description:
      "A sample app to demonstrate Keploy integration capabilities using Rust and MongoDB using GraphQl",
    link: "/docs/quickstart/samples-rust/",
  },

  {
    title: "Rust + MongoDB (REST)",
    language: "Rust",
    server: "Local",
    description:
      "A sample CRUD REST API app to demonstrate Keploy integration capabilities using Rust and MongoDB.",
    link: "/docs/quickstart/sample-rust-crud-mongo/",
  },
  */

  // c# list

  {
    title: ".Net + Postgres",
    language: "C#",
    server: "Local",
    description:
      "A sample User Authentication app to demonstrate how seamlessly Keploy integrates with .NET and PostgreSQL.",
    link: "/docs/quickstart/samples-csharp/",
  },

  // python list

  {
    title: "E-commerce Microservices",
    language: "Python",
    server: "Docker",
    description:
      "This guide walks you through testing an E-commerce microservices application using Keploy.",
    link: "/docs/quickstart/samples-microservices/",
  },
  {
    title: "Django + Postgres",
    language: "Python",
    server: "Docker",
    description:
      "A sample User CRUD app to demonstrate how seamlessly Keploy integrates with Django and PostgreSQL.",
    link: "/docs/quickstart/samples-django/#using-docker-compose-",
  },

  {
    title: "Django + Postgres",
    language: "Python",
    server: "Local",
    description:
      "A sample User CRUD app to demonstrate how seamlessly Keploy integrates with Django and PostgreSQL.",
    link: "/docs/quickstart/samples-django/#running-app-locally-on-linuxwsl-",
  },

  /*{
    title: "Flask + MongoDB",
    language: "Python",
    server: "Docker",
    description: "A Python Flask app connected to MongoDB running locally.",
    link: "/docs/quickstart/samples-flask/#using-docker-compose",
  },
  {
    title: "Flask + MongoDB",
    language: "Python",
    server: "Local",
    description: "A Python Flask app connected to MongoDB running locally.",
    link: "/docs/quickstart/samples-flask/#how-to-run-the-app-locally-on-linuxwsl-",
  },
*/
  {
    title: "FastAPI + Postgres",
    language: "Python",
    server: "Docker",
    description:
      "A sample User CRUD app to demonstrate how seamlessly Keploy integrates with FastAPI and PostgreSQL.",
    link: "/docs/quickstart/samples-fastapi/#using-docker-compose-",
  },

  {
    title: "FastAPI + Postgres",
    language: "Python",
    server: "Local",
    description:
      "A sample User CRUD app to demonstrate how seamlessly Keploy integrates with FastAPI and PostgreSQL.",
    link: "/docs/quickstart/samples-fastapi/#running-app-locally-on-linuxwsl-",
  },

  {
    title: "FastAPI + Twilio ",
    language: "Python",
    server: "Local",
    description:
      "A sample SMS Sending app to demonstrate how seamlessly Keploy integrates with FastAPI and Twilio.",
    link: "/docs/quickstart/samples-fastapi-twilio/#running-app-locally-on-linuxwsl-",
  },
  {
    title: "FastAPI + Twilio ",
    language: "Python",
    server: "Docker",
    description:
      "A sample SMS Sending app to demonstrate how seamlessly Keploy integrates with FastAPI and Twilio.",
    link: "/docs/quickstart/samples-fastapi-twilio/#using-docker-compose-",
  },

  {
    title: "Python + K8s",
    language: "Python",
    server: "Docker",
    description:
      "A sample guide demonstrating how to perform live traffic recording and replay in a Kubernetes environment.",
    link: "/docs/quickstart/k8s-proxy/",
  },

  /*{
    title: "Sanic + Mongo",
    language: "Python",
    server: "Local",
    description:
      "A sample Movie Management API app to demonstrate CRUD operations using Python's Sanic framework and MongoDB.",
    link: "/docs/quickstart/sanic-mongo/",
  },
*/
  {
    title: "Flask + Redis",
    language: "Python",
    server: "Docker",
    description:
      "A sample Student CRUD app to demonstrate how seamlessly Keploy integrates with Flask and Redis.",
    link: "/docs/quickstart/flask-redis/",
  },

  //Javascript list

  /*  {
      title: "BunJS + Mongo",
      language: "JS/TS",
      server: "Local",
      description:
        "A sample app to demonstrate Keploy integration capabilities using Bun.js and MongoDB.",
      link: "/docs/quickstart/samples-bunjs/",
    },
    */

  {
    title: "NextJS + Postgres",
    language: "JS/TS",
    server: "Local",
    description:
      "A sample app to demonstrate Keploy integration capabilities using NextJS and PostgreSQL with Drizzle ORM.",
    link: "/docs/quickstart/samples-nextjs/",
  },

  /*{
    title: "NodeJS - Express+ Mongoose",
    language: "JS/TS",
    server: "Docker",
    description:
      "A sample CRUD app to demonstrate how seamlessly Keploy integrates with Express and MongoDB.",
    link: "/docs/quickstart/samples-nodejs/#using-docker-compose-",
  },
  {
    title: "NodeJS - Express + Mongoose",
    language: "JS/TS",
    server: "Local",
    description:
      "A sample CRUD app to demonstrate how seamlessly Keploy integrates with Express and MongoDB.",
    link: "/docs/quickstart/samples-nodejs/#running-app-locally-on-linuxwsl-",
  },
  */

  {
    title: "NodeJS - JWT + Postgres",
    language: "JS/TS",
    server: "Docker",
    description:
      "A sample CRUD app to demonstrate Keploy integration built with Node, JWT, and PostgreSQL.",
    link: "/docs/quickstart/samples-node-jwt/#using-docker-compose-",
  },

  {
    title: "NodeJS - JWT + Postgres",
    language: "JS/TS",
    server: "Local",
    description:
      "A sample CRUD app to demonstrate Keploy integration built with Node, JWT, and PostgreSQL.",
    link: "/docs/quickstart/samples-node-jwt/#running-app-locally-on-linuxwsl-",
  },
  {
    title: "Express + Postgres + Prisma ",
    language: "JS/TS",
    server: "Docker",
    description:
      "A sample Task Management app to demonstrate how seamlessly Keploy integrates with Express, PostgreSQL, and Prisma ORM.",
    link: "/docs/quickstart/express-postgresql-prisma/#running-app-using-docker-compose-",
  },

  {
    title: "Express + Postgres + Prisma ",
    language: "JS/TS",
    server: "Local",
    description:
      "A sample Task Management app to demonstrate how seamlessly Keploy integrates with Express, PostgreSQL, and Prisma ORM.",
    link: "/docs/quickstart/express-postgresql-prisma/#running-app-locally-on-linuxwsl",
  },
  {
    title: "Typescript + Nhost ",
    language: "JS/TS",
    server: "Local",
    description:
      "A sample app to demonstrate Keploy integration capabilities using TypeScript and Nhost.",
    link: "/docs/quickstart/samples-typescript/#running-natively-on-linuxwsl",
  },
  {
    title: "Typescript + Nhost ",
    language: "JS/TS",
    server: "Docker",
    description:
      "A sample app to demonstrate Keploy integration capabilities using TypeScript and Nhost.",
    link: "/docs/quickstart/samples-typescript/#running-the-app-using-docker",
  },

  // Ruby list

  {
    title: "Sinatra + Postgres",
    language: "Ruby",
    server: "Docker",
    description:
      "A sample User CRUD app to demonstrate how seamlessly Keploy integrates with Sinatra and PostgreSQL.",
    link: "/docs/quickstart/samples-sinatra-postgres/#using-docker-compose-",
  },
  {
    title: "Sinatra + Postgres",
    language: "Ruby",
    server: "Local",
    description:
      "A sample User CRUD app to demonstrate how seamlessly Keploy integrates with Sinatra and PostgreSQL.",
    link: "/docs/quickstart/samples-sinatra-postgres/#running-app-locally-on-linuxwsl-",
  },
];

export default quickstarts;
