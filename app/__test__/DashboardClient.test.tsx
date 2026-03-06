import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardClient from "../restaurantowner/dashboard/_components/DashboardClient";

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ refresh: refreshMock }),
}));

jest.mock("@/app/restaurantowner/_components/Header", () => ({
  __esModule: true,
  default: () => <div>Owner Header</div>,
}));

jest.mock(
  "@/app/restaurantowner/dashboard/_components/UpdateRestaurantModel",
  () => ({
    __esModule: true,
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div>Update Restaurant Modal</div> : null,
  }),
);

describe("DashboardClient", () => {
  it("renders stats and review content", () => {
    render(
      <DashboardClient restaurant={undefined} menuCount={0} reviews={[]} />,
    );

    expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();

    // Current fallback state in rendered output
    expect(screen.getByText(/0\.0/i)).toBeInTheDocument();
    expect(screen.getByText(/No reviews yet\./i)).toBeInTheDocument();
  });

  it("opens update modal when clicking update button", async () => {
    const user = userEvent.setup();
    render(
      <DashboardClient
        restaurant={{ averageReviews: 0, totalReviews: 0 }}
        menuCount={0}
        reviews={[]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /update restaurant details/i }),
    );
    expect(screen.getByText(/Update Restaurant Modal/i)).toBeInTheDocument();
  });
});
