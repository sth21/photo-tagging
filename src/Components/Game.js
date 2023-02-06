import { useState, useEffect, useRef } from 'react';
import { StyledGame, StyledObjectiveBar, StyledObjectiveLabel, StyledGameImage, StyledDialog, StyledObjectiveContainer, StyledObjectiveButton } from './CSSModules';
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
    setClickLocation(undefined);
    console.log("GAME OVER");
    // post data to server (Google Auth or let them type in username and ditch this???)
  }, [ allDepsHaveChanged ]);

  // Handle when the user clicks the image
  function handleClick(e) {
    if ( gameOver ) return;
    setClickLocation(getClickCoordinates(e));
  }

  // Handle when the user submits an objective guess
  function handleSubmit(objective, index) {
    if ( gameOver ) return;
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
      <StyledGame>
        <StyledObjectiveBar top = { props.navBarHeight }>
          <StyledObjectiveContainer>
            Objectives:
            { props.selectedGameData.objectives.map((obj, index) => <StyledObjectiveLabel found={ objectiveCompletion[index] } key={ uniqid() }>{ obj.name }</StyledObjectiveLabel>) }
          </StyledObjectiveContainer>
          <StyledObjectiveLabel found={ false }>Timer: { time } seconds</StyledObjectiveLabel>
        </StyledObjectiveBar>
        <div className="img-wrapper" style={{position: "relative"}}>
          { 
            (clickLocation !== undefined)
            ? <StyledDialog imgHeight = { imgHeight } imgWidth = { imgWidth } clickLocation = { clickLocation }>
                { props.selectedGameData.objectives.map((obj, index) => (
                  <StyledObjectiveButton as="button" found={ objectiveCompletion[index] } key={ uniqid() } disabled={( objectiveCompletion[index] )} onClick={ () => handleSubmit( obj, index) }>{ obj.name }</StyledObjectiveButton>
                ))}
              </StyledDialog> 
            : null 
          }
          <StyledGameImage src={ props.selectedGameData.imageUrl } alt={ props.selectedGameData.mapName } onClick={ handleClick } ref={ imgRef } />
        </div>
      </StyledGame>
    );
  }