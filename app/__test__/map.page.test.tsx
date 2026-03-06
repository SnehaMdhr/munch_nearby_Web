import { render, screen } from "@testing-library/react";
import Page from "../customer/map/page";

jest.mock("@/lib/actions/restaurant-actions", () => ({
  handleGetAllRestaurants: jest.fn().mockResolvedValue({
    success: true,
    data: [{ _id: "r1", name: "Map Resto" }],
  }),
}));

jest.mock("@/app/customer/map/MapWrapper", () => ({
  __esModule: true,
  default: ({ restaurants }: { restaurants: any[] }) => (
    <div>MapWrapper restaurants: {restaurants.length}</div>
  ),
}));

jest.mock("@/app/customer/_components/Header", () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

describe("map page", () => {
  it("renders map wrapper when restaurants load successfully", async () => {
    const ui = await Page();
    render(ui);

    expect(screen.getByText("MapWrapper restaurants: 1")).toBeInTheDocument();
  });
});
