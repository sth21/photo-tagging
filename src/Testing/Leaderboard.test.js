import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Leaderboard from '../Components/Leaderboard';

const sort = (prevState, actionType) => {
    const newState = [ ...prevState ];
    return ( actionType === "time" )
      ? newState.sort((a, b) => a[actionType] - b[actionType])
      : newState.sort((a, b) => a[actionType].localeCompare(b[actionType]));
};

const mockData = [
    { name: "B", time: 1, map: "New York" },
    { name: "D", time: 3, map: "Paris" },
    { name: "A", time: 11, map: "Rome" },
    { name: "C", time: 4, map: "New York" },
    { name: "E", time: 5, map: "New York" },
];

jest.mock("../Components/Leaderboard", () => ({ leaders, sortFn }) => (
    <main>
        {  
            ( leaders.length !== 0 )
            ? <table>
                <thead>
                    <tr>
                        <th onClick={ () => sortFn(leaders, "name") }>Name</th>
                        <th onClick={ () => sortFn(leaders, "time") }>Time</th>
                        <th onClick={ () => sortFn(leaders, "map") }>Map</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        leaders
                            .sort((a, b) => a.time - b.time)
                            .map((leader, index) => (
                                <tr key={ index }>
                                    <td>{ leader.name }</td>
                                    <td>{ leader.time }</td>
                                    <td>{ leader.map }</td>
                                </tr>
                            ))
                    }
                </tbody>
              </table>
            : <p role="status">Be the first to play</p>
        }
    </main>
));

test("Renders a p element if leaders are empty", () => {
    render(<Leaderboard leaders={ [] }/>);
    expect(screen.getByRole("status").textContent).toBe("Be the first to play");
});

test("Renders a table row for each leader", () => {
    render(<Leaderboard leaders={ mockData } />);
    expect(screen.getAllByRole("row").length).toBe(6);
});

test("Renders the correct data for a row", () => {
    render(<Leaderboard leaders={ [{ name: "A", time: 1, map: "New York" }] } />);
    const cells = screen.getAllByRole("cell");
    expect(cells[0].textContent).toBe("A");
    expect(cells[1].textContent).toBe("1");
    expect(cells[2].textContent).toBe("New York");
});

test("Sorts on respective row click", () => {
    const foo = jest.fn((prevState, actionType) => sort(prevState, actionType));
    render(<Leaderboard leaders = { mockData } sortFn={ foo } />);
    const headers = screen.getAllByRole("columnheader");
    headers.forEach((header) => userEvent.click(header));
    expect(foo.mock.results[0].value).toStrictEqual([
        { name: "A", time: 11, map: "Rome" },
        { name: "B", time: 1, map: "New York" },
        { name: "C", time: 4, map: "New York" },
        { name: "D", time: 3, map: "Paris" },
        { name: "E", time: 5, map: "New York" },
    ]);
    expect(foo.mock.results[1].value).toStrictEqual([
        { name: "B", time: 1, map: "New York" },
        { name: "D", time: 3, map: "Paris" },
        { name: "C", time: 4, map: "New York" },
        { name: "E", time: 5, map: "New York" },
        { name: "A", time: 11, map: "Rome" },
    ]);
    expect(foo.mock.results[2].value).toStrictEqual([
        { name: "B", time: 1, map: "New York" },
        { name: "C", time: 4, map: "New York" },
        { name: "E", time: 5, map: "New York" },
        { name: "D", time: 3, map: "Paris" },
        { name: "A", time: 11, map: "Rome" },
    ]);
});