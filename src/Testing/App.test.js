import { screen, render, waitFor } from '@testing-library/react';
import Routeswitch from '../Components/Routeswitch';
import { BrowserRouter } from 'react-router-dom';
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../Components/App';

const mockGameData = [
    { mapName: "New York City" },
    { mapName: "Paris" },
    { mapName: "Rome" },
    { mapName: "Rio de Janiaro" },
]

test("Renders four game buttons with names provided", async () => {
    render(
        <BrowserRouter>
            <App gameData={ mockGameData } setActiveMap={ jest.fn() } />
        </BrowserRouter>
    );
    const buttons = screen.getAllByRole("button");    
    expect(buttons.length).toBe(4);
    expect(buttons[0].textContent).toBe("New York City");
});

test("Renders default text if game undefined", async () => {
    render(
        <BrowserRouter>
            <App gameData={[undefined, undefined, undefined, undefined]} setActiveMap={ jest.fn() } />
        </BrowserRouter>
    );
    const buttons = screen.getAllByRole("button");   
    expect(buttons[0].textContent).toBe("Map not available");
});