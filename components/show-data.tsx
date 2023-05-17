import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';
import styles from '../styles/ShowData.module.css';

interface timeStamp {
  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
  deviceId: string;
}

const MyComponent = () => {
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
      const response = await axios.get(`${Variables.API_URL}/timestamps?page=${pageNumber}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setTimeStamps(response.data.timestamps);
      setTotalPages(response.data.totalPages);
     

    } catch (error) {
      Cookies.remove('token');
      window.location.href = '/';
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${Variables.API_URL}/timestamps/${selectedItem?._id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      console.log(response);
      getTimeStamps(activePage);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <div className="mb-2" style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div style={{width: '100%', height: '80px',  background: '#1E88E4'}}></div>
       

          <div style={{position: 'absolute', top: '10px' ,left: '50%', transform: 'translateX(-50%)'  }}>
            <h1 style={{color: 'white', fontSize: '300%', fontWeight: 'bold' }}>Night assist</h1>
           
          </div>

          <div style={{position: 'absolute', top: '10px', right: '10px', padding: '10px'}}>

              <button type="button" className="btn btn-primary" style={{ fontSize: '100%',  padding: '5px 10px', marginRight: '5px' }} onClick={() => {
              window.location.href = '/accidentPage';
              }}>Accidents</button>

                <button type="button" className="btn btn-primary" style={{ fontSize: '100%', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/citizenSearch';
                }}>Citizen</button>


                <button type="button" className="btn btn-primary" style={{ fontSize: '100%', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                  window.location.href = '/adminPage';
                }}>Admin</button>

                <button type="button" className="btn btn-primary" style={{ fontSize: '100%', padding: '5px 10px' }} onClick={() => {
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
  
        {/* Buttons */}
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
    </div>
  );
  
  };
export default MyComponent;
  







 


    

 
  