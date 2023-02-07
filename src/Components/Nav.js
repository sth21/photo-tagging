import { StyledNav, StyledH1, StyledLink } from './CSSModules';

export default function Nav(props) {  
    return (
      <StyledNav>
          <StyledLink to="/leaderboard">Leaderboard</StyledLink>
          <StyledH1>Photo Tagging App</StyledH1>
          <StyledLink to="/">Menu</StyledLink>
      </StyledNav>
    );
  }