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
});
