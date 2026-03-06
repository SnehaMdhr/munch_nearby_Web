import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailModal from "@/app/admin/_components/DetailModel";

jest.mock("@/app/_components/RestaurantMapSheet", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div>Restaurant Map Sheet</div> : null,
}));

jest.mock("@/app/admin/_components/MenuModel", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div>Menu Modal</div> : null,
}));

jest.mock("@/app/admin/_components/ReviewModel", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div>Review Modal</div> : null,
}));

describe("DetailModal", () => {
  const restaurant = {
    _id: "r1",
    name: "Sunset Dine",
    address: "123 Main Street",
    contactNumber: "9800000000",
    ownerName: "Owner Name",
    email: "owner@example.com",
    category: "Nepali",
    description: "Great food",
    status: "APPROVED",
    createdAt: "2026-03-01T00:00:00.000Z",
    openingHours: [
      { day: "Monday", open: "09:00", close: "21:00", isClosed: false },
    ],
  };

  it("renders restaurant details", () => {
    render(
      <DetailModal
        restaurant={restaurant}
        onClose={jest.fn()}
        getStatusStyle={() => "status-class"}
      />,
    );

    expect(screen.getByText("Sunset Dine")).toBeInTheDocument();
    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    expect(screen.getByText("APPROVED")).toBeInTheDocument();
  });

  it("calls onClose when close profile is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <DetailModal
        restaurant={restaurant}
        onClose={onClose}
        getStatusStyle={() => "status-class"}
      />,
    );

    await user.click(screen.getByRole("button", { name: /close profile/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("opens map, menu and review modals", async () => {
    const user = userEvent.setup();

    render(
      <DetailModal
        restaurant={restaurant}
        onClose={jest.fn()}
        getStatusStyle={() => "status-class"}
      />,
    );

    await user.click(screen.getByRole("button", { name: /view map/i }));
    await user.click(screen.getByRole("button", { name: /view menu/i }));
    await user.click(screen.getByRole("button", { name: /view reviews/i }));

    expect(screen.getByText("Restaurant Map Sheet")).toBeInTheDocument();
    expect(screen.getByText("Menu Modal")).toBeInTheDocument();
    expect(screen.getByText("Review Modal")).toBeInTheDocument();
  });
});
