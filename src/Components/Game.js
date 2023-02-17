/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from 'react';
import { StyledGame, StyledObjectiveBar, StyledObjectiveLabel, StyledGameImage, StyledDialog, StyledObjectiveContainer, StyledObjectiveButton, StyledForm, StyledFormWrapper } from './CSSModules';
import uniqid from 'uniqid';
import { TextField, Button } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { DB } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Game(props) {
  // Game State
  const currentGame = props.selectedGameData || JSON.parse(localStorage.getItem("GAME_DATA"));
  const [ gameOver, setGameOver ] = useState(false);
  const [ time, setTime ] = useState(0);
  const [ isTimerActive, setIsTimerActive ] = useState(true);
  const [ objectiveCompletion, setObjectiveCompletion ] = useState([ false, false, false ]);
  const [ clickLocation, setClickLocation ] = useState(undefined);
  const [ imgHeight, setImgHeight ] = useState(0);
  const [ imgWidth, setImgWidth ] = useState(0);

  // Location hook
  const navigate = useNavigate();

  // Img Reference
  const imgRef = useRef();

  // Text Field Value
  const [ username, setUsername ] = useState('');

  // Tests if all conditions met for game over
  const allDepsHaveChanged = ( gameOver && !isTimerActive );

  // Set current game in local storage in case of page refresh
  useEffect(() => {
    const GAME_DATA = localStorage.getItem("GAME_DATA");
    if ( !GAME_DATA || GAME_DATA === "undefined" || currentGame !== JSON.parse(GAME_DATA)) {
      localStorage.setItem("GAME_DATA", JSON.stringify(currentGame));
    }
  }, []);

  // Handle changes to the image height and width
  useEffect(() => {
    if (!imgRef.current) return;
    const handleResize = () => {
      setImgHeight(imgRef.current.offsetHeight);
      setImgWidth(imgRef.current.offsetWidth);
    };

    const handleImgLoad = () => {
      handleResize();
      imgRef.current.removeEventListener("load", handleImgLoad);
    };

    imgRef.current.addEventListener("load", handleImgLoad);
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
  }, [ allDepsHaveChanged ]);

  // Handle when the user submits a username
  const handleFormSubmit = async (username, time, map) => {
    await addDoc(collection(DB, "leaderboard"), { 
      name: username,
      time: time,
      map: map,
    });
    navigate("/leaderboard");
  };

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

  return (
    <StyledGame gameOver = { gameOver }>
      <StyledObjectiveBar>
        <StyledObjectiveContainer>
          Objectives:
          { currentGame.objectives.map((obj, index) => <StyledObjectiveLabel found={ objectiveCompletion[index] } key={ uniqid() }>{ obj.name }</StyledObjectiveLabel>) }
        </StyledObjectiveContainer>
        <StyledObjectiveLabel found={ false }>Timer: { time } seconds</StyledObjectiveLabel>
      </StyledObjectiveBar>
      <div className="img-wrapper" style={{position: "relative"}}>
        { 
          (clickLocation !== undefined)
          ? <StyledDialog imgHeight = { imgHeight } imgWidth = { imgWidth } clickLocation = { clickLocation }>
              { currentGame.objectives.map((obj, index) => (
                <StyledObjectiveButton as="button" found={ objectiveCompletion[index] } key={ uniqid() } disabled={( objectiveCompletion[index] )} onClick={ () => handleSubmit( obj, index) }>{ obj.name }</StyledObjectiveButton>
              ))}
            </StyledDialog> 
          : null 
        }
        {
          (gameOver)
          ? <StyledFormWrapper>
              <StyledForm onSubmit={ (event) => { event.preventDefault(); handleFormSubmit(username, time, currentGame.mapName) }}>
              <StyledObjectiveLabel found={ false }>You won in { time }s</StyledObjectiveLabel>
              <TextField
                label="Enter username"
                value={ username }
                onChange={(event) => setUsername(event.target.value)}
                error={ !username }
              />
              <Button type="submit" variant="contained">Submit</Button>
              </StyledForm>
            </StyledFormWrapper>
          : null 
        }
        <StyledGameImage src={ currentGame.imageUrl } alt={ currentGame.mapName } onClick={ handleClick } ref={ imgRef } />
      </div>
    </StyledGame>
  );
}