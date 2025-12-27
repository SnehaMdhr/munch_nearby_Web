import LoginForm from "../_components/LoginForm"

export default function Page() {
    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h1 className="text-2xl text-[#E87A5D] font-semibold ">MunchNearby</h1>
                <h2 className="text-2xl mt-6 font-semibold">Welcome back!</h2>
            </div>
            <LoginForm/>
        </div>
    );
}