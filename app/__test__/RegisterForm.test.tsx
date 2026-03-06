import { render, screen } from "@testing-library/react";
import RegisterForm from "../(auth)/_components/RegisterForm";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/actions/auth-actions", () => ({
  handleRegister: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

describe("RegisterForm", () => {
  it("renders modal content when open", () => {
    render(<RegisterForm isModal isOpen />);
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  it("does not render when modal is closed", () => {
    const { container } = render(<RegisterForm isModal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders non-modal form by default", () => {
    render(<RegisterForm />);
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
  });
});