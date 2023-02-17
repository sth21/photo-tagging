import { screen, render } from '@testing-library/react';
import Routeswitch from '../Components/Routeswitch';
import userEvent from '@testing-library/user-event';

test("Goes to leaderboard page on link click", () => {
    render(<Routeswitch />);
    const leaderBoardLink = screen.getByRole("link", { name: /leaderboard/i });
    userEvent.click(leaderBoardLink);
    expect(screen.getByRole("main").className).toBe("leaderboard");
})

test("Goes to main page on link click", () => {
    render(<Routeswitch />);
    const leaderBoardLink = screen.getByRole("link", { name: /leaderboard/i });
    userEvent.click(leaderBoardLink);
    const homeLink = screen.getByRole("link", { name: /menu/i });
    userEvent.click(homeLink);
    expect(screen.getByRole("main").dataset.module).toBe("app");
})