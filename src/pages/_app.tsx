import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import {Variables} from 'data/globalVariable.js'





export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}





const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker!');
  client.subscribe('test');
});

client.on('message', (topic, message) => {
    console.log(message.toString());

   
   //publish to api 
    /*
    axios.post(Variables.API_URL + '/timestamps', {
        message
    })
    .then(function (response) {
        console.log(response);
    }
    )
    .catch(function (error) {
        console.log(error);
  }
  
  );*/
});



