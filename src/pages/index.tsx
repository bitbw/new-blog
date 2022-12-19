import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./index.module.css";

import Translate from "@docusaurus/Translate";

const description = "welcome to bitbw";

function HomepageHeader() {
  return (
    <div className="hero">
      <div className={styles.welcome_intro}>
        <h1 className={styles.hero_title}>
          <Link style={{ color: "var(--ifm-color-primary)" }} to="/blog">
            Welcome to my blog ~
          </Link>
        </h1>
        <p className="hero__subtitle">
          <Translate
            id="homepage.BlogTip"
            description="The homepage message to ask the user to visit my blog"
          >
            记录学习、留住生活，尝试坚持写一点东西，让每天过的慢一点。
          </Translate>
        </p>
      </div>
      <div className={styles.welcome_svg}>
        <img src={useBaseUrl("/img/home.svg")} />
      </div>
    </div>
  );
  // const {siteConfig} = useDocusaurusContext();
  // return (
  //   <header className={clsx('hero hero--primary', styles.heroBanner)}>
  //     <div className="container">
  //       <h1 className="hero__title">{siteConfig.title}</h1>
  //       <p className="hero__subtitle">{siteConfig.tagline}</p>
  //       <div className={styles.buttons}>
  //         <Link
  //           className="button button--secondary button--lg"
  //           to="/docs/intro">
  //           Docusaurus Tutorial - 5min ⏱️
  //         </Link>
  //       </div>
  //     </div>
  //   </header>
  // );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={description}>
      <HomepageHeader />
      <main>{/* <HomepageFeatures /> */}</main>
    </Layout>
  );
}
