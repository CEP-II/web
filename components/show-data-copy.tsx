import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik';
import Cookies from 'js-cookie';
import {Variables} from '../data/globalVariable';
import Image from 'next/image'
import mypic from '../pictures/logo.png'




 
interface Values{
  citizenId: string;
}

interface Timestamp {
  id: number;
  startTime: string;
  endTime: string;
  citizen: string;
}


function ShowData() 
{

  //the next line is smart way of storing data in next.js/react.
  //it is a hook that stores the data in the state of the component
  //it gives a function to update the state(data) and a variable to get the data
  
const [timeStamps, setTimeStamps] = useState<any[]>([]);

  //var timeStamps;

  useEffect(() => {  
    function fetchData() 
    {
      axios.get(Variables.API_URL + '/timestamps?page=1&4', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      }).then(response => 
        {
          
          //set the data in the state
          setTimeStamps(timeStamps => [...timeStamps, response.data.timestamps]);
          
          


        }).catch(error => {
        console.error("is error" + error);
      });
    }
  
  
  fetchData();
  
  }, []);

  //this function will rewrite and sort the data in response.data
  //and it will return something that can be displayed in the browser
  //can be also be called with a citezen id to only show that citezen
  
  
 

//
function showData(citezenID?: string)
  {
    //create a new array to store the data
    var data = [];

    if(citezenID)
    {
      //only add the data with the correct citezen id
      for (var i = 0; i < timeStamps.length; i++)
      {
        if(timeStamps[i].citizen == citezenID)
        {
          //create a string to store the data

          var str = `id: ${timeStamps[i].id}, startTime: ${timeStamps[i].startTime}, endTime: ${timeStamps[i].endTime}, citizen: ${timeStamps[i].citizen}`;
          //add the string to the array
          data.push(str);
        }

      }
      return data;
    }
    else
    {

    
      //loop through the data and rewrite it
      for (var i = 0; i < timeStamps.length; i++)
      {
        
        //create a new object to store the data
        for (var i = 0; i < timeStamps.length; i++) {
          //create a string to store the data
         
          var str = `id: ${timeStamps[i][i]._id}, startTime: ${timeStamps[0][i].startTime}, endTime: ${timeStamps[0][i].endTime}, citizen: ${timeStamps[0][i].citizen}`;
          //add the string to the array
          data.push(str);
        }
    
      }
      //return the array
      return data;
    }
  }
  showData();



  


  //this function will handle the submit of the form
  const handleSubmit = ( values: Values , { setSubmitting }: FormikHelpers<Values>) =>{
    showData(values.citizenId);
  }

  return (
    <div style={{backgroundColor: '#ABE7EB'}}>

        <div style={{position: 'absolute', top: '120px', left: '10px'}}>
          {showData().map((item, index) => (
              <div key={index}>
                <p>{item}</p>
              </div>
          ))}
        </div>
      
      


      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}>
          
   
          <Formik
                initialValues={{
                  citizenId: '',
                }}
                onSubmit={handleSubmit}
              >
            {({ isSubmitting }) => (
              <Form>
                <div style={{position: 'absolute', top: ' 10px', left: '10 px' , padding: '10px', width: '200px'}}>
                  <Field class="form-control" id="citizenId" name="citizenId" placeholder="citizenId" type="text" style={{background: 'white',marginLeft: '5px' }}/>
                    <div style={{position: 'absolute', top: '10px', left: '200px'}}>
                      <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ fontSize: '12px', padding: '10px 10px', marginLeft: '5px'}}>Search</button>
                    </div>
                </div>

              </Form>
            )}
          </Formik>

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
      </div> 

    </div>
  );

  }





export default ShowData;






