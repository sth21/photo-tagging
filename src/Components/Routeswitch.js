import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import { DB } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
import App from './App';
import Leaderboard from './Leaderboard';
import Game from './Game';
import Nav from './Nav';

export default function Routeswitch() {
  // Game state variables
  const [ nycData, setNycData ] = useState();
  const [ parisData, setParisData ] = useState();
  const [ rioData, setRioData ] = useState();
  const [ romeData, setRomeData ] = useState();

  const [ activeMap, setActiveMap ] = useState();

  // Get all game data from firebase
  useEffect(() => {
    const fetchGameData = async () => {
      const snapshot = await getDocs(collection(DB, "game_data"));
      const snapshotData = snapshot.docs.map((doc) => doc.data());
      const subcollections = await Promise.all(snapshot.docs
        .map((doc) => getDocs(collection(DB, `game_data/${doc._document.key.path.segments[6]}/objectives`))));
      const subcollectionsData = subcollections.map((collection) => collection.docs.map((doc) => doc.data()));

      setNycData({
        mapName: "New York City", 
        imageUrl: snapshotData[0].img_url,
        objectives: subcollectionsData[0],
       });

       setParisData({ 
        mapName: "Paris",
        imageUrl: snapshotData[1].img_url,
        objectives: subcollectionsData[1],
       });

       setRioData({ 
        mapName: "Rio de Janeiro",
        imageUrl: snapshotData[2].img_url,
        objectives: subcollectionsData[2],
       });

       setRomeData({ 
        mapName: "Rome",
        imageUrl: snapshotData[3].img_url,
        objectives: subcollectionsData[3],
       });
    }

    try {
      fetchGameData();
    } catch (error) {
      console.log("ERROR: " + error);
    }
  }, []);
  
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element =
            { 
              <App
                gameData = {[ nycData, rioData, parisData, romeData ]} 
                setActiveMap = { setActiveMap }
              /> 
            } 
          />
          <Route path = "/leaderboard" element = { <Leaderboard /> } />
          <Route path = "/game" element = 
            { 
              <Game 
                selectedGameData = { activeMap }
                setActiveMap = { setActiveMap } 
              /> 
            } 
          /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}
