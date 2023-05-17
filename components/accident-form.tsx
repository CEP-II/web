import axios from 'axios';
import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';
import styles from '../components/stdColors.module.css'


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



  //this determines size of page
  const limit = 20;

  useEffect(() => {
    getTimeStamps(activePage);
  }, [activePage]);

  //this function will get one page of timeStamps from the backend
  const getTimeStamps = async (pageNumber: number) => {
    console.log("calling");
    const response = await axios.get(`${Variables.API_URL}/accident?page=${pageNumber}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).catch(error => {
      Cookies.remove('token');
      window.location.href = '/';
    });
    console.log(response.data.accidents);
    setTimeStamps(response.data.accidents);
    setTotalPages(response.data.totalPages);
    
    
    
  };

  
  
  const handleItemClick = (index: any, values: any) => {
    setSelectedItemIndex(index);
    setSelectedItem(values);
    console.log(selectedItem);
  };

    const handleDelete = async () => {
    const response = await axios.delete(`${Variables.API_URL}/accident/${selectedItem._id}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            
        },
    }).catch(error => {
        console.log(error);
    });
    console.log(response);
    window.location.reload();
};

const resetItemClicked = () => {
    setSelectedItemIndex(null);
    setSelectedItem(null);
  };




  return (
    <div>
     <div className={styles.color_topbar} style={{ position: 'absolute', top: '0%', left: '0%', width: '100%', height: '12%' }}>
         <h1 style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '3vw' }}>Night Assist</h1>
          <h3 style={{ textAlign: 'center', color: 'white', fontSize: '2vw' }}>Your Guide through the night</h3>
    

         

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

       <div style={{position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', width: '100%'}}>
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
              <p style={{ fontSize: '14px', margin: '0px' }}>Citizen: {item.citizen}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Time of Accidents: {alarmTime.toLocaleString()}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Position: {item.positionId.toLocaleString()}</p>
              <p style={{ fontSize: '14px', margin: '0px' }}>Device ID: {item.deviceId}</p>
              
            </div>
          );
        })}
      </div>
      {/* buttons to go to next or prev page */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* button for deleting timestamp */}
        <button type="button" className="btn btn-primary" style={{position: 'absolute' ,left: '2%'}}  onClick={() => {handleDelete()}} disabled={selectedItem == null}>Delete</button>
        
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
)};
export default MyComponent;