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
}

const PaginatedList = () => {
  const [data, setData] = useState<Item[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageData, setCurrentPageData] = useState<Item[]>([]);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (page: number) => {
    if (loadedPages.includes(page)) {
      setCurrentPageData(getDataForPage(page));
      return;
    }

    const response = await axios.get(`${Variables.API_URL}/timestamps?page=${page}&limit=20`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).catch(error => {
      Cookies.remove('token');
      window.location.href = '/';
    });

    const newData = response.data.timestamps;
    console.log("calling api for " + page)
    console.log(newData);
    setData(prevData => [...prevData, ...newData]);
    setTotalItems(prevTotalItems => prevTotalItems + newData.length);
    setLoadedPages(prevLoadedPages => [...prevLoadedPages, page]);
    setCurrentPageData(getDataForPage(page));

  };

  const getDataForPage = (page: number): Item[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
    if (!loadedPages.includes(pageNumber)) {
      fetchData(pageNumber);
    } else {
      setCurrentPageData(getDataForPage(pageNumber));
    }
  };


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setActivePage(1);
  };

  const filteredData = data.filter(item => item.citizen.includes(searchTerm));

  return (
    <div>

<div className="mb-2" style={{position: 'absolute', top: '0%', left: '0%', width: '100%',height: '8%',  background: '#1E88E4'}}>
                

            <div style={{position: 'absolute', top: '20%' , left: '2%'}}>
                    <input type="text" placeholder="Search by Citizen ID" value={searchTerm} onChange={handleSearch} />
            </div>
      

              <div style={{position: 'absolute', top: '0%', right: '1%', padding: '1%'}}>
                  <button type="button" className="btn btn-primary" style={{ fontSize: '100%', padding: '5px 10px', marginRight: '5px', width: '100px'}} onClick={() => {
                  window.location.href = '/adminPage';
                  }}>admin</button>
                      
                  <button type="button" className="btn btn-primary" style={{fontSize: '100%', padding: '5px 10px',width: '100px'}} onClick={() => {
                  Cookies.remove('token');
                  window.location.href = '/';
                  }}>Log out</button>
              </div>

              <div style={{position: 'absolute', top: '20%' , left: '50%', transform: 'translateX(-50%)'}}>
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={itemsPerPage}
                  totalItemsCount={filteredData.length}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                />
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
        {currentPageData.map((item, index) => {
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

      
    </div>
  );
};

export default PaginatedList;
