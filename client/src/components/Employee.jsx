import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from '../redux/employee/employeeSlice';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import Loading from './Loading';
import { Button, Table, TextInput } from 'flowbite-react';
import { FaUserEdit } from "react-icons/fa";
import NewEmployeeModal from './NewEmployeeModal';



function Employee() {
    const dispatch = useDispatch();
    const { loading, employees } = useSelector(state => state.workers);
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [openModal, setOpenModal] = useState(false);

    function handleSubmit() {
        console.log(searchTerm);
    }

    useEffect(() => {
        dispatch(getEmployees());
    }, []);
    return (
        <div className='flex-col mt-2 mx-auto '>
            {loading && <Loading />}
            <div className=' flex justify-between mr-2'>
                <div></div>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type="text"
                        value={searchTerm}
                        placeholder="Search..."
                        rightIcon={AiOutlineSearch}
                        className=""
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button outline gradientDuoTone="greenToBlue" className='w-24' onClick={() => setOpenModal(true)}>
                    <div className='flex items-center justify-around w-full'>
                        <span>New</span>
                        <FaUserEdit />
                    </div>
                </Button>
            </div>
            <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
                {currentUser.role === "hr" && employees.length > 0 ? (
                    <>
                        <Table hoverable className=" shadow-md">
                            <Table.Head>
                                <Table.HeadCell>Employee ID</Table.HeadCell>
                                <Table.HeadCell>Name</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Phone</Table.HeadCell>
                                <Table.HeadCell>Role</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Division</Table.HeadCell>
                                <Table.HeadCell>Company</Table.HeadCell>

                            </Table.Head>
                            {employees?.map((employee) => (
                                <Table.Body key={employee._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            {employee._id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {`${employee.firstname} ${employee.lastname}`}
                                        </Table.Cell>
                                        <Table.Cell>{employee.email}</Table.Cell>
                                        <Table.Cell>{employee.phone}</Table.Cell>
                                        <Table.Cell>{employee.role}</Table.Cell>
                                        <Table.Cell>{employee.category}</Table.Cell>
                                        <Table.Cell>{employee.division}</Table.Cell>
                                        <Table.Cell>{employee.company}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                    </>
                ) : (
                    <p className=' text-center font-bold'>No Data found!!</p>
                )}
            </div>
            <NewEmployeeModal openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
}

export default Employee;