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
  
  return (
      <main className="leaderboard">
        { 
          ( leaderboard.length !== 0 )
          ? <TableContainer style={{padding: "2.5em 0em"}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight: "bold", fontSize: "1rem"}}>Player Name</TableCell>
                    <TableCell style={{fontWeight: "bold", fontSize: "1rem"}}>Time (seconds)</TableCell>
                    <TableCell style={{fontWeight: "bold", fontSize: "1rem"}}>Map Name</TableCell>
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