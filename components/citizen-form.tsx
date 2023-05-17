import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';

interface timeStamp {
  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
  deviceId: string;
}

const MyComponent = () => {

  //timestamp


  const [timeStamps, setTimeStamps] = useState<timeStamp[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<timeStamp | null>(null);
  const limit = 20;

  useEffect(() => {
    getTimeStamps(activePage);
  }, [activePage]);

  const getTimeStamps = async (pageNumber: number) => {
    try {
      const response = await axios.get(`${Variables.API_URL}/timestamps/by-citizen/${Cookies.get('citizenId')}?page=${pageNumber}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setTimeStamps(response.data.timestamps);
      setTotalPages(response.data.totalPages);
     

    } catch (error) {
   
      
    }
  };

  const handleItemClick = (index: number, values: timeStamp) => {
    setSelectedItemIndex(index);
    setSelectedItem(values);
  };

  const resetItemClicked = () => {
    setSelectedItemIndex(null);
    setSelectedItem(null);
  };

  //accidents
  const [accidents, setAccidents] = useState([]);
 


  useEffect(() => {
    getAccidents();
  }, []);

  const getAccidents = async () => {
    console.log(Cookies.get('citizenId'));
    try {
      const response = await axios.get(`${Variables.API_URL}/accident/by-citizen/${Cookies.get('citizenId')}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      
      setAccidents(response.data.accidents);
    
      console.log(response.data.accidents);
    } catch (error) {
      console.log(error);
    }
  };





 


  return (
    <div>
      <div  style={{position: 'absolute', top: '0%', left: '0%', width: '100%',height: '12%',  background: '#1E88E4'}}>
        <h1 style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Night Assist</h1>
        <h3 style={{textAlign: 'center', color: 'white', fontSize:'100%'}}>Your Guide through the night</h3>
      

      {/* button to log out */}
      <button className="btn btn-primary" style={{position: 'absolute', top: '30%', right: '3%', height: '40%'}} onClick={() => {
        Cookies.remove('token');
        Cookies.remove('citizenId');
        window.location.href = '/';
      }}>Log out</button>
      </div>

     
  
          <div style={{ position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)', width: '100%' , height: '90%'}}>
            {/* Render list items */}
            <h1 style={{textAlign: 'center', color: 'black', fontWeight: 'bold'}}>Your Timestamps</h1>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '10px',
                margin: '10px auto',
                maxWidth: '95%',
              }}
            >
              {/* Render list items */}
              {timeStamps.map((item, index) => {
                const startTime = new Date(item.startTime);
                const endTime = new Date(item.endTime);
                const duration = Math.abs(endTime.getTime() - startTime.getTime());
      
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '2%',
                      borderRadius: '10px',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer',
                      background: selectedItemIndex === index ? '#dae1e3' : '#fff',
                    }}
                    onClick={() => {
                      handleItemClick(index, item);
                    }}
                  >
                
                    <p style={{ fontSize: '14px', margin: '0px' }}>Start time: {startTime.toLocaleString()}</p>
                    <p style={{ fontSize: '14px', margin: '0px' }}>End time: {endTime.toLocaleString()}</p>
                    <p style={{ fontSize: '14px', margin: '0px' }}>Duration: {duration} ms</p>
                    <p style={{ fontSize: '14px', margin: '0px' }}>Device ID: {item.deviceId}</p>
                    <p style={{ fontSize: '14px', margin: '0px' }}>ID: {item._id}</p>
                  </div>
                );
                })}
                
              
            </div>
      
      
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination
                activePage={activePage}
                itemsCountPerPage={limit}
                totalItemsCount={totalPages * limit}
                pageRangeDisplayed={10}
                onChange={(pageNumber) => {setActivePage(pageNumber), resetItemClicked()}}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          </div>


          <div style={{ position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', width: '100%' , height: '90%'}}>
            {/* Render list items */}
            <h1 style={{textAlign: 'center', color: 'black', fontWeight: 'bold'}}>Your Accidents</h1>
            {/* if no icidents write no icidents */}
            {accidents.length === 0 && <h2 style={{textAlign: 'center', color: 'black'}}>No Accidents</h2>}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '10px',
                margin: '10px auto',
                maxWidth: '95%',
              }}
            >
              {/* Render list items */}
              {accidents.map((item, index) => {
           const alarmTime = new Date(item.alarmTime);

          return (
            <div key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2%',
              
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
              background: selectedItemIndex === index ? '#dae1e3' : '#fff',
            
            }}
              onClick={() => {handleItemClick(index, item)}}
            
            >
              <p style={{ fontSize: '14px', margin: '0px' }}>Time of Accidents: {alarmTime.toLocaleString()}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Possition: {item.positionId.toLocaleString()}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Device ID: {item.deviceId}</p>
              
            </div>
          );
        })}
            </div>
      
      
      
          </div>
    </div>
  );
  
  };
export default MyComponent;
  
  

