import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";

import DonateCard from "../DonateCard";
import Organizations from "../Organizations";

// import Donate from "../Organizations";

test("should render donate component", () => {
  render(<Organizations />);
  const donateElement = screen.getByTestId("donate-test-title");
  expect(donateElement).toBeInTheDocument();

  expect(donateElement).toHaveTextContent("DONATE");
});

test("matches donate card snapshot", () => {
  const sampleData = {
    name: "Lorem Charity",
    website: "https://via.placeholder.com/",
    logo: "https://via.placeholder.com/150",
    location: "Lorem States",
    founded: 9000,
    mission: "Peace of Lorem",
  };
  const tree = renderer
    .create(
      <BrowserRouter>
        <DonateCard ch={sampleData} />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("Test for filtering", async () => {
  render(<Organizations />);
  const user = userEvent.setup();
  const locationDropdown = screen.getByLabelText(/Filter by place:/i);
  await user.selectOptions(locationDropdown, "united states");

  expect(
    screen.getByRole("option", {
      name: "united states",
    }).selected
  ).toBe(true);

  expect(
    screen.queryByRole("option", {
      name: "india",
    }).selected
  ).toBe(false);

  expect(
    screen.queryByText(/^Location: ((?!United States).)*$/i)
  ).not.toBeInTheDocument();

  expect(
    screen.queryAllByText(/^Location: United States$/i).length
  ).toBeGreaterThan(0);

  expect(
    screen.getByRole("option", { name: "united states" })
  ).toBeInTheDocument();

  expect(screen.getAllByRole("option").length).toBe(11);
});
