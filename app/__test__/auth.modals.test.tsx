import { render, screen } from "@testing-library/react";
import LoginForm from "../(auth)/_components/LoginForm";
import RegisterForm from "../(auth)/_components/RegisterForm";

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

describe("auth modal rendering", () => {
  it("renders login modal content when open", () => {
    render(<LoginForm isModal isOpen />);

    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("does not render register modal when closed", () => {
    const { container } = render(<RegisterForm isModal isOpen={false} />);

    expect(container.firstChild).toBeNull();
  });
});
