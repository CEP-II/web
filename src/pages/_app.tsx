import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import {Variables} from 'data/globalVariable.js'





export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}


/*


const mqtt = require('mqtt');


while(true)
{

const client = mqtt.connect('mqtt://:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker!');
  client.subscribe('test');
  

});

client.on('message', (topic, message) => {
    console.log(message.toString());

   
   //publish to api 
    
    axios.post(Variables.API_URL + '/timestamps', {
    })
    .then(response => {console.log(response.data.message)})
    .catch(error => {"error is" + console.error(error);});
  
});



}




const mqtt = require('mqtt');
const axios = require('axios');


function connectMqtt() {
  const client = mqtt.connect('mqtt://broker.emqx.io:8083');

  client.on('connect', () => {
    console.log('Connected to MQTT broker!');
    client.subscribe('test', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Subscribed to test topic!');
    });
  });

  client.on('message', (topic, message) => {
    console.log(message.toString());

    //publish to api
    axios.post(Variables.API_URL + '/timestamps', {})
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error("Error is: ", error);
      });
  });

  client.on('error', (err) => {
    console.error("MQTT Error: ", err);
    setTimeout(connectMqtt, 60000); // retry connection every minute
  });
}

connectMqtt();


const axios = require('axios');

axios.post(Variables.API_URL + '/timestamps', {
  startTime: Date.now(),
  endTime: Date.now(),
  deviceId: "pi1234",
})
  .then(response => {
    console.log(response.data.message);
  })
  .catch(error => {
    console.error("Error is: ", error);
  });*/
