import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RestaurantMapSheet from "@/app/_components/RestaurantMapSheet";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function MockMapClient({ restaurantId }: { restaurantId: string | null }) {
      return <div>Map Client: {restaurantId}</div>;
    },
}));

jest.mock("framer-motion", () => ({
  __esModule: true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => (
      <aside {...props}>{children}</aside>
    ),
  },
}));

describe("RestaurantMapSheet", () => {
  it("renders map sheet when open", async () => {
    render(
      <RestaurantMapSheet
        open
        onOpenChange={jest.fn()}
        restaurantId="r1"
        restaurants={[{ _id: "r1", name: "A" }]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Restaurant Map/i)).toBeInTheDocument();
      expect(screen.getByText(/Map Client: r1/i)).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) when pressing Escape", async () => {
    const onOpenChange = jest.fn();
    render(
      <RestaurantMapSheet
        open
        onOpenChange={onOpenChange}
        restaurantId="r1"
        restaurants={[{ _id: "r1", name: "A" }]}
      />,
    );

    await waitFor(() =>
      expect(screen.getByText(/Restaurant Map/i)).toBeInTheDocument(),
    );
    fireEvent.keyDown(window, { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
