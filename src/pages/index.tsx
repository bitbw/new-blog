import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

const posts = [
  ["2026.09.08", "Deploying from the terminal with licloud-cli", "/blog/2026/09/08/licloud-cli-deploy/"],
  ["2026.09.03", "DeepSeek Harness meets EPT", "/blog/2026/09/03/deepseek-harness-ept/"],
  ["2026.08.31", "Ponytail: less code, fewer assumptions", "/blog/2026/08/31/ponytail/"],
];

export default function Home(): JSX.Element {
  return (
    <Layout title="Bitbw" description="Engineering notes by Bowen Zhang.">
      <main className={styles.home}>
        <div className={styles.gridGlow} aria-hidden="true" />
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>BOWEN ZHANG / ENGINEERING NOTES</p>
            <h1>Building tools<br />for <em>real work.</em></h1>
            <p className={styles.lead}>Personal notes on AI tooling, full-stack systems, vehicle software and the small projects that make daily work better.</p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} to="/blog">Read the archive <span>↗</span></Link>
              <Link className={styles.secondaryAction} to="/docs/intro">Browse notes</Link>
            </div>
          </div>
          <div className={styles.heroMark} aria-hidden="true"><span>01</span><i /><b>build<br />ship<br />learn</b></div>
        </section>
        <section className={styles.indexSection}>
          <div className={styles.sectionHeading}><span>01 / RECENT WRITING</span><Link to="/blog">View all ↗</Link></div>
          <div className={styles.postList}>{posts.map(([date, title, to]) => <Link className={styles.postRow} key={to} to={to}><time>{date}</time><strong>{title}</strong><span>↗</span></Link>)}</div>
        </section>
        <section className={styles.signalSection}>
          <div><span className={styles.sectionNumber}>02</span><h2>From repeatable work<br />to <em>reusable systems.</em></h2></div>
          <p>Skills, scripts and projects are all part of the same record: find the friction, make it repeatable, then write down what survived contact with reality.</p>
        </section>
      </main>
    </Layout>
  );
}

