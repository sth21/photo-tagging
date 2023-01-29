import { useNavigate } from "react-router-dom";
import uniqid from 'uniqid';

export default function App(props) {
  const navigate = useNavigate();
  
  return (
    <main id="app">
      { props.gameData.map((game) => (
        <button className="game-option" onClick={ () => { props.setActiveMap(game); navigate("/game") }} key={ uniqid() }>
          <p>{ (game !== undefined) ? game.mapName : "Map not available" }</p>
        </button>
      )) }
    </main>
  );
}