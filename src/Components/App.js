import { useNavigate } from "react-router-dom";
import { StyledApp, StyledGameButton } from './CSSModules';
import uniqid from 'uniqid';

export default function App(props) {
  const navigate = useNavigate();
  
  return (
    <StyledApp role="main">
      { props.gameData.map((game) => (
        <StyledGameButton imageUrl={ (game !== undefined) ? game.imageUrl : null } onClick={ () => { props.setActiveMap(game); navigate("/game") }} key={ uniqid() }>
          <img src={ (game !== undefined) ? game.imageUrl : "https://via.placeholder.com/150" } alt={ (game !== undefined) ? game.mapName : "Map not available" } style={{visibility: "hidden"}}></img>
          <p>{ (game !== undefined) ? game.mapName : "Map not available" }</p>
        </StyledGameButton>
      )) }
    </StyledApp>
  );
}