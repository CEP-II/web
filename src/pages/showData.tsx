import type { NextPage } from 'next';
import Head from 'next/head';
import withAuth from '../HOC'; // import the HOC
import ShowData from 'components/show-data';
import styles from '/components/stdColors.module.css'



const Dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Night assist data</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        body {
          background-color: #E1ECFD;
          margin: 0;
          
       
        }
      `}</style>
      <main >
        <ShowData />
      </main>
    </div>
  );
};

export default Dashboard;



