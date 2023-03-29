import type { NextPage } from 'next'
import Head from 'next/head'
import LoginForm from 'components/login-form'

// This is the page that is shown when you go to localhost:3000
const Home: NextPage = () => {
  return (
    
    <div>
      <Head>
        {/*create a box for an image on top of the form*/}
        <title>Login Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <LoginForm/>
      </main>
    </div>
  )
}

export default Home
