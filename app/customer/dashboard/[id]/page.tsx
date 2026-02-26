import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  redirect(`/customer/dashboard/${id}/menu`);
}