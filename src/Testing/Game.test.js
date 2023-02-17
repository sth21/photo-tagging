import { screen, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/react';
import Game from '../Components/Game';

const mockPropsA = {
    gameOver: true,
    mapName: "New York City",
    clickLocation: [ .113, .714 ],
};

const mockPropsB = {
    gameOver: false,
    mapName: "New York City",
    clickLocation: [ .113, .714 ],
};

const mockPropsC = {
    gameOver: false,
    mapName: "New York City",
    clickLocation: undefined,
};

const realProps = {
    mapName: "New York City",
    imageUrl: "",
    objectives: [],
}

jest.mock("../Components/Game", () => (props) => {
    return (
        <main>
            { 
                ( props.gameOver ) 
                ? <form>
                    <input type="text" name="username" />
                    <button type="submit">Submit</button>
                  </form>
                : ( props.clickLocation )
                    ? <dialog>Dialog</dialog>
                    : <div>Image</div>
            }
        </main>
    );
});

test("Game component renders", () => {
    const OriginalGame = jest.requireActual("../Components/Game").default;
    const { container } = render(
        <BrowserRouter>
            <OriginalGame selectedGameData = { realProps } setActiveMap = { jest.fn() } />
        </BrowserRouter>
    );
    expect(container).toBeTruthy();
});

test("Dialog appears if clickLocation is not undefined", () => {
    render(<Game { ...mockPropsB } />);
    const main = screen.getByRole("main");
    expect(within(main).getByText("Dialog")).toBeTruthy();
});

test("Form appears if gameOver", () => {
    render(<Game { ...mockPropsA } />);
    const main = screen.getByRole("main");
    expect(within(main).getByText("Submit")).toBeTruthy();
});

test("Image appears if !gameOver && clickLocation undefined", () => {
    render(<Game { ...mockPropsC } />);
    const main = screen.getByRole("main");
    expect(within(main).getByText("Image")).toBeTruthy();
});
