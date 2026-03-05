import { render, screen } from "@testing-library/react";
import Page from "../restaurantowner/dashboard/page";

const redirectMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  redirect: (...args: any[]) => redirectMock(...args),
}));

jest.mock(
  "@/app/restaurantowner/dashboard/_components/DashboardClient",
  () => ({
    __esModule: true,
    default: () => <div>Dashboard Client</div>,
  }),
);

jest.mock("@/lib/actions/restaurant-actions", () => ({
  handleGetMyRestaurant: jest.fn().mockResolvedValue({
    success: true,
    data: { status: "PENDING", menus: [] },
  }),
}));

jest.mock("@/lib/actions/review-actions", () => ({
  handleGetReviewsForOwner: jest
    .fn()
    .mockResolvedValue({ success: true, data: [] }),
}));

describe("restaurant owner dashboard page", () => {
  it("shows pending status message when restaurant is not approved", async () => {
    const ui = await Page();
    render(ui);

    expect(
      screen.getByText(/under review\. Please wait for admin approval\./i),
    ).toBeInTheDocument();
  });
});
