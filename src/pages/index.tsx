import type { NextPage } from 'next'
import Head from 'next/head'
import LoginForm from 'components/login-form'
import styles from '/components/stdColors.module.css'




const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Night assist log in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        body {
          background-color: #E1ECFD;
          margin: 0;
         
        }
      `}</style>
      <main>
        <LoginForm />
      </main>
    </div>
  );
};

export default Home;
