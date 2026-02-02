import Sidebar from "../_components/SideBar";

export default function Page() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6">Welcome</div>
    </div>
  );
}
