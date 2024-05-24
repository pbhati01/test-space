import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RocketTakeoff, Wikipedia, PlayBtnFill, Link45deg, CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';
import { Badge, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import './App.css';

const GET_LOCATIONS = gql`
query ($sort: String, $limit: Int) {
  launches(sort: $sort, limit: $limit) {
    id
    details
    launch_success
    launch_year
    upcoming
    mission_name
    rocket {
      rocket_name
    }
    links {
      flickr_images
      wikipedia
      video_link
      reddit_media
    }
  }
}  
`;

function App() {
  const [ extendedIdx, setExtendedIdx ] = useState(-1);
  const { loading, error, data } = useQuery(GET_LOCATIONS, {
    variables: { sort: 'asc', limit: 20 },
  });
  console.log("data", data)

  const getFlickerImage = (launch) => {
    return launch.links.flickr_images.length > 0 ? <img src={launch.links.flickr_images[0]} /> : <RocketTakeoff size={50}/> ; 
  }

  return (
    <>
      <div className="container">
        <div className="filters">
          <h4 className="heading">{'Launch Status'}</h4>
          <Dropdown data-bs-theme="dark">
            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
              Upcoming
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1" active>Upcoming</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Past Launches</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {loading ? 
          <div>Loading...</div>
        : error ? 
          <div>{error.message}</div> 
          : data && data.launches.map((launch: any, itemIdx: number) => 
          <div className="launchItem">
            <div className="launchItemRow">
              <div className="launchImage">{getFlickerImage(launch)}</div>
              <div className="launchDetails">
                <Badge bg={launch.upcoming ? 'success' : 'dark'} className="launchType">{launch.upcoming ? 'Upcoming' : 'Previous'}</Badge>
                <div className="subDetails">
                  {launch.rocket?.rocket_name && <div>
                    <h6 className="heading">{'Name'}</h6>
                    <p>{launch.rocket.rocket_name}</p>
                  </div>}
                  {launch.mission_name && <div>
                    <h6 className="heading">{'Mission'}</h6>
                    <p>{launch.mission_name}</p>
                  </div>}
                  {launch.launch_year && <div>
                    <h6 className="heading">{'Launch Year'}</h6>
                    <p>{launch.launch_year}</p>
                  </div>}
                  {launch.launch_success && <div>
                    <h6 className="heading">{'Status'}</h6>
                    <p>{launch.deatils}</p>
                  </div>}
                </div>
                <div className="linksDetails">
                  {launch.links && <div>
                    <h6 className="heading">{'Links'}</h6>
                    <div className="links">
                    <Button><a href={launch.links?.wikipedia} target="_blank"><Wikipedia /></a></Button>
                    <Button><a href={launch.links?.video_link} target="_blank"><PlayBtnFill /></a></Button>
                    <Button><a href={launch.links?.reddit_media} target="_blank"><Link45deg /></a></Button>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
            <div className="launchBottomRow">
              <p>
                {extendedIdx == itemIdx 
                  ? <CaretUpFill onClick={() => setExtendedIdx(-1)}/>
                  : <CaretDownFill onClick={() => setExtendedIdx(itemIdx)}/>
                } {'more'}</p>
              {extendedIdx == itemIdx && launch.details && <div>
                <h6 className="heading">{'Details'}</h6>
                <p>{launch.details}</p>
              </div>}
            </div>
          </div>)
      }
      </div>
    </>
  )
}

export default App
