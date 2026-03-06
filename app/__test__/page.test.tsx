import { render, screen } from "@testing-library/react";

const redirectMock = jest.fn();
const handleGetMyRestaurantMock = jest.fn();
const handleGetReviewsForOwnerMock = jest.fn();

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
  __esModule: true,
  handleGetMyRestaurant: (...args: any[]) => handleGetMyRestaurantMock(...args),
}));

jest.mock("@/lib/actions/review-actions", () => ({
  __esModule: true,
  handleGetReviewsForOwner: (...args: any[]) =>
    handleGetReviewsForOwnerMock(...args),
}));

// Prevent Request/next-cache crash from transitive server imports
jest.mock("next/cache", () => ({
  __esModule: true,
  unstable_cache: (fn: any) => fn,
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock("@/lib/actions/menu-actions", () => ({
  __esModule: true,
  getMenuById: jest.fn(async () => ({ success: true, data: null })),
  getRestaurantMenu: jest.fn(async () => ({ success: true, data: [] })),
}));

describe("restaurant owner dashboard page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dashboard client when owner restaurant is available", async () => {
    handleGetMyRestaurantMock.mockResolvedValue({
      success: true,
      data: { status: "APPROVED", menus: [{ id: "m1" }] },
    });

    handleGetReviewsForOwnerMock.mockResolvedValue({
      success: true,
      data: [],
    });

    const mod = await import("../restaurantowner/dashboard/page");
    const Page = mod.default;

    const ui = await Page();
    render(ui);

    expect(screen.getByText("Dashboard Client")).toBeInTheDocument();
  });
});
