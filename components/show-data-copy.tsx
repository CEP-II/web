import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import Cookies from 'js-cookie';
import {Variables} from '../data/globalVariable';

function ShowData() {

  //the next line is smart way of storing data in next.js/react.
  //it is a hook that stores the data in the state of the component
  //it gives a function to update the state(data) and a variable to get the data
  
const [timeStamps, setTimeStamps] = useState([]);

  //var timeStamps;

  useEffect(() => {  
    function fetchData() 
    {
      axios.get(Variables.API_URL + '/timestamps?page=1&2', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      }).then(response => 
        {
          //the data as an array of objects
          //setTimeStamps(response.data)

       

          console.log("this is the response");

          console.log(response.data.timestamps);

          console.log("this is responce 0" );
          
          console.log(response.data.timestamps[0].id);
          
          console.log("this is responce 0 to jsonstringfy" );
          //go from json to tostring
          console.log(JSON.stringify(response.data.timestamps[0]));

          setTimeStamps(response.data.timestamps);

        }).catch(error => {
        console.error("is error" + error);
      });
    }
  
  fetchData();
  
  }, []);

  //this function will rewrite and sort the data in response.data
  //and it will return something that can be displayed in the browser
  //can be also be called with a citezen id to only show that citezen
  
  


  
  function showData()
  {
    //create a new array to store the data
    var data = [];
    //loop through the data and rewrite it
    for (var i = 0; i < timeStamps.length; i++)
    {
      
      //create a new object to store the data
      for (var i = 0; i < timeStamps.length; i++) {
        //create a string to store the data
        var str = `id: ${timeStamps[i].id}, startTime: ${timeStamps[i].startTime}, endTime: ${timeStamps[i].endTime}, citizen: ${timeStamps[i].citizen}`;
        //add the string to the array
        data.push(str);
      }
   
    }
    //return the array
    return data;
  }

  showData()

  return (
    <div>

      <h1>show data</h1>
      <div>
        {showData().map((item, index) => (
          <div key={index}>
            <p>{item}</p>
          </div>
        ))}
      </div>

      
      <div style={{position: 'absolute' , top: '10px' , left: '10px', padding: '10px'}}>
          <Field id="citizenId" name="citizenId" placeholder="citizenId" type="text" />

          

      </div>

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






