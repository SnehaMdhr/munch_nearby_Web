import { handleWhoAmI } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";
import Header from "@/app/(public)/_components/Header";

export default async function Page() {
  const result = await handleWhoAmI();
  if (!result.success) {
    throw new Error("Error");
  }
  if (!result.data) {
    notFound();
  }
  return (
    <div className="flex ">
      <Header />
      <div className="flex-1 p-1 bg-[#F3F4F6]">
        <ProfileForm user={result.data} />
      </div>
    </div>
  );
}
