import { useNavigate } from "react-router-dom";
import { StyledApp, StyledGameButton, StyledGamePreview, StyledGameLabel } from './CSSModules';
import uniqid from 'uniqid';

export default function App(props) {
  const navigate = useNavigate();
  
  return (
    <StyledApp role="main" data-module="app">
      { props.gameData.map((game) => (
        <StyledGameButton imageUrl={ (game !== undefined) ? game.imageUrl : null } onClick={ () => { props.setActiveMap(game); navigate("/game") }} key={ uniqid() }>
          <StyledGamePreview src={ (game !== undefined) ? game.imageUrl : "https://via.placeholder.com/300" } alt={ (game !== undefined) ? game.mapName : "Map not available" } ></StyledGamePreview>
          <StyledGameLabel>{ (game !== undefined) ? game.mapName : "Map not available" }</StyledGameLabel>
        </StyledGameButton>
      )) }
    </StyledApp>
  );
}