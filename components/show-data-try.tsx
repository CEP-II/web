import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Variables} from '../data/globalVariable';



function ShowData() {
  const [timeStamps, setTimeStamps] = useState([]);

  var TimeStamps = [];
  

  useEffect(() => {
        fetchObjects();
            {
                axios.get(Variables.API_URL + '/timestamps?page=1&2', {
                    headers: {
                      Authorization: `Bearer ${Cookies.get('token')}`,
                    }
                  }).then(response => 
                    {   
                        TimeStamps.push(response.data.timestamps);
                    })
            }

  

    }, []);

  function fetchObjects() {
    // your code here

  }

  function filterObjectsByCitizenId(citizenId: string, TimeStamps: any[]) {
    if (!citizenId) {
      return TimeStamps;
    }
    else
        return TimeStamps.filter(TimeStamps => TimeStamps.citizenId === citizenId);
  }

  return (
    <div>
        <div className="container" style={{ position: 'absolute' , top: '10px' , justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={fetchObjects}>Load more objects</button>
        </div>
      <ul>
        {filterObjectsByCitizenId('123' , TimeStamps).map(object => (
          <li key={object.id}>{object.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ShowData;