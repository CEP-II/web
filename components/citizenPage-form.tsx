import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';
import styles from '../components/stdColors.module.css'


interface timeStamp {
  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
  deviceId: string;
}

const MyComponent = () => {



  //hooks for holding variables
  const [timeStamps, setTimeStamps] = useState<timeStamp[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<timeStamp | null>(null);
  const [limit, setLimit] = useState<number>(12);

  

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
    //set hooks for selected item
    setSelectedItemIndex(index);
    setSelectedItem(values);
  };

  const resetItemClicked = () => {
    //reset hooks for selected item
    setSelectedItemIndex(null);
    setSelectedItem(null);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //set hooks for limit
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setActivePage(1);
    
  
   

  };

  //accidents
  const [accidents, setAccidents] = useState([]);

  useEffect(() => {
    getTimeStamps(activePage);
  }, [activePage, limit]); // Add 'limit' as a dependency
  
  useEffect(() => {
    getTimeStamps(activePage); // Initial data fetch
  }, []);
 


  useEffect(() => {
    getAccidents();
  }, []);

  const getAccidents = async () => {
    console.log(Cookies.get('citizenId'));
    //get all accidents by citizen id
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
 

 <div className={styles.color_topbar} style={{ position: 'absolute', top: '0%', left: '0%', width: '100%', height: 'auto' }}>
  <h1 style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '3vw' }}>Night Assist</h1>
  <h3 style={{ textAlign: 'center', color: 'white', fontSize: '2vw' }}>Your Guide through the night</h3>

  {/* button to log out */}
  <button className="btn btn-primary" style={{ position: 'absolute',  top: '50%',transform: 'translateY(-50%)', right: '3%', fontSize: '1vw' }} onClick={() => {
    Cookies.remove('token');
    Cookies.remove('citizenId');
    window.location.href = '/';
  }}>Log out</button>

<div style={{position: 'absolute', top: '50%',transform: 'translateY(-50%)', left: '10px'}}>




<select className="btn"id="limitDropdown" style={{fontSize:'1.5vw', color:'white'}} value={limit} onChange={handleLimitChange}>

<option value="10">10</option>
<option value="15">15</option>
<option value="20">20</option>
<option value="30">30</option>
<option value="50">50</option>
</select>
</div>


</div>


     
            
<div className="flex flex-col" style={{ position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)', width: '100%' , height: '100%'}}>
            {/* Render list items */}
            <div className="bg-gray.200">
            <h1 style={{textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '2vw'}}>Your Timestamps</h1>
            <div
  style={{
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${25}ch, 1fr))`,
    gap: '10px',
    margin: '2%',
    maxWidth: '95%',
    overflow: 'auto',
    fontSize: '1.2rem',
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

          background: selectedItemIndex === index ? '#dae1e3' : '#fff',
          cursor: 'pointer',
          
          minWidth: 'fit-content', // Set the minWidth property to fit the content width
        }}
        onClick={() => handleItemClick(index, item)}
    
      >
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', whiteSpace: 'nowrap' }}>Citizen: {typeof item.citizen === 'object' ? item.citizen.name : findCitizen(item.citizen)}</p>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', whiteSpace: 'nowrap' }}>Start time: {startTime.toLocaleString()}</p>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', whiteSpace: 'nowrap' }}>Position: {item.positionId}</p>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', whiteSpace: 'nowrap' }}>Duration: {duration} ms</p>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', whiteSpace: 'nowrap' }}>Device ID: {item.deviceId}</p>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', whiteSpace: 'nowrap' }}>ID: {item._id}</p>

      </div>
    );
  })}
</div>

      
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
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
          


       
            {/* Render list items */}
            <h1 style={{textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '2vw'}}>Your Accidents</h1>
            {/* if no icidents write no icidents */}
            {accidents.length === 0 && <h2 style={{textAlign: 'center', color: 'black'}}>No Accidents</h2>}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(${25}ch, 1fr))`,
                gap: '10px',
                margin: '2%',
                maxWidth: '95%',
                overflow: 'auto',
                fontSize: '1.2rem',
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
                    cursor: 'pointer',
                    
                    minWidth: 'fit-content', // Set the minWidth property to fit the content width
                  
                  }}
                  onClick={() => handleItemClick(index, item)}
                   >
                  <p style={{ fontSize: '1.2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Citizen: {typeof item.citizen === 'object' ? item.citizen.name : findCitizen(item.citizen)}</p>
                  <p style={{fontSize: '1,2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Time of Accident: {alarmTime.toLocaleString()}</p>
                  <p style={{fontSize: '1.2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Position: {item.positionId}</p>
                  <p style={{fontSize: '1.2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Device ID: {item.deviceId}</p>
            
                  </div>
                );
              })}
            </div>
      
      
      
          </div>
          </div>
    
  );
  
  };
export default MyComponent;
  
  

