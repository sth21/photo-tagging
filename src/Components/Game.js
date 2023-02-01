import { useState, useEffect, useRef } from 'react';
import uniqid from 'uniqid';

export default function Game(props) {
  // Game State
  const [ gameOver, setGameOver ] = useState(false);
  const [ time, setTime ] = useState(0);
  const [ isTimerActive, setIsTimerActive ] = useState(true);
  const [ objectiveCompletion, setObjectionCompletion ] = useState({
    objective1: false,
    objective2: false,
    objective3: false,
  });
  const [ clickLocation, setClickLocation ] = useState();
  const allDepsHaveChanged = ( gameOver && !isTimerActive );
  const imgRef = useRef();

  // Handle changes to the image height and width
  useEffect(() => {
    const handleResize = () => {
      imgRef.current.width = imgRef.current.offsetWidth;
      imgRef.current.height = imgRef.current.offsetHeight;
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle the game timer
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => setTime((currentTime) => currentTime + 1), 1000);
    } else {
      clearInterval(interval);
    }
  }, [isTimerActive]);

  // Check if game is over
  useEffect(() => {
    let isGameOver = true;
    for (const key in objectiveCompletion) {
      if ( objectiveCompletion[key] === false ) {
        isGameOver = false;
        break;
      }
    }
    if ( isGameOver ) {
      setIsTimerActive(false);
      setGameOver(true);
    }
  }, [ objectiveCompletion ]);

  // Handle when game is over
  useEffect(() => {
    // post data to server (Google Auth or Let them type in username and ditch this???)
  }, [ allDepsHaveChanged ]);

  // Handle when the user clicks the image
  function handleClick(e) {
    setClickLocation(getClickCoordinates(e));
  }

  // Handle when the user submits an objective guess
  function handleSubmit(objective, objectiveID) {
    const isInXBounds = ( clickLocation[0] > objective.xbounds[0] && clickLocation[0] < objective.xbounds[1] );
    const isInYBounds = ( clickLocation[1] > objective.ybounds[0] && clickLocation[1] < objective.ybounds[1] );
    if (isInXBounds && isInYBounds) {
      setObjectionCompletion((cur) => ({
          ...cur,
          [objectiveID]: true,
      }));
    }
  }

  // Calculate the x % and y % of a click on the game image
  function getClickCoordinates(e) {
    const obj = e.target.getBoundingClientRect()
    const widthPercent = (e.clientX - obj.left ) / e.target.clientWidth;
    const heightPercent = (e.clientY - obj.top ) / e.target.clientHeight;
    return [ widthPercent, heightPercent ];
  }

  useEffect(() => {
    console.log("Click location: " + clickLocation);
    console.log("ImgRef height: " + imgRef.current.height);
    console.log("ImgRef width: " + imgRef.current.width);
  }, [ clickLocation ])

  // if clickLocation is defined, render an absolutely positioned element on its location
  // if gameOver is true, render an overlay which allows them to type in a username to submit their data to server
    return (
      <main className="game">
        <div className="info">
          { props.selectedGameData.objectives.map((obj) => <p key={ uniqid() }>{ obj.name }</p>) }
          <p>{ time }</p>
        </div>
        <div className="img-wrapper" style={{position: "relative"}}>
          { 
            (clickLocation !== undefined)
            ? <dialog style={{position: "absolute", display: "block", zIndex: 10, top: `${ parseFloat(imgRef.current.height, 10) * parseFloat(clickLocation[1], 10) }px`, left: `${ parseFloat(imgRef.current.width, 10) * parseFloat(clickLocation[0], 10) }px`, background: "black", height: "200px", width: "200px"}}>
                { props.selectedGameData.objectives.map((obj, index) => (
                  <p role="button" key={ uniqid() } disabled={( objectiveCompletion[`objective${index + 1}`] )} onClick={ () => handleSubmit( obj, `objective${index + 1}`) }>{ obj.name }</p>
                ))}
              </dialog> 
            : null 
          }
          <img src={ props.selectedGameData.imageUrl } alt={ props.selectedGameData.mapName } onClick={ handleClick } style={{ maxWidth: "100vw", height: "auto" }} ref={ imgRef } />
        </div>
      </main>
    );
  }