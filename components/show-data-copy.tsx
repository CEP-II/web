import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik';
import Cookies from 'js-cookie';
import {Variables} from '../data/globalVariable';
import Image from 'next/image'
import mypic from '../pictures/logo.png'
import Link from 'next/link';
import Pagination from "react-js-pagination";



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
      <div style={{ position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }}>
  {/* Render pagination component */}
  <Pagination
    activePage={page}
    itemsCountPerPage={limit}
    totalItemsCount={data.length}
    pageRangeDisplayed={5}
    onChange={handlePageChange}
    itemClass="page-item"
    linkClass="page-link"
    prevPageText="Previous"
    nextPageText="Next"
    lastPageText="Last"
    hideFirstLastPages
  />
</div>
      </div>
       
      
    </div>
  );
};

export default PaginatedList;





//page=1&limit=10
//page=1&