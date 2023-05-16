import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';

interface Item {
  _id: string;
  startTime: string;
  endTime: string;
  citizen: string;
  deviceId: string;
}

const PaginatedList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Item[]>([]);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Variables.API_URL}/timestamps?page=${page}&limit=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
  
      const newData = response.data.timestamps;
      console.log("calling api for page " + page);
      console.log(newData);
      setData(prevData => {
        const updatedData = [...prevData, ...newData];
        // Remove earlier pages
        const startIndex = Math.max(0, updatedData.length - (itemsPerPage * 3));
        const limitedData = updatedData.slice(startIndex);
        console.log(limitedData.length);
        return limitedData;
      });
    } catch (error) {
      Cookies.remove('token');
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
   
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter(item => item.citizen.includes(searchTerm));

  return (
    <div>
      <div style={{ margin: '10px' }}>
        <input type="text" placeholder="Search by Citizen ID" value={searchTerm} onChange={handleSearch} />
      </div>

      {isLoading && <div>Loading...</div>}

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
        {filteredData.map((item, index) => {
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
      </div>

      <div style={{ marginTop: '10px' }}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={data.length}

          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  );
};

export default PaginatedList;
