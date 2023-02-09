import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../firebase';

export default function Leaderboard() {
  const [ leaderboard, setLeaderboard ] = useState([]);

  useEffect(() => {
    const fetchGameData = async () => {
      const data = await getDocs(collection(DB, "leaderboard"));
      setLeaderboard(data.docs.map((doc) => doc.data()));
    }
    fetchGameData();
  }, []);
  
  return (
      <main className="leaderboard">
        { 
          ( leaderboard.length !== 0 )
          ? <table>
              <tr>
                <th>Player Name</th>
                <th>Time (seconds)</th>
                <th>Map</th>
              </tr>
              {
                leaderboard.map((player) => (
                  <tr>
                    <td>{ player.name }</td>
                    <td>{ player.time }</td>
                    <td>{ player.map }</td>
                  </tr>
                ))
              }
            </table>
          : <p>Be the first one to play!</p>
        }
      </main>
    );
  }