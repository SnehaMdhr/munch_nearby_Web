import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateMenuForm from "@/app/restaurantowner/menu/_components/CreateMenuForm";
import { handleCreateMenu } from "@/lib/actions/menu-actions";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

jest.mock("@/lib/actions/menu-actions", () => ({
  handleCreateMenu: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("CreateMenuForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render in modal mode when closed", () => {
    const { container } = render(
      <CreateMenuForm isOpen={false} onClose={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("submits valid menu payload successfully", async () => {
    const user = userEvent.setup();
    (handleCreateMenu as jest.Mock).mockResolvedValue({ success: true });

    const { container } = render(<CreateMenuForm />);

    const nameInput = container.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;
    const priceInput = container.querySelector(
      'input[name="price"]',
    ) as HTMLInputElement;
    const categoryInput = container.querySelector(
      'input[name="category"]',
    ) as HTMLInputElement;

    await user.type(nameInput, "Burger");
    await user.type(priceInput, "12");
    await user.type(categoryInput, "Fast Food");

    await user.click(screen.getByRole("button", { name: /create menu item/i }));

    await waitFor(() => {
      expect(handleCreateMenu).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith("/restaurantowner/menu");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
