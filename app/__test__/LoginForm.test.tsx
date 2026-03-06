import { fireEvent, render, screen } from "@testing-library/react";
import LoginForm from "../(auth)/_components/LoginForm";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    setIsAuthenticated: jest.fn(),
    setUser: jest.fn(),
    checkAuth: jest.fn(),
  }),
}));

jest.mock("@/lib/actions/auth-actions", () => ({
  handleLogin: jest.fn(),
  handleGoogleLogin: jest.fn(),
  handleRegister: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

describe("LoginForm", () => {
  it("renders modal content when open", () => {
    render(<LoginForm isModal isOpen />);
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("does not render when modal is closed", () => {
    const { container } = render(<LoginForm isModal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("calls switchToRegister when clicking Create Account in modal mode", () => {
    const switchToRegister = jest.fn();
    render(<LoginForm isModal isOpen switchToRegister={switchToRegister} />);

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));
    expect(switchToRegister).toHaveBeenCalledTimes(1);
  });
});
