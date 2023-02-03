import { useState, useEffect, useRef } from 'react';
import uniqid from 'uniqid';

export default function Game(props) {
  // Game State
  const [ gameOver, setGameOver ] = useState(false);
  const [ time, setTime ] = useState(0);
  const [ isTimerActive, setIsTimerActive ] = useState(true);
  const [ objectiveCompletion, setObjectiveCompletion ] = useState([ false, false, false ]);
  const [ clickLocation, setClickLocation ] = useState();
  const [ imgHeight, setImgHeight ] = useState(0);
  const [ imgWidth, setImgWidth ] = useState(0);

  // Img Reference
  const imgRef = useRef();

  // Tests if all conditions met for game over
  const allDepsHaveChanged = ( gameOver && !isTimerActive );

  // Handle changes to the image height and width
  useEffect(() => {
    const handleResize = () => {
      setImgHeight(imgRef.current.offsetHeight);
      setImgWidth(imgRef.current.offsetWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ imgRef ]);

  // Handle the game timer
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => setTime((currentTime) => currentTime + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Check if game is over
  useEffect(() => {
    const isGameOver = objectiveCompletion.every(obj => obj === true);
    if ( isGameOver ) {
      setIsTimerActive(false);
      setGameOver(true);
    }
  }, [ objectiveCompletion ]);

  // Handle when game is over
  useEffect(() => {
    if (!allDepsHaveChanged) return;
    console.log("GAME OVER");
    // post data to server (Google Auth or let them type in username and ditch this???)
  }, [ allDepsHaveChanged ]);

  // Handle when the user clicks the image
  function handleClick(e) {
    setClickLocation(getClickCoordinates(e));
  }

  // Handle when the user submits an objective guess
  function handleSubmit(objective, index) {
    const isInXBounds = ( clickLocation[0] > objective.xbounds[0] && clickLocation[0] < objective.xbounds[1] );
    const isInYBounds = ( clickLocation[1] > objective.ybounds[0] && clickLocation[1] < objective.ybounds[1] );
    if (isInXBounds && isInYBounds) setObjectiveCompletion((cur) => ([ ...cur.slice(0, index), true, ...cur.slice(index + 1) ]));
  }

  // Calculate the x % and y % of a click on the game image
  function getClickCoordinates(e) {
    const obj = e.target.getBoundingClientRect()
    const widthPercent = (e.clientX - obj.left ) / e.target.clientWidth;
    const heightPercent = (e.clientY - obj.top ) / e.target.clientHeight;
    return [ widthPercent, heightPercent ];
  }

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
            ? <dialog style={{position: "absolute", padding: '0px', margin: '0px', display: "block", zIndex: 1, top: `${ imgHeight * parseFloat(clickLocation[1], 10) }px`, left: `${ imgWidth * parseFloat(clickLocation[0], 10) }px`, background: "white", height: "200px", width: "200px"}}>
                { props.selectedGameData.objectives.map((obj, index) => (
                  <p role="button" key={ uniqid() } disabled={( objectiveCompletion[index] )} onClick={ () => handleSubmit( obj, index) }>{ obj.name }</p>
                ))}
              </dialog> 
            : null 
          }
          <img src={ props.selectedGameData.imageUrl } alt={ props.selectedGameData.mapName } onClick={ handleClick } style={{ maxWidth: "100vw", height: "auto" }} ref={ imgRef } />
        </div>
      </main>
    );
  }