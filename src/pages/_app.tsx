import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import {Variables} from 'data/globalVariable.js'





export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
