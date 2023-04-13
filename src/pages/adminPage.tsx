import type { NextPage } from 'next';
import Head from 'next/head';
import AdminForm from 'components/admin-form';


const Dashboard: NextPage = () => {
    return (
        <div>
        <Head>
            <title>Dashboard</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="vh-100 d-flex justify-content-center align-items-center">
            <AdminForm />
        </main>
        </div>
    );
    };
    