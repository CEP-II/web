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

  //Set the search citizenId
    const [searchCitizen, setSearchCitizen] = useState<string>('');

  //this determines size of page
  const limit = 20;

  useEffect(() => {
    getTimeStamps(activePage, searchCitizen);
  }, [activePage, searchCitizen]);

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

  //this function will handle search for a specific citizen
  const handleSearch = async (citizen: string) => {
    getTimeStamps(activePage, citizen);
    setSearchCitizen(citizen);
  }

  const handleNextPage = () => {
  
    getTimeStamps(activePage + 1, searchCitizen);
    setActivePage(activePage + 1);

  };
  const handlePrevPage = () => {
    
    getTimeStamps(activePage - 1, searchCitizen);
    setActivePage(activePage - 1);
  }




  return (
    <div>
      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}></div>
         <div style={{position: 'absolute' , top: '25px', left: '10px'}}>
         <input
                type="text"
                placeholder="Search by ID"
                value={searchCitizen}
                onChange={(e) => setSearchCitizen(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                    handleSearch(searchCitizen);
                    }
                }}
                />
          </div>

          <div style={{position: 'absolute', top: '10px' ,left: '50%', transform: 'translateX(-50%)'  }}>
            <h1 style={{color: 'white', fontSize: '50px' }}>Night assist</h1>
          </div>

          <div style={{position: 'absolute', top: '10px', right: '10px', padding: '10px'}}>
                <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                    window.location.href = '/showData';
                    }}>Data</button>

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
        {timeStamps.map((item, index) => {
          const startTime = new Date(item.startTime);
          const endTime = new Date(item.endTime);
          const duration = Math.abs(endTime.getTime() - startTime.getTime());

          return (
            <div key={index}>
              <div>
                {" Start : "}{startTime.toUTCString()}
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
      {/* buttons to go to next or prev page */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={handlePrevPage} disabled={activePage === 1}>Prev</button>
          
          {activePage}/{totalPages}

          <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px' }} onClick={handleNextPage} disabled={activePage === totalPages}>Next</button>
        </div>
       



       
        
  </div>
</div>
)};
export default MyComponent;
  
