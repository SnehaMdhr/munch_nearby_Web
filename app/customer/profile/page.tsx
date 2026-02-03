import { handleWhoAmI } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import Sidebar from "../_components/SideBar";
import ProfileForm from "./_components/ProfileForm";

export default async function Page() {
  const result = await handleWhoAmI();
    if(!result.success){
        throw new Error("Error");
    }
    if(!result.data){
        notFound();
    }
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <ProfileForm user={result.data} />
      </div>
    </div>
  );
}
