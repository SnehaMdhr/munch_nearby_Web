import { fireEvent, render, screen } from "@testing-library/react";
import ResetPasswordModal from "../(auth)/_components/ResetPasswordModal";

jest.mock("@/lib/actions/auth-actions", () => ({
  handleRequestPasswordReset: jest.fn(),
  handleResetPassword: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

describe("ResetPasswordModal", () => {
  it("does not render when closed", () => {
    const { container } = render(
      <ResetPasswordModal isOpen={false} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders request step when open", () => {
    render(<ResetPasswordModal isOpen onClose={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send OTP/i })).toBeInTheDocument();
  });

  it("calls switchToLogin when Back to LogIn is clicked", () => {
    const switchToLogin = jest.fn();
    render(
      <ResetPasswordModal
        isOpen
        onClose={jest.fn()}
        switchToLogin={switchToLogin}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Back to LogIn/i }));
    expect(switchToLogin).toHaveBeenCalledTimes(1);
  });
});