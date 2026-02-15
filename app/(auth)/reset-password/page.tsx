import ResetPasswordForm from "../_components/ResetPasswordForm";


export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const token = query.token as string | undefined;
    if(!token){
        throw new Error('Invalid or missing token');
    }

    return (
        <div>
            <div className="text-center">
                <h1 className="text-2xl text-[#E87A5D] font-semibold ">MunchNearby</h1>
                <h2 className="text-2xl mt-6 font-semibold">Enter New Password</h2>
            </div>
            <ResetPasswordForm token={token} />
        </div>
    );
}