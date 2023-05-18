import axios from 'axios';
import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';
import styles from '../components/stdColors.module.css'
import { get } from 'http';



interface timeStamp
{

  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
  deviceId: string;
}



const MyComponent = () => {
  //a state hook to hold timeStamps
  const [timeStamps, setTimeStamps] = useState([]);
  //a state hook to hold the current page number
  const [activePage, setActivePage] = useState<number>(1);
  //a state hook to hold the total number of pages
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<timeStamp | null>(null);

  const [citizens, setCitizens] = useState([]);
  const [selectedCitizen, setSelectedCitizen] = useState<string>('');

  const [limit, setLimit] = useState<number>(12);


 
  

  

  useEffect(() => {
    getTimeStamps(activePage, selectedCitizen);
  }, [activePage, selectedCitizen, limit]);

  //this function will get one page of timeStamps from the backend
  const getTimeStamps = async (pageNumber: number ,citizen: string ) => {
    if(citizen !== ""){

    try{
    const response = await axios.get(`${Variables.API_URL}/timestamps/by-citizen/${citizen}?page=${pageNumber}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
        })
        console.log(response.data.timestamps);
        setTimeStamps(response.data.timestamps);
        setTotalPages(response.data.totalPages);
        }catch(error){
          getTimeStamps(activePage, "");
          //and ret the citizen to null
          setSelectedCitizen("");
          //make message to user
          alert("No timestamps for this citizen");
            
        }
      }
      else
      {
      try {
        const response = await axios.get(`${Variables.API_URL}/timestamps?page=${pageNumber}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        });
        setTimeStamps(response.data.timestamps);
        setTotalPages(response.data.totalPages);
        console.log(response.data);
       
  
      } catch (error) {
        Cookies.remove('token');
        window.location.href = '/';
      }
        
    }
  };


  const resetItemClicked = () => {
    setSelectedItemIndex(null);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${Variables.API_URL}/timestamps/${selectedItem?._id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      console.log(response);
      getTimeStamps(activePage, selectedCitizen);
    } catch (error) {
      console.log(error);
    }
  };



  //get citizen name to make a drop down menu for selcting citizen to get data from
  const getCitizenName = async () => {
    try {
      const response = await axios.get(`${Variables.API_URL}/citizen`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setCitizens(response.data.citizens);
      console.log("citizens" + response.data.citizens);
      
    } catch (error) {
      console.log(error);
    
    
    }


  };

  const handleCitizenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCitizen = event.target.value;
    setSelectedCitizen(selectedCitizen);

    console.log(selectedCitizen);
    
  };

  const handleItemClick = (index: number, values: timeStamp) => {
    setSelectedItemIndex(index);
    setSelectedItem(values);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setActivePage(1);
    
  
   


  };

  const findCitizen = (citizenId: string) => {
    const citizen = citizens.find((citizen) => citizen._id === citizenId);
    return citizen?.name;
  };

 


  useEffect(() => {
    getCitizenName();
  }, []);
  




  return (
    <div>
      <div className={styles.color_topbar} style={{ position: 'absolute', top: '0%', left: '0%', width: '100%', height: '12%' }}>
         <h1 style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '3vw' }}>Night Assist</h1>
          <h3 style={{ textAlign: 'center', color: 'white', fontSize: '2vw' }}>Your Guide through the night</h3>
         <div style={{position: 'absolute' , top: '20%', left: '2%'}}>
            {/* drop down meny */}
            <select value={selectedCitizen} className="btn btn--primary" style={{background: '#0D6EFD', color: 'white', fontWeight: 'bold', fontSize:'1vw'}}onChange={handleCitizenChange}>
                <option value="">Select Citizen</option>
                {citizens.map((citizen, index) => (
                  <option key={index} value={citizen._id}>{citizen.name}</option>
                ))}
              </select>

               <select className="btn"id="limitDropdown" style={{position: 'absolute', top:'30%', height: '40%', width:'14%', fontSize:'2vw', color:'white'}} value={limit} onChange={handleLimitChange}>
            <option value="12" >
                Select Limit
              </option>
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="18">18</option>
              <option value="24">24</option>
              <option value="36">36</option>
            </select>
          </div>

         

          <div style={{position: 'absolute', top: '10px', right: '10px', padding: '10px'}}>


                  <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/accidentPage';
                  }}>Accidents</button>


                  <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5px 10px', marginRight: '5px'}}  onClick={() => {
                  window.location.href = '/citizen';
                  }}>Citizen</button>

                  <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5px 10px', marginRight: '5px'}}  onClick={() => {
                  window.location.href = '/timestamps';
                  }}>Timestaps</button>

                <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5px 10px' }}  onClick={() => {
                  Cookies.remove('token');
                  window.location.href = '/';
                }}>Log out</button>

                
            </div>
        
          

       </div>

       <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
        {/* Render list items */}
        <div
  style={{
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${25}ch, 1fr))`,
    gap: '10px',
    margin: '2%',
    maxWidth: '95%',
    overflow: 'auto',
    fontSize: '1vw',
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
          
          minWidth: 'fit-content', // Set the minWidth property to fit the content width
        }}
        onClick={() => {
          handleItemClick(index, item);
        }}
      >
        <p style={{ fontSize: '1vw', margin: '0px', whiteSpace: 'nowrap'}}>Citizen: {typeof item.citizen === 'object' ? item.citizen.name : findCitizen(item.citizen)}</p>

        <p style={{ fontSize: '1vw', margin: '0px' ,whiteSpace: 'nowrap'}}>Start time: {startTime.toLocaleString()}</p>
        <p style={{ fontSize: '1vw', margin: '0px',whiteSpace: 'nowrap' }}>Position: {item.positionId}</p>
        <p style={{ fontSize: '1vw', margin: '0px',whiteSpace: 'nowrap' }}>Duration: {duration} ms</p>
        <p style={{ fontSize: '1vw', margin: '0px',whiteSpace: 'nowrap' }}>Device ID: {item.deviceId}</p>
        <p style={{ fontSize: '1vw', margin: '0px',whiteSpace: 'nowrap' }}>ID: {item._id}</p>
      </div>
    );
  })}
</div>

     
     
     
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4%' }}>
        <div style={{ position: 'absolute', left: '2%' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '10%' }}
              onClick={() => {
                handleDelete();
              }}
              disabled={selectedItem === null}
            >
              Delete
            </button>
          </div>
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
</div>
)};
export default MyComponent;
  

