import { handleGetAllUsers } from "@/lib/actions/admin/user-actions";
import UserTable from "../_components/UserTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;

    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const size = query.size ? parseInt(query.size as string, 10) : 10;
    const search = query.search ? (query.search as string) : '';

    console.log("Search params:", { page, size, search });

    // call api
    const response = await handleGetAllUsers(page, size, search);
    console.log(response);

    if (!response.success) {
        throw new Error(response.message);
    }

    if (!response.users || !response.pagination) {
        throw new Error("No users found");
    }

    return (
        <div>
            <UserTable
                users={response.users}
                pagination={response.pagination}
                search={search}
            />
        </div>
    );
}
