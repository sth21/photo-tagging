import { useEffect, useRef } from 'react';
import { StyledNav, StyledH1, StyledLink } from './CSSModules';

export default function Nav(props) {
    const navBarRef = useRef(null);
  
    // Handle changes to the image height and width
    useEffect(() => {
      const handleResize = () => {
        props.setNavBarHeight(navBarRef.current.offsetHeight);
      }
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, [ navBarRef, props ]);
  
    return (
      <StyledNav ref={ navBarRef }>
          <StyledLink to="/leaderboard">Leaderboard</StyledLink>
          <StyledH1>Photo Tagging App</StyledH1>
          <StyledLink to="/">Menu</StyledLink>
      </StyledNav>
    );
  }