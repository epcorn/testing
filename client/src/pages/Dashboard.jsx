import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from '../components/DashSidebar';
import Attendence from "../components/Attendence";
import Employee from "../components/Employee";
import { useSelector } from 'react-redux';


export default function Dashboard() {
    const { currentUser } = useSelector(store => store.user);
    const location = useLocation();
    const [tab, setTab] = useState(currentUser.role === "hr" ? "employee" : "attendence");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    return (
        <div className=" min-h-screen flex">
            <div className=" md:w-56">
                {/*Sidebar */}
                <DashSidebar />
            </div>
            {/* Attendece */}
            {tab === "attendence" && <Attendence />}
            {/* Employees */}
            {tab === "employee" && <Employee />}

        </div>
    );
}