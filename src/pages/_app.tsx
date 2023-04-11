import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'

import mqtt from 'mqtt'
import axios from 'axios'




export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}







async function continuouslySubscribeAndPost() {
    const client = mqtt.connect('mqtt://localhost:1883');
  { 
    client.on('connect', () => {
        console.log('connected');
        client.subscribe('test', (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    //when a message is received
    //topic is the topic of the message, 
    client.on('message', (topic, message) => {
        console.log(message.toString());
        //post the message to the backend
        axios.post('http://localhost:3000/api/insert', {
            topic: topic.toString(),
            message: message.toString()
        })
        .then(response => {
            console.log(response);

        })
        .catch(error => {
            console.log(error);

        })
        //hello

          
    });


   
  }
}
continuouslySubscribeAndPost();