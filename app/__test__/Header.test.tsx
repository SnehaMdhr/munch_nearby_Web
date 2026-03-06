import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../customer/_components/Header";

const logoutMock = jest.fn();
const checkAuthMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: () => "/customer/dashboard",
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Jane Doe", imageUrl: "" },
    logout: logoutMock,
    checkAuth: checkAuthMock,
  }),
}));

jest.mock("@/app/customer/profile/_components/ProfileForm", () => ({
  __esModule: true,
  default: () => <div>Profile Form</div>,
}));

jest.mock("@/app/_components/ChangePasswordModel", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Change Password Modal</div> : null,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, ...props }: any) => <img {...props} />,
}));

describe("Customer Header", () => {
  it("renders primary navigation items", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("opens dropdown and triggers logout", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /jane/i }));
    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
