import styled, { createGlobalStyle } from "styled-components";
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center, dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
  }

  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
      display: block;
  }

  ol, ul {
    list-style: none;
  }

  :root {
    --white: #fff;
    --mediumgray: #8F8F8F;
    --darkblue: #0071C5;
    --black: #222;
    background-color: var(--white);
    color: var(--black);
    min-height: 100vh;
    max-width: 100vw;
    font-size: 14px;
    font-family: 'Lato', sans-serif;
  }

  body, #root {
    min-height: inherit;
    width: inherit;
    line-height: 1;
  }

  body {
    padding-left: 5em;
    padding-right: 5em;
  }
`;

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--white);
  display: flex;
  color: var(--black);
  align-items: center;
  justify-content: space-between;
  padding: 3em 0em;
  text-align: center;
`;

const StyledLink = styled(Link)`
  font-size: 1.5rem;
  width: 40%;
  font-family: 'Lato', sans-serif;
  color: var(--black);

  &:hover, &:focus, &:active, &:visited {
    content: none;
  }
`;

const StyledH1 = styled.h1`
  font-size: 2.25rem;
  font-family: 'Lato', sans-serif;
`;

const StyledApp = styled.main`
    padding: 2.5em 0em;
    width: inherit;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 5em;
    justify-content: center;
`;

const StyledGameButton = styled.button`
    cursor: pointer;
    position: relative;
    border: 1px solid var(--darkblue);
    border-radius: 10px;
    background-color: var(--darkblue);
    padding: .5em;
    width: 100%;
    max-height: 500px;
    overflow: hidden;
`;

const StyledGamePreview = styled.img`
  width: 95%;
  height: auto;
  padding: 1em;
`;

const StyledGameLabel = styled.p`
  position: absolute;
  top: 0;
  padding: .75em 0em;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1.5rem;
  background-color: var(--darkblue);
  color: var(--white);
  width: 100%;
`;

const StyledGame = styled.main`
    padding: 2.5em 0em;
    max-width: 100vw;
`;

const StyledObjectiveBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--black);
  padding: 1em 0em;
`;

const StyledObjectiveLabel = styled.p`
  font-size: 1.25rem;
`;

const StyledGameImage = styled.img`
  width: 100%;
  height: auto;
`;

const StyledDialog = styled.dialog`
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--black);
  border-radius: 10px;
  align-items: center;
  gap: 2em;
  padding: 2em;
  margin: 0px;
  z-index: 1;
  top: ${ props => props.imgHeight * parseFloat(props.clickLocation[1], 10) }px;
  left: ${ props => props.imgWidth * parseFloat(props.clickLocation[0], 10) }px;
`;

export { 
    GlobalStyle, StyledNav, StyledLink, StyledH1, StyledApp, StyledGameButton, 
    StyledGamePreview, StyledGameLabel, StyledObjectiveBar, StyledObjectiveLabel, 
    StyledGame, StyledGameImage, StyledDialog
};