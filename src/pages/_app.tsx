import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'

import mqtt from 'mqtt'
import axios from 'axios'




export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}






/*
async function continuouslySubscribeAndPost() {
    //if already connected, dont connect again
    
        

    const client = mqtt.connect('mqtt://192.168.0.149:1883');
    { 
        client.on('connect', () => {
            console.log('connected XD');
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
        });   
    }
}
continuouslySubscribeAndPost();*/

/*

//function to test the mqtt connection
async function testMqttConnection() {

    const client = mqtt.connect('mqtt://test.mosquitto.org');

    client.on('connect', function() {
    console.log('Connected to MQTT broker');
    client.subscribe('test/topic', function(err) {
        if (err) {
        console.log('Error subscribing to topic:', err);
        } else {
        console.log('Subscribed to topic');
        }
    });
    });

    client.on('message', function(topic, message) {
    console.log('Message received:', message.toString());
    }   
    );

}

testMqttConnection();

*/

