import Sidebar from "../../_components/SideBar";
import CreateRestaurantForm from "../_components/CreateResturantForm";

export default function Page() {
    return (
        <div className="flex">
              <Sidebar />
              <div className="flex-1 p-6">
        
            <CreateRestaurantForm/>
        </div>
        </div>
    );
}