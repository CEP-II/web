import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import Cookies from 'js-cookie';

import {Variables} from '../data/globalVariable';







function ShowData() {
  
  const [timeStamps, setTimeStamps] = useState([]);


  useEffect(() => {  
    function fetchData() 
    {

      console.log("fetching data");

      console.log(Cookies.get('token'));




      axios.get(Variables.API_URL + '/timestamps?page=1&2', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      }).then(response => 
        {
          /*
          if (response.data.valid)
          {
            //set the token cookie to expire in 10 minutes
            Cookies.set('token', response.data.token, { expires: 1/24/6 });
          }*/
          console.log("response" + response.data);
          
          for (var i = 0; i < response.data.length; i++)
          {
            console.log(response.data[i]);
            setTimeStamps(response.data[i])
          }

        }).catch(error => {
        console.error("is error" + error);
      });

      console.log("done fetching data");
    }

      
  fetchData();
  
  }, []);



   //make a not async function that feches the data


  return (
    <div>
      {timeStamps.map
        ((timeStamp) => (
          <div key={timeStamp._id}>
            <p>Start: {timeStamp.start}</p>
            <p>End: {timeStamp.end}</p>
            <p>Citizen: {timeStamp.citizen ? timeStamp.citizen.name : 'No citizen'}</p>

          
       
       
           </div>
        ))
      }



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






