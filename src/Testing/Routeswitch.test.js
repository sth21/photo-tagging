import { screen, render } from '@testing-library/react';
import Routeswitch from '../Components/Routeswitch';

const expectedImages = undefined;

const expectedObjectives = undefined;

test("Loads App Component by default", () => {
    render(<Routeswitch />);
    expect(screen.getByRole("main").className).toBe("app");
});

// Loads in correct images

// Loads in correct objectives

// Passes in correct information into game when clicked in App