import { handleGetMenuById } from "@/lib/actions/menu-actions";
import UpdateMenuForm from "../../_components/UpdateMenuForm";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const response = await handleGetMenuById(id);

    if (!response.success) {
        throw new Error(response.message || 'Failed to load user');
    }

    return (
        <div>
            <UpdateMenuForm menu={response.data} />
        </div>
    );
}