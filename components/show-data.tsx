import axios from 'axios';
import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';
import { get } from 'http';


interface timeStamp
{

  _id: string;
  startTime: string;

  endTime: string;
  citizen: string;
  deviceId: string;
}

const MyComponent = () => {3
  //a state hook to hold timeStamps
  const [timeStamps, setTimeStamps] = useState([]);
  //a state hook to hold the current page number
  const [activePage, setActivePage] = useState<number>(1);
  //a state hook to hold the total number of pages
  const [totalPages, setTotalPages] = useState<number>(1);
  //a state to select an acident
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  //a state to hold the selected accident
  const [selectedItem, setSelectedItem] = useState(null);
  //a state to hold inputPage
  const [inputPage, setInputPage, reset] = useState<number>(1);


  //this determines size of page
  const limit = 20;

  useEffect(() => {
    getTimeStamps(activePage);
  }, [activePage]);



  //this function will get one page of timeStamps from the backend
  const getTimeStamps = async (pageNumber: number) => {
    console.log("calling page number: " + pageNumber);
    const response = await axios.get(`${Variables.API_URL}/timestamps?page=${pageNumber}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).catch(error => {
      Cookies.remove('token');
      window.location.href = '/';
    });
    setTimeStamps(response.data.timestamps);
    setTotalPages(response.data.totalPages);
    console.log(response.data.timestamps);
    
    
  };

  

  const handleNextPage = () => {
    console.log("handling next page:" + activePage +1 );

    var nextPage = activePage + 1;
    console.log("next page: " + nextPage + "last page was " + activePage);
    getTimeStamps(activePage + 1);
    setActivePage(activePage + 1);

    
  

  };
  const handlePrevPage = () => {
    
    getTimeStamps(activePage - 1);
    setActivePage(activePage - 1);
  }

  const handleItemClick = (index: any, values: any) => {
    setSelectedItemIndex(index);
    setSelectedItem(values);
  };

  const handleDelete = async () => {
    const response = await axios.delete(`${Variables.API_URL}/timestamps/${selectedItem._id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).catch(error => {
      console.log(error);
    });
    console.log(response);
    getTimeStamps(activePage);
  };

  const handlePageInput = (e: number) => {
    setInputPage(e);
  }

  const handleGoToPage = () => {
    if (inputPage > totalPages || inputPage <1) {
      setInputPage(activePage);
      return;
    }
    getTimeStamps(inputPage);
    setActivePage(inputPage);

    console.log("input page is:" + inputPage);
  }





  return (
    <div>
      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}></div>
         <div style={{position: 'absolute' , top: '25px', left: '10px'}}>
          {/*<input type="text" placeholder="Search by ID" value={searchTerm} style={{ }} onChange={handleSearch} />*/}
          </div>

          <div style={{position: 'absolute', top: '10px' ,left: '50%', transform: 'translateX(-50%)'  }}>
            <h1 style={{color: 'white', fontSize: '50px' }}>Night assist</h1>
           
          </div>

          <div style={{position: 'absolute', top: '10px', right: '10px', padding: '10px'}}>

              <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
              window.location.href = '/accidentPage';
              }}>Accidents</button>

                <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/citizenSearch';
                }}>Citizen</button>


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
              background: selectedItemIndex === index ? '#a2eef2' : '#fff',}}
              onClick={() => {handleItemClick(index, item)}}
            
            
            
            
            >
              <p style={{ fontSize: '14px', margin: '0px' }}>Citizen: {item.citizen}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Start time: {startTime.toLocaleString()}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>End time: {endTime.toLocaleString()}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Duration: {duration} ms</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Device ID: {item.deviceId}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>ID: {item._id}</p>
              
            </div>
          );
        })}
      </div>
      {/* buttons to go to next or prev page */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{position: 'absolute' ,left: '2%'}}>
        <button type="button" className="btn btn-primary" style={{padding: '2%'}}  onClick={() => {handleDelete()}} disabled={selectedItem == null}>Delete</button>
        
        <input type="number" placeholder='Page number' value={inputPage} onChange={handlePageInput} />

        <button type="button" className="btn btn-primary" style={{padding: '2%'}} onClick={() => {handleGoToPage()}}>Go to page</button>

        </div>
          <button type="button" className="btn btn-primary" tyle={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={handlePrevPage} disabled={activePage === 1}>Prev</button>
          
          {activePage}/{totalPages}

          <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px' }} onClick={handleNextPage} disabled={activePage === totalPages}>Next</button>
        </div>
       



       
        
  </div>
</div>
)};
export default MyComponent;
  







 


    

 
  