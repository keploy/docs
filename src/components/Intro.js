import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

function Languages() {
  return (
    <div className="rounded-lg bg-[color:var(--ifm-card-background-color)] p-5 shadow transition hover:shadow-lg hover:shadow-[color:var(--ifm-card-shadow-color)]">
      <div className="flex items-center space-x-4">
        <svg
          width="16"
          className="mb-4 h-10 w-10 rounded-lg bg-[color:var(--ifm-color)] p-2 text-[color:var(--ifm-background-color)]"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7538 3.95126C11.9211 3.87442 12.0617 3.75645 12.16 3.61054C12.2583 3.46463 12.3103 3.29653 12.3103 3.12505C12.3103 2.95357 12.2583 2.78547 12.16 2.63956C12.0617 2.49365 11.9211 2.37567 11.7538 2.29884L6.95069 0.0974684C6.81075 0.0333693 6.65646 0 6.50002 0C6.34358 0 6.18929 0.0333693 6.04935 0.0974684L1.2462 2.29884C1.07895 2.37567 0.938326 2.49365 0.840051 2.63956C0.741776 2.78547 0.689727 2.95357 0.689727 3.12505C0.689727 3.29653 0.741776 3.46463 0.840051 3.61054C0.938326 3.75645 1.07895 3.87442 1.2462 3.95126L6.04935 6.15263C6.18929 6.21673 6.34358 6.2501 6.50002 6.2501C6.65646 6.2501 6.81075 6.21673 6.95069 6.15263L11.7538 3.95126Z"
            fill="currentColor"
          />
          <path
            d="M7.07848 13.3891C6.99477 13.2516 6.95078 13.0968 6.95069 12.9393V7.6124C6.95079 7.44081 7.003 7.27264 7.10147 7.12672C7.19994 6.9808 7.34079 6.86289 7.50824 6.78619L11.5411 4.93785C11.6948 4.86746 11.8655 4.83423 12.0371 4.84132C12.2088 4.8484 12.3756 4.89557 12.5217 4.97833C12.6679 5.0611 12.7885 5.17673 12.8722 5.31424C12.9559 5.45175 12.9999 5.60659 13 5.76406V11.091C12.9999 11.2626 12.9477 11.4307 12.8492 11.5766C12.7507 11.7226 12.6099 11.8405 12.4425 11.9172L8.40958 13.7655C8.25591 13.8359 8.08516 13.8691 7.91355 13.862C7.74193 13.855 7.57513 13.8078 7.42898 13.725C7.28284 13.6423 7.16218 13.5266 7.07848 13.3891Z"
            fill="currentColor"
          />
          <path
            d="M0.96287 4.97833C1.13449 4.97125 1.30523 5.00448 1.45891 5.07487L5.49178 6.9232C5.65922 6.9999 5.80007 7.11781 5.89854 7.26374C5.99701 7.40966 6.04922 7.57783 6.04932 7.74941V13.0763C6.04923 13.2338 6.00524 13.3886 5.92154 13.5261C5.83783 13.6637 5.71718 13.7793 5.57103 13.862C5.42488 13.9448 5.25809 13.992 5.08647 13.9991C4.91485 14.0061 4.7441 13.9729 4.59043 13.9025L0.55756 12.0542C0.390115 11.9775 0.249269 11.8596 0.150797 11.7137C0.0523254 11.5677 0.000115828 11.3996 1.58649e-05 11.228V5.90107C0.000107582 5.7436 0.044094 5.58876 0.127801 5.45125C0.211509 5.31374 0.332161 5.19812 0.478309 5.11535C0.624457 5.03258 0.791253 4.98542 0.96287 4.97833Z"
            fill="currentColor"
          />
        </svg>
        <h2 className="mb-4 text-xl font-semibold">Languages</h2>
      </div>
      <ul className="grid grid-cols-3 gap-3  md:grid-cols-3 lg:gap-5">
        {/* <ul className="grid grid-cols-2 gap-6 xl:gap-8"> */}
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            className="flex flex-col items-center space-x-3 p-6 hover:underline"
            to={useBaseUrl("/quickstart/samples-gin")}
          >
            <img
              className="h-8 w-8"
              src="/docs/img/golang.svg"
              alt="Go lang logo"
            />
            <p className="font-semibold">Go</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            className="flex flex-col items-center space-x-3 p-6 hover:underline"
            to={useBaseUrl("/quickstart/samples-java")}
          >
            <img
              className="h-8 w-8 transition hover:scale-110"
              src="/docs/img/java.svg"
              alt="Java logo"
            />
            <p className="font-semibold">Java</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            className="flex flex-col items-center space-x-3 p-6 hover:underline"
            to={useBaseUrl("/quickstart/samples-django")}
          >
            <img
              className="h-8 w-8"
              src="/docs/img/python.svg"
              alt="Python logo"
            />
            <p className="font-semibold">Python</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            className="flex flex-col items-center space-x-3 p-6 hover:underline"
            to={useBaseUrl("/quickstart/samples-nodejs")}
          >
            <img
              className="h-8 w-8 transition hover:scale-110"
              src="/docs/img/javascript-logo.svg"
              alt="Javascript logo"
            />
            <p className="font-semibold">Javascript</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            className="flex flex-col items-center space-x-3 p-6 hover:underline"
            to={useBaseUrl("/quickstart/samples-rust")}
          >
            <img
              className="h-8 w-8 transition hover:scale-110"
              src="/docs/img/rust-logo.svg"
              alt="Javascript logo"
            />
            <p className="font-semibold">Rust</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            className="flex flex-col items-center space-x-3 p-6 hover:underline"
            to={useBaseUrl("/quickstart/samples-csharp")}
          >
            <img
              className="h-8 w-8 transition hover:scale-110"
              src="/docs/img/csharp-logo.svg"
              alt="Javascript logo"
            />
            <p className="font-semibold">CSharp</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}

function Frameworks() {
  return (
    <div className="flex flex-col rounded-lg bg-[color:var(--ifm-card-background-color)] p-5 shadow transition hover:shadow-lg hover:shadow-[color:var(--ifm-card-shadow-color)]">
      <div className="flex items-center space-x-4">
        <svg
          className="mb-4 h-10 w-10 rounded-lg bg-[color:var(--ifm-color)] p-2 text-[color:var(--ifm-background-color)]"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H14C14.5304 0 15.0391 0.210714 15.4142 0.585786C15.7893 0.960859 16 1.46957 16 2V4C16 4.53043 15.7893 5.03914 15.4142 5.41421C15.0391 5.78929 14.5304 6 14 6H2C1.46957 6 0.960859 5.78929 0.585786 5.41421C0.210714 5.03914 0 4.53043 0 4V2ZM14 3C14 3.26522 13.8946 3.51957 13.7071 3.70711C13.5196 3.89464 13.2652 4 13 4C12.7348 4 12.4804 3.89464 12.2929 3.70711C12.1054 3.51957 12 3.26522 12 3C12 2.73478 12.1054 2.48043 12.2929 2.29289C12.4804 2.10536 12.7348 2 13 2C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3ZM0 9C0 8.46957 0.210714 7.96086 0.585786 7.58579C0.960859 7.21071 1.46957 7 2 7H14C14.5304 7 15.0391 7.21071 15.4142 7.58579C15.7893 7.96086 16 8.46957 16 9V11C16 11.5304 15.7893 12.0391 15.4142 12.4142C15.0391 12.7893 14.5304 13 14 13H2C1.46957 13 0.960859 12.7893 0.585786 12.4142C0.210714 12.0391 0 11.5304 0 11V9ZM14 10C14 10.2652 13.8946 10.5196 13.7071 10.7071C13.5196 10.8946 13.2652 11 13 11C12.7348 11 12.4804 10.8946 12.2929 10.7071C12.1054 10.5196 12 10.2652 12 10C12 9.73478 12.1054 9.48043 12.2929 9.29289C12.4804 9.10536 12.7348 9 13 9C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10Z"
            fill="currentColor"
          />
        </svg>
        <h2 className="mb-4 text-xl font-semibold">Dependencies Support</h2>
      </div>
      <ul className="grid grid-cols-3 gap-3  lg:gap-5">
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            to={useBaseUrl("/dependencies/mongo")}
            className="flex flex-col items-center justify-center space-y-1 p-6 text-center hover:underline"
          >
            <img
              className="h-8 w-8"
              src="/docs/img/mongodb-logo.svg"
              alt="Docker logo"
            />
            <p className="font-semibold">MongoDB</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            to={useBaseUrl("/dependencies/http")}
            className="flex flex-col items-center justify-center space-y-1 p-6 text-center hover:underline"
          >
            <img
              className="h-8 w-8"
              src="/docs/img/http-logo.svg"
              alt="HTTP logo"
            />
            <p className="font-semibold">HTTP</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            to={useBaseUrl("/dependencies/postgres")}
            className="flex flex-col items-center justify-center space-y-1 p-6 text-center hover:underline"
          >
            <img
              className="h-8 w-8"
              src="/docs/img/postgres-logo.svg"
              alt="PostgresSQL logo"
            />
            <p className="font-semibold">PostgresSQL</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link
            to={useBaseUrl("/dependencies/redis")}
            className="flex flex-col items-center justify-center space-y-1 p-6 text-center "
          >
            <img
              className="h-8 w-8"
              src="/docs/img/redis-logo.svg"
              alt="Redis logo"
            />
            <p className="font-semibold">Redis</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link className="flex flex-col items-center justify-center space-y-1 p-6 text-center ">
            <img
              className="h-8 w-8"
              src="/docs/img/mysql-logo.svg"
              alt="MySQL logo"
            />
            <p className="font-semibold">MySQL</p>
          </Link>
        </li>
        <li className="mt-5 flex flex-col space-y-3 text-lg">
          <Link className="flex flex-col items-center justify-center space-y-1 p-6 text-center ">
            <img
              className="h-8 w-8"
              src="/docs/img/dynamodb-logo.svg"
              alt="DynamoDB logo"
            />
            <p className="font-semibold">DynamoDB</p>
          </Link>
        </li>
        {/*<li className="mt-5 flex flex-col space-y-3 text-lg">*/}
        {/*  <Link className="flex flex-col items-center justify-center space-y-1 p-6 text-center ">*/}
        {/*    <img*/}
        {/*      className="h-8 w-8"*/}
        {/*      src="/docs/img/elastic-logo.svg"*/}
        {/*      alt="Elastic logo"*/}
        {/*    />*/}
        {/*    <p className="font-semibold">Elastic</p>*/}
        {/*  </Link>*/}
        {/*</li>*/}
      </ul>
    </div>
  );
}

export const Intro = () => {
  return (
    <section className="mb-4 mt-12">
      <h2 className="mb-4 text-2xl font-semibold tracking-wide md:text-3xl">
        Supports
      </h2>
      <div className="grid gap-6  sm:grid-cols-2 xl:gap-8">
        <Languages />
        <Frameworks />
      </div>
    </section>
  );
};
