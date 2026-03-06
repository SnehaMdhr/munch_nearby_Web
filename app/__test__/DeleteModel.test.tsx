import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteModal from "@/app/_components/DeleteModel";

describe("DeleteModal", () => {
  it("does not render when closed", () => {
    const { container } = render(
      <DeleteModal
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Delete User"
        description="This action is permanent"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders title and description when open", () => {
    render(
      <DeleteModal
        isOpen
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Delete User"
        description="This action is permanent"
      />,
    );

    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(screen.getByText("This action is permanent")).toBeInTheDocument();
  });

  it("triggers callbacks for cancel and delete", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <DeleteModal
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete User"
        description="This action is permanent"
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
