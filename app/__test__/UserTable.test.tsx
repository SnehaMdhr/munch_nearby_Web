import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserTable from "@/app/admin/_components/UserTable";
import { handleDeleteUser } from "@/lib/actions/admin/user-actions";
import { toast } from "react-toastify";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("@/lib/actions/admin/user-actions", () => ({
  handleDeleteUser: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/app/admin/_components/CreateUserForm", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Create User Modal</div> : null,
}));

jest.mock("@/app/admin/_components/UpdateUserForm", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Update User Modal</div> : null,
}));

jest.mock("@/app/admin/_components/ViewUserForm", () => ({
  __esModule: true,
  default: () => <div>View User Modal</div>,
}));

describe("UserTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows empty state when no users are provided", () => {
    render(
      <UserTable users={[]} pagination={{ page: 1, pages: 1 }} search="john" />,
    );

    expect(screen.getByText(/No users found matching/i)).toBeInTheDocument();
  });

  it("opens create user modal", async () => {
    const user = userEvent.setup();

    render(
      <UserTable users={[]} pagination={{ page: 1, pages: 1 }} search="" />,
    );

    await user.click(screen.getByRole("button", { name: /add new user/i }));

    expect(screen.getByText("Create User Modal")).toBeInTheDocument();
  });

  it("debounces search and pushes updated URL", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <UserTable
        users={[]}
        pagination={{ page: 2, pages: 3, size: 10 }}
        search=""
        tabParam="users"
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/search by name or email/i),
      "abc",
    );

    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalled();
    });

    expect(pushMock.mock.calls.at(-1)?.[0]).toContain("tab=users");
    expect(pushMock.mock.calls.at(-1)?.[0]).toContain("page=1");
    expect(pushMock.mock.calls.at(-1)?.[0]).toContain("search=abc");

    jest.useRealTimers();
  });

  it("opens delete modal and confirms delete", async () => {
    const user = userEvent.setup();
    (handleDeleteUser as jest.Mock).mockResolvedValue({ success: true });

    render(
      <UserTable
        users={[{ _id: "u12345678", name: "Jane", email: "jane@example.com" }]}
        pagination={{ page: 1, pages: 1 }}
        search=""
      />,
    );

    const row = screen.getByText("Jane").closest("tr");
    expect(row).not.toBeNull();

    const buttons = row!.querySelectorAll("button");
    await user.click(buttons[2]);

    expect(screen.getByText(/Delete User/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(handleDeleteUser).toHaveBeenCalledWith("u12345678");
      expect(toast.success).toHaveBeenCalled();
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
