import axios from 'axios';
import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';



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



  

  //this determines size of page
  const limit = 20;

  useEffect(() => {
    getTimeStamps(activePage, selectedCitizen);
  }, [activePage, selectedCitizen]);

  //this function will get one page of timeStamps from the backend
  const getTimeStamps = async (pageNumber: number ,citizen: string ) => {
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
        return;
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

  useEffect(() => {
    getCitizenName();
  }, []);
  




  return (
    <div>
      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}></div>
         <div style={{position: 'absolute' , top: '25px', left: '10px'}}>
            {/* drop down meny */}
            <select value={selectedCitizen} className="btn btn--primary" style={{background: '#0D6EFD', color: 'white', fontWeight: 'bold'}}onChange={handleCitizenChange}>
                <option value="">Select Citizen</option>
                {citizens.map((citizen, index) => (
                  <option key={index} value={citizen._id}>{citizen.name}</option>
                ))}
              </select>
          </div>

          <div style={{position: 'absolute', top: '10px' ,left: '50%', transform: 'translateX(-50%)'  }}>
            <h1 style={{color: 'white', fontSize: '50px', fontWeight: 'bold' }}>Night assist</h1>
          </div>

          <div style={{position: 'absolute', top: '10px', right: '10px', padding: '10px'}}>


                  <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/accidentPage';
                  }}>Accidents</button>


                  <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/adminPage';
                  }}>Admin</button>

                  <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/showData';
                  }}>Data</button>

                <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px' }} onClick={() => {
                  Cookies.remove('token');
                  window.location.href = '/';
                }}>Log out</button>

                
            </div>
        
          

       </div>

       <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
        {/* Render list items */}
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
     
      <div hidden={timeStamps.length === 0}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        </div>

        
       



       
        
  </div>
</div>
)};
export default MyComponent;
  

