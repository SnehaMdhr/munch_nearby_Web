import { handleGetOneUser } from "@/lib/actions/admin/user-actions";
import ViewUserForm from "@/app/admin/_components/ViewUserForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await handleGetOneUser(id);

  if (!response.success) {
    throw new Error(response.message || "Failed to load user");
  }

  const user = response.data;

  return (
    <ViewUserForm id={id} user={user} />
  );
}
