import type { NextPage } from 'next';
import Head from 'next/head';
import withAuth from '../HOC'; // import the HOC
import MyComponent from 'components/accident-form';

const Dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Night assist accident</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        body {
          background-color: #E1ECFD;
          margin: 0;
         
        }
      `}</style>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <MyComponent />
      </main>
    </div>
  );
};

export default Dashboard;