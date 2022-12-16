import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './index.module.css'

const keywords =
  'vue js javaScript ts typeScript HTML css Sass less webpack git hexo  Node.js 算法 前端 小程序 技术个人博客'
const description = 'welcome to bitbw'

function HomepageHeader() {
  return (
    <div className="hero">
      <div className={styles.welcome_intro}>
        <h1 className={styles.hero_title}>
          {/* <span style={{ color: 'var(--ifm-color-primary)' }}>Meoo</span>    */}

          <Link style={{ color: 'var(--ifm-color-primary)' }} to="/blog">
            Welcome to my blog ~
          </Link>
        </h1>
        <p className="hero__subtitle">
          记录学习、留住生活，尝试坚持写一点东西，让每天过的慢一点。
        </p>
      </div>
      <div className={styles.welcome_svg}>
        <img src={useBaseUrl('/img/home.svg')} />
      </div>
    </div>
  )
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
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${siteConfig.title}`} description={description}>
      <Head>
        <meta name="keywords" content={keywords}></meta>
      </Head>
      <HomepageHeader />
      <main>{/* <HomepageFeatures /> */}</main>
    </Layout>
  )
}
