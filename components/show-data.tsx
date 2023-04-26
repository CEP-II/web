import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import Cookies from 'js-cookie';

import {Variables} from '../data/globalVariable';







function ShowData() {
  const [timeStamps, setTimeStamps] = useState([]);

  //write the timer on the cookie in console
  //how much time it has left
  console.log(Cookies.get('token'));

  useEffect(() => {

/*
    async function fetchData() {
      try {
        const response = await axios.get(Variables.API_URL + '/timestamps', {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          }
        })

          setTimeStamps(response.data.timestamps);
        } catch (error) {
          console.error(error);
        }
      }*/

   
    function fetchData() {

      axios.get(Variables.API_URL + '/timestamps', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      }).then(response => {
        if (response.data.valid){
          //set the token cookie to expire in 10 minutes
          Cookies.set('token', response.data.token, { expires: 1/24/6 });
      }
        setTimeStamps(response.data.timestamps);
      }).catch(error => {
        console.error(error);
      });
    }

      
   
  fetchData();
  


  }, []);



   //make a not async function that feches the data


  return (
    <div>

   
        
     
      

      {timeStamps.map((timeStamp) => (
        <div key={timeStamp._id}>
          <p>Start: {timeStamp.start}</p>
          <p>End: {timeStamp.end}</p>
          <p>Citizen: {timeStamp.citizen ? timeStamp.citizen.name : 'No citizen'}</p>

          
       
       
        </div>
      ))}



      <div style={{position: 'absolute', top: '10px', right: '10px', padding: '10px'}}>
       
        <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
          window.location.href = '/adminPage';
        }}>Admin</button>

        <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px' }} onClick={() => {
          Cookies.remove('token');
          window.location.href = '/';
        }}>Log out</button>
      
      
      </div>
      

    </div>
  );
}

export default ShowData;






