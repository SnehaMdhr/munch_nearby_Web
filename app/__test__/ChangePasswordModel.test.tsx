import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePasswordModal from "@/app/_components/ChangePasswordModel";
import { handleChangePassword } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";

jest.mock("@/lib/actions/auth-actions", () => ({
  handleChangePassword: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ChangePasswordModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <ChangePasswordModal isOpen={false} onClose={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("submits valid form and closes on success", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();

    (handleChangePassword as jest.Mock).mockResolvedValue({ success: true });

    render(<ChangePasswordModal isOpen onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/old password/i), "oldpass1");
    await user.type(
      screen.getByPlaceholderText(/enter new password/i),
      "newpass12",
    );
    await user.type(
      screen.getByPlaceholderText(/confirm new password/i),
      "newpass12",
    );

    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(handleChangePassword).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalled();
    });

    jest.advanceTimersByTime(1500);
    expect(onClose).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
