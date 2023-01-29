import { useState, useEffect } from 'react';

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
    const widthPercent = e.offsetX / e.target.clientWidth;
    const heightPercent = e.offsetY / e.target.clientHeight;
    return [ widthPercent, heightPercent ]
  }

  // if clickLocation is defined, render an absolutely positioned element on its location
  // if gameOver is true, render an overlay which allows them to type in a username to submit their data to server
    return (
      <div>{ time }</div>
    );
  }