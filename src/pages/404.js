import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Custom404() {
  return (
    <Layout title="404 - Not Found">
      <main className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.notFoundTitle}>Oops! 404</h1>
          <h2 className={styles.notFoundSubtitle}>Not Found...</h2>

          <p className={styles.notFoundDescription}>
            Looks like you've wandered off the beaten path. Our team is working
            to get you back on track and find what you're looking for.
          </p>

          <div className={styles.notFoundActions}>
            <Link className={styles.notFoundPrimaryBtn} to="/">
              Back To Home
            </Link>

            <button
              className={styles.notFoundSecondaryBtn}
              onClick={() => window.history.back()}
            >
              Back to Previous Page
            </button>
          </div>
        </div>

        <div className={styles.notFoundImageWrapper}>
            <img
                src={useBaseUrl("/img/keploy-logo-dark.svg")}
                alt="Keploy logo"
                className={styles.notFoundLogo}
            />
        </div>
      </main>
    </Layout>
  );
}
