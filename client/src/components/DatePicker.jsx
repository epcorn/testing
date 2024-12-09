import { useEffect, useState } from "react";
import { workdayStatus } from "../redux/attendence/attendenceSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function DatePicker() {
  const initialDate = useSelector((state) => state.dayStat.date);

  const [date, setDate] = useState(
    initialDate !== "" ? initialDate : new Date().toISOString().split("T")[0]
  );

  const [selectedDate, setSelectedDate] = useState(date);
  const dispatch = useDispatch();

  const handleDateChange = (e) => {
    const tempDate = e.target.value;
    setDate(tempDate);
    setSelectedDate(formatDate(tempDate));
  };
  useEffect(() => {
    if (selectedDate !== undefined) {
      dispatch(workdayStatus(selectedDate));
    }
  }, [dispatch, selectedDate]);
  console.log(`initialDate: ${initialDate} |  selectedDate: ${selectedDate}`);
  function formatDate(date) {
    const formattedDate = new Date(date).toISOString();
    return formattedDate;
  }

  return (
    <div className="mr-3">
      <input
        className="bg-white border border-green-500 rounded-lg shadow-md focus:border-none select-none"
        type="date"
        value={date}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default DatePicker;
