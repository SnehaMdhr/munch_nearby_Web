import AdminTabSwitcher from "./_components/AdminTabSwitcher";
import UsersPage from "./users/page";
import ApprovalPage from "./approvals/page";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const tab = query.tab === "approvals" ? "approvals" : "users";

  const approvalsContent = <ApprovalPage />;

  return (
    <AdminTabSwitcher
      initialTab={tab}
      usersContent={
        <UsersPage
          searchParams={searchParams}
          basePath="/admin"
          tabParam="users"
        />
      }
      approvalsContent={approvalsContent}
    />
  );
}
