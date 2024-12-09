import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
    HiUser,
    HiDocumentText,
    HiOutlineUserGroup,
    HiChartPie,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../redux/user/userSlice';
export default function DashSidebar() {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignout = async () => {
        dispatch(logout());
    };

    return (
        <Sidebar className="w-full wd:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    {currentUser.role === "admin" && (
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item
                                active={tab === "dash" || !tab}
                                icon={HiChartPie}
                                as="div"
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.role === "oprator" && (
                        <Link to="/dashboard?tab=attendence">
                            <Sidebar.Item
                                active={tab === "attendence"}
                                label={currentUser.role === "admin" ? "Admin" : currentUser.role === "oprator" ? "Oprator" : currentUser.role === "hr" ? "Hr" : "Employee"}
                                icon={HiDocumentText}
                                as="div"
                            >
                                Attendence
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.role === "hr" && (
                        <Link to="/dashboard?tab=employee">
                            <Sidebar.Item
                                active={tab === "Employee"}
                                label={currentUser.role === "admin" ? "Admin" : currentUser.role === "oprator" ? "Oprator" : currentUser.role === "hr" ? "Hr" : "Employee"}
                                icon={HiOutlineUserGroup}
                                as="div"
                            >
                                Employee
                            </Sidebar.Item>
                        </Link>
                    )}

                    <Sidebar.Item
                        icon={HiUser}
                        className="cursor-pointer"
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}