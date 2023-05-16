import axios from 'axios';
import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';



const MyComponent = () => {

    const [data, setData] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      

      const response = await axios.get(Variables.API_URL + '/timestamps',{
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      }).catch((error) => {
        /*if there is an error go to the login page*/ 
        Cookies.remove('token');
        window.location.href = '/';  
      });



      console.log(response.data.citizens);

      setData(response.data.citizens);
      
    };

    const handlePageChange = (pageNumber:any) => {
      setActivePage(pageNumber);
    };

    const handleSearch = (event:any) => {
      setSearchTerm(event.target.value);
      setActivePage(1); // reset active page when search term changes
    };


    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            

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
        {data.map((item, index) => {
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




                    <div style={{position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)'}}>
                      {/* Render pagination component */}
                              <Pagination
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={data.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                              />
                      </div>

        </div>
        </div>
    );
};
export default MyComponent;
