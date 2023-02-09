import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../firebase';
import uniqid from 'uniqid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function Leaderboard() {
  const [ leaderboard, setLeaderboard ] = useState([]);

  useEffect(() => {
    const fetchGameData = async () => {
      const rawData = await getDocs(collection(DB, "leaderboard"));
      const data = rawData.docs.map((doc) => doc.data());
      setLeaderboard(data.sort((a, b) => a.time - b.time));
    }
    fetchGameData();
  }, []);

  const sort = (prevState, actionType) => {
    const newState = [ ...prevState ];
    return ( actionType === "time" )
      ? newState.sort((a, b) => a[actionType] - b[actionType])
      : newState.sort((a, b) => a[actionType].localeCompare(b[actionType]));
  };
  
  return (
      <main className="leaderboard">
        { 
          ( leaderboard.length !== 0 )
          ? <TableContainer style={{padding: "2.5em 0em"}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={ () => setLeaderboard((prev) => sort(prev, "name")) } style={{fontWeight: "bold", fontSize: "1rem", cursor: "pointer"}}>Player Name</TableCell>
                    <TableCell onClick={ () => setLeaderboard((prev) => sort(prev, "time")) } style={{fontWeight: "bold", fontSize: "1rem", cursor: "pointer"}}>Time (seconds)</TableCell>
                    <TableCell onClick={ () => setLeaderboard((prev) => sort(prev, "map")) } style={{fontWeight: "bold", fontSize: "1rem", cursor: "pointer"}}>Map Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    leaderboard.map((player) => (
                      <TableRow key = { uniqid() }>
                        <TableCell>{ player.name }</TableCell>
                        <TableCell>{ player.time }</TableCell>
                        <TableCell>{ player.map }</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          : <p>Be the first one to play!</p>
        }
      </main>
    );
  }