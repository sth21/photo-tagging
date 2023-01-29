import { Link } from "react-router-dom";

export default function App() {
    return (
      <nav>
        <h1>Photo Tagging</h1>
        <Link to="/">Menu</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
    );
  }