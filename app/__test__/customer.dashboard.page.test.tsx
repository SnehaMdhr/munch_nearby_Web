import { render, screen, waitFor } from "@testing-library/react";
import { DashboardPageContent } from "../customer/dashboard/page";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { name: "Test User", role: "Customer" } }),
}));

jest.mock("@/lib/actions/restaurant-actions", () => ({
  handleGetAllRestaurants: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        _id: "r1",
        name: "Pizza Hub",
        category: "Italian",
        address: "123 Main St",
        openingHours: [],
      },
    ],
  }),
}));

jest.mock("@/lib/actions/favourite-actions", () => ({
  handleAddToFavourite: jest.fn(),
  handleRemoveFromFavourite: jest.fn(),
  handleGetMyFavourites: jest
    .fn()
    .mockResolvedValue({ success: true, data: [] }),
}));

jest.mock("@/app/_components/RestaurantMapSheet", () => ({
  __esModule: true,
  default: () => <div data-testid="map-sheet" />,
}));

jest.mock("@/app/customer/_components/Header", () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

jest.mock("react-toastify", () => ({
  toast: { info: jest.fn(), error: jest.fn(), success: jest.fn() },
}));

describe("customer dashboard page", () => {
  it("renders fetched restaurant", async () => {
    render(<DashboardPageContent hideHeader />);

    await waitFor(() => {
      expect(screen.getByText("Pizza Hub")).toBeInTheDocument();
    });
  });
});
