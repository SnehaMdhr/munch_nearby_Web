import { render, screen, waitFor } from "@testing-library/react";
import Page from "../customer/favourites/page";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { _id: "u1", role: "Customer" } }),
}));

jest.mock("@/lib/actions/restaurant-actions", () => ({
  handleGetAllRestaurants: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        _id: "r1",
        name: "Burger Point",
        category: "Fast Food",
        address: "Central Avenue",
        imageUrl: "/img.png",
        rating: 4.7,
      },
    ],
  }),
}));

jest.mock("@/lib/actions/favourite-actions", () => ({
  handleAddToFavourite: jest.fn(),
  handleRemoveFromFavourite: jest.fn(),
  handleGetMyFavourites: jest.fn().mockResolvedValue({
    success: true,
    data: [{ restaurant: { _id: "r1" } }],
  }),
}));

jest.mock("@/app/customer/_components/Header", () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

describe("favourites page", () => {
  it("shows favourite restaurants from fetched data", async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("Burger Point")).toBeInTheDocument();
    });
  });
});
