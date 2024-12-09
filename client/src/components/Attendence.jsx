import { Button, Checkbox, Select, Table, TextInput } from "flowbite-react";
import DatePicker from "./DatePicker";
import { useSelector } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import {
  dayTypeness,
  toggleLateness,
  togglePresence,
} from "../redux/attendence/attendenceSlice";
import { toast } from "react-toastify";

function Attendence() {
  const workdayStatusDate = useSelector((state) => state.dayStat.date);
  const todayDate = new Date().toISOString().split("T")[0];
  const [block, setBlock] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { workdayStatus, loading } = useSelector((state) => state.dayStat);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchArray, setSearchArray] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (workdayStatusDate !== todayDate) {
      // If not equal, set block state to true
      setBlock(true);
    } else {
      setBlock(false);
    }
  }, [workdayStatusDate, todayDate]);

  const handleClick = (employeeId) => {
    dispatch(togglePresence(employeeId));
  };

  function handleLateness(id) {
    const status = workdayStatus.find((status) => status.employeeId === id);
    if (!status.isPresent) {
      toast.warning("Employee not Present yet!", { autoClose: 1000 });
      return;
    }
    dispatch(toggleLateness(id));
  }

  function handleType(e, id) {
    const type = e.target.value;
    const status = workdayStatus.find((status) => status.employeeId === id);
    if (!status.isPresent) {
      toast.warning("Employee not Present yet!", { autoClose: 1000 });
      return;
    }
    dispatch(dayTypeness({ id, type }));
  }



  useEffect(() => {
    function searchEmployees(query, employeeArray) {
      const results = [];

      // Convert the query to lowercase for case-insensitive search
      const lowercaseQuery = query.toLowerCase();

      employeeArray.forEach(employee => {
        const { firstname, lastname } = employee.employeeInfo;

        // Convert the first name and last name to lowercase for case-insensitive search
        const lowercaseFirstName = firstname.toLowerCase();
        const lowercaseLastName = lastname.toLowerCase();

        // Check if either the first name or last name contains the search query
        if (lowercaseFirstName.includes(lowercaseQuery) || lowercaseLastName.includes(lowercaseQuery)) {
          results.push(employee);
        }
      });
      console.log(results);
      setSearchArray(results);
    }
    searchEmployees(searchTerm, workdayStatus);
  }, [searchTerm, workdayStatus]);


  return (
    <div className="flex-col mt-2 mx-auto w-full ">
      {loading && <Loading />}
      <div className=" flex justify-between">
        <div></div>
        <form>
          <TextInput
            type="text"
            value={searchTerm}
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className=""
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <DatePicker />
      </div>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.role === "oprator" && workdayStatus.length > 0 && searchArray.length <= 0 ? (
          <>
            <Table hoverable className=" shadow-md">
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Check In time</Table.HeadCell>
                <Table.HeadCell>Select</Table.HeadCell>
                <Table.HeadCell>Attendance</Table.HeadCell>
                <Table.HeadCell>Late</Table.HeadCell>
              </Table.Head>
              {workdayStatus?.map((employee) => (
                <Table.Body key={employee.employeeId} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{`${employee.employeeInfo.firstname} ${employee.employeeInfo.lastname}`}</Table.Cell>
                    <Table.Cell>
                      {new Date(employee.checkInTime).toLocaleTimeString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        disabled={block}
                        checked={employee.isPresent} // Use checked instead of value and defaultChecked
                        onChange={(e) =>
                          handleClick(employee.employeeId, e.target.checked)
                        } // Use onChange instead of onClick for checkboxes
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Select
                        disabled={block}
                        id="type"
                        value={
                          employee.scheduleType === null
                            ? ""
                            : employee.scheduleType
                        }
                        onChange={(e) => handleType(e, employee.employeeId)}
                      >
                        <option value=""></option>
                        <option value="full">full</option>
                        <option value="half">half</option>
                      </Select>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        disabled={block}
                        onClick={() => handleLateness(employee.employeeId)}
                        className={` w-14 ${employee.isLate ? " bg-red-400" : "bg-green-400"
                          }`}
                      >
                        {employee.isLate ? "Late" : "No"}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        ) : (
          searchArray.length > 0 ? (
            <>
              <Table hoverable className=" shadow-md">
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Check In time</Table.HeadCell>
                  <Table.HeadCell>Select</Table.HeadCell>
                  <Table.HeadCell>Attendance</Table.HeadCell>
                  <Table.HeadCell>Late</Table.HeadCell>
                </Table.Head>
                {searchArray?.map((employee) => (
                  <Table.Body key={employee.employeeId} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{`${employee.employeeInfo.firstname} ${employee.employeeInfo.lastname}`}</Table.Cell>
                      <Table.Cell>
                        {new Date(employee.checkInTime).toLocaleTimeString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Checkbox
                          disabled={block}
                          checked={employee.isPresent} // Use checked instead of value and defaultChecked
                          onChange={(e) =>
                            handleClick(employee.employeeId, e.target.checked)
                          } // Use onChange instead of onClick for checkboxes
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Select
                          disabled={block}
                          id="type"
                          value={
                            employee.scheduleType === null
                              ? ""
                              : employee.scheduleType
                          }
                          onChange={(e) => handleType(e, employee.employeeId)}
                        >
                          <option value=""></option>
                          <option value="full">full</option>
                          <option value="half">half</option>
                        </Select>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          disabled={block}
                          onClick={() => handleLateness(employee.employeeId)}
                          className={` w-14 ${employee.isLate ? " bg-red-400" : "bg-green-400"
                            }`}
                        >
                          {employee.isLate ? "Late" : "No"}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </>
          ) : (
            <p className=" text-center font-bold">No Data found!!</p>
          )
        )}
      </div>
    </div >
  );
}

export default Attendence;
