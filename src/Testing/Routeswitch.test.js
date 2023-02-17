import { screen, render } from '@testing-library/react';
import Routeswitch from '../Components/Routeswitch';

test("Loads App Component by default", () => {
    render(<Routeswitch />);
    expect(screen.getByRole("main").dataset.module).toBe("app");
});