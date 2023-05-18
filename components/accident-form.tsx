
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

  const [limit, setLimit] = useState<number>(15);


 
  

  

  useEffect(() => {
    getTimeStamps(activePage, selectedCitizen);
  }, [activePage, selectedCitizen, limit]);

  //this function will get one page of timeStamps from the backend
  const getTimeStamps = async (pageNumber: number ,citizen: string ) => {
    if(citizen !== ""){

    try{
    const response = await axios.get(`${Variables.API_URL}/accident/by-citizen/${citizen}?page=${pageNumber}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
        })
        console.log(response.data.timestamps);
        setTimeStamps(response.data.accidents);
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
        const response = await axios.get(`${Variables.API_URL}/accident?page=${pageNumber}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        });
        setTimeStamps(response.data.accidents);
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
  <div className={styles.color_topbar} style={{ position: 'absolute', top: '0%', left: '0%', width: '100%', height: 'auto' }}>
         <h1 style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '3vw' }}>Night Assist</h1>
          <h3 style={{ textAlign: 'center', color: 'white', fontSize: '2vw' }}>Your Guide through the night</h3>
        
         
          

         

          <div style={{position: 'absolute', top: '50%',transform: 'translateY(-50%)', right: '10px', padding: '10px'}}>


                      <button type="button" className="btn btn-primary" style={{ fontSize: '1vw',  marginRight: '0.2rem'}} onClick={() => {
                      window.location.href = '/accidentPage';
                      }}>Accidents</button>


                      <button type="button" className="btn btn-primary" style={{ fontSize: '1vw',  marginRight: '0.2rem'}}  onClick={() => {
                      window.location.href = '/citizen';
                      }}>Citizen</button>

                      <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', marginRight: '0.2rem'}}  onClick={() => {
                      window.location.href = '/timestamps';
                      }}>Timestaps</button>

                    <button type="button" className="btn btn-primary" style={{ fontSize: '1vw',}}  onClick={() => {
                      Cookies.remove('token');
                      window.location.href = '/';
                    }}>Log out</button>
                </div>

                <div style={{position: 'absolute', top: '50%',transform: 'translateY(-50%)', left: '10px'}}>


               {/* drop down meny */}
               <select className="btn"id="limitDropdown" style={{ fontSize:'1.5vw', color:'white'}} value={limit} onChange={handleCitizenChange}>
                <option value="">Select Citizen</option>
                {citizens.map((citizen, index) => (
                  <option key={index} value={citizen._id}>{citizen.name}</option>
                ))}
              </select>

              <select className="btn"id="limitDropdown" style={{fontSize:'1.5vw', color:'white'}} value={limit} onChange={handleLimitChange}>

              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
            </div>
        
          

       </div>

       <div style={{ position: 'absolute', left: '50%', top: 'calc(12% + 10px)', transform: 'translateX(-50%)', width: '100%' }}>
        {/* Render list items */}
        <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${30}ch, 1fr))`,
          gap: '10px',
          margin: '2%',
          maxWidth: '95%',
          overflow: 'auto',
          fontSize: '1.2rem',
        }}
      >
        {/* Render list items */}
        {timeStamps.map((item, index) => {
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
              
              minWidth: 'fit-content', // Set the minWidth property to fit the content width
            
            }}
              onClick={() => {handleItemClick(index, item)}}
             >
            <p style={{ fontSize: '1.2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Citizen: {typeof item.citizen === 'object' ? item.citizen.name : findCitizen(item.citizen)}</p>
            <p style={{fontSize: '1,2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Time of Accident: {alarmTime.toLocaleString()}</p>
            <p style={{fontSize: '1.2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Position: {item.positionId}</p>
            <p style={{fontSize: '1.2rem', margin: '0.2rem 0', whiteSpace: 'nowrap'}}>Device ID: {item.deviceId}</p>
      
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
