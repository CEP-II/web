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






import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik';
import Cookies from 'js-cookie';
import {Variables} from '../data/globalVariable';
import Image from 'next/image'
import mypic from '../pictures/logo.png'
import Link from 'next/link';
import Pagination from "react-js-pagination";


/*
 
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

*/
/*
interface Item {
  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
}


const PaginatedList = () => {
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    

    const response = await axios.get(Variables.API_URL + '/timestamps',{
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      }
    }).catch(error => { 
    Cookies.remove('token');
    window.location.href = '/';  
    });
    setData(response.data.timestamps);
    console.log(response.data.timestamps);
  };

  const handlePageChange = (pageNumber:any) => {
    setActivePage(pageNumber);
  };

  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
    setActivePage(1); // reset active page when search term changes
  };


  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  if (searchTerm) {
    // filter currentItems array by search term
    currentItems = currentItems.filter(item => item.citizen.toString().includes(searchTerm));
  }
  
  return (
    <div>
      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}></div>
         <div style={{position: 'absolute' , top: '25px', left: '10px'}}>
          <input type="text" placeholder="Search by ID" value={searchTerm} style={{ }} onChange={handleSearch} />
          </div>

          <div style={{position: 'absolute', top: '10px' ,left: '50%', transform: 'translateX(-50%)'  }}>
            <h1 style={{color: 'white', fontSize: '50px' }}>Night assist</h1>
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

       <div style={{position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', width: '100%'}}>
        {/* Render list items */}
        <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '0px',
          margin: '10px auto',
          maxWidth: '95%',
        }}
      >
        {/* Render list items */}
        {currentItems.map((item, index) => {
          const startTime = new Date(item.startTime);
          const endTime = new Date(item.endTime);
          const duration = Math.abs(endTime.getTime() - startTime.getTime());

          return (
            <div key={index}>
              <div>
                {" Citizen : "} {item.citizen}
              </div>
              <div>
                {" Start : "}{startTime.toISOString()}
              </div>
              <div>
                {" Duration : "}{duration}ms
              </div>
              <div>
                {"ID : "}{item._id}
              </div>
              <div>
                {" DeviceID : "} {item.deviceId}
              </div>
              <div>
                {"___________________________________"}
              </div>
            </div>
          );
        })}
      </div>
        <div style={{position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)'}}>
          {/* Render pagination component */}
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={data.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
       
      
    </div>
  );
};

export default PaginatedList;





//page=1&limit=10
//page=1&limit=10


//copy of copy
/*
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik';
import Cookies from 'js-cookie';
import {Variables} from '../data/globalVariable';
import Image from 'next/image'
import mypic from '../pictures/logo.png'
import Link from 'next/link';
import Pagination from "react-js-pagination";


/*
 
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

*/
interface Item {
  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
}


const PaginatedList = () => {
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get(`${Variables.API_URL}/timestamps?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).catch(error => {
      Cookies.remove('token');
      window.location.href = '/';
    });
    setData(response.data.timestamps);
    console.log(response.data.timestamps);
  };

  const handlePageChange = (pageNumber:any) => {
    setPage(pageNumber);
  };

  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
    setActivePage(1); // reset active page when search term changes
  };


  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  if (searchTerm) {
    // filter currentItems array by search term
    currentItems = currentItems.filter(item => item.citizen.toString().includes(searchTerm));
  }
  
  return (
    <div>
      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}></div>
         <div style={{position: 'absolute' , top: '25px', left: '10px'}}>
          <input type="text" placeholder="Search by ID" value={searchTerm} style={{ }} onChange={handleSearch} />
          </div>

          <div style={{position: 'absolute', top: '10px' ,left: '50%', transform: 'translateX(-50%)'  }}>
            <h1 style={{color: 'white', fontSize: '50px' }}>Night assist</h1>
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

       <div style={{position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', width: '100%'}}>
        {/* Render list items */}
        <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '0px',
          margin: '10px auto',
          maxWidth: '95%',
        }}
      >
        {/* Render list items */}
        {currentItems.map((item, index) => {
          const startTime = new Date(item.startTime);
          const endTime = new Date(item.endTime);
          const duration = Math.abs(endTime.getTime() - startTime.getTime());

          return (
            <div key={index}>
              <div>
                {" Citizen : "} {item.citizen}
              </div>
              <div>
                {" Start : "}{startTime.toISOString()}
              </div>
              <div>
                {" Duration : "}{duration}ms
              </div>
              <div>
                {"ID : "}{item._id}
              </div>
              <div>
                {" DeviceID : "} {item.deviceId}
              </div>
              <div>
                {"___________________________________"}
              </div>
            </div>
          );
        })}
      </div>
        <div style={{position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)'}}>
          {/* Render pagination component */}
          <Pagination
            activePage={page}
            itemsCountPerPage={limit}
            totalItemsCount={data.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
       
      
    </div>
  );
};

export default PaginatedList;





//page=1&limit=10
//page=1&