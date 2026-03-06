import { render, screen, waitFor } from "@testing-library/react";
import Page from "../restaurantowner/review/page";

jest.mock("@/lib/actions/review-actions", () => ({
  handleGetReviewsForOwner: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        _id: "rev1",
        rating: 5,
        comment: "Amazing service",
        createdAt: "2026-03-01T00:00:00.000Z",
        user: {
          _id: "u1",
          name: "Alice",
          email: "alice@example.com",
        },
      },
    ],
  }),
}));

jest.mock("@/app/restaurantowner/_components/Header", () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

describe("restaurant owner review page", () => {
  it("renders review summary and review card", async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/Based on 1 review/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText('"Amazing service"')).toBeInTheDocument();
  });
});
