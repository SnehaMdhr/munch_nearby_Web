import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { handleCreateRestaurant } from "@/lib/actions/restaurant-actions";
import RestaurantOnboardingModal from "../restaurantowner/_components/RestaurantOnboardingModal";

jest.mock("@/lib/actions/restaurant-actions", () => ({
  handleCreateRestaurant: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("RestaurantOnboardingModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("submits restaurant form successfully", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onCreated = jest.fn();

    (handleCreateRestaurant as jest.Mock).mockResolvedValue({
      success: true,
      data: { restaurant: { _id: "r1", name: "My Restaurant" } },
    });

    render(
      <RestaurantOnboardingModal
        open
        onClose={onClose}
        onCreated={onCreated}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/kathmandu kitchen/i),
      "My Restaurant",
    );
    await user.type(screen.getByPlaceholderText(/\+977 98/i), "9800000000");
    await user.type(
      screen.getByPlaceholderText(/goo\.gl\/maps/i),
      "https://maps.google.com",
    );
    await user.type(screen.getByPlaceholderText(/lazimpat/i), "Kathmandu Road");
    await user.type(
      screen.getByPlaceholderText(/italian, bakery, newari/i),
      "Nepali",
    );

    await user.click(
      screen.getByRole("button", { name: /Create Restaurant Profile/i }),
    );

    await waitFor(() => {
      expect(handleCreateRestaurant).toHaveBeenCalledTimes(1);
      expect(onCreated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
