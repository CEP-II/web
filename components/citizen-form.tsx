import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import Pagination from 'react-js-pagination';

interface timeStamp
{
    _id: string;
    startTime: string;
    duration: string;
    endTime: string;
    citizen: string;
    deviceId: string;
}

const PaginatedList = () => {
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageData, setCurrentPageData] = useState<timeStamp[]>([]);
  
    useEffect(() => {
      fetchData(activePage);
    }, [activePage]);
  
    const fetchData = async (page: number) => {
      const response = await axios.get(`${Variables.API_URL}/timestamps?page=${page}&limit=20`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }).catch(error => {
        Cookies.remove('token');
        window.location.href = '/';
      });
  
      const newData = response.data.timestamps;
      setCurrentPageData(newData);
    };
  
    const handlePageChange = (pageNumber: number) => {
      if (pageNumber !== activePage) {
        setActivePage(pageNumber);
      }
    };
  
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setActivePage(1);
    };
  
    const filteredData = currentPageData.filter(item => item.citizen.includes(searchTerm));
  
    return (
      <div>
        {/* Rest of the code */}
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={-1} // Set to a large negative value to disable pagination count
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
        {/* Rest of the code */}
      </div>
    );
  };
  
  export default PaginatedList;
  