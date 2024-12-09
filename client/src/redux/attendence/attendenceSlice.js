import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { logout } from "../user/userSlice";

const initialState = {
  workdayStatus: [],
  date: "",
  loading: false,
  error: null,
};

export const workdayStatus = createAsyncThunk(
  "todayAttendence",
  async (date, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/v1/dayReport/status",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const togglePresence = createAsyncThunk(
  "presence",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/v1/dayReport/checkIn/${id}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const toggleLateness = createAsyncThunk(
  "lateness",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/v1/dayReport/markLate/${id}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const dayTypeness = createAsyncThunk(
  "dayTypeness",
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/v1/dayReport/changeDayScheduleType/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }), // Stringify the whole body object
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const attendenceSlice = createSlice({
  name: "attendence",
  initialState,
  reducers: {
    resetAttendanceState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(workdayStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.date = action.payload.date.split("T")[0];
        state.workdayStatus = action.payload.workdayStatus?.checkIns ?? [];
        toast.success(action.payload.message, { autoClose: 1000 });
        state.error = null;
      })
      .addCase(workdayStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(workdayStatus.rejected, (state, action) => {
        state.loading = false;
        state.workdayStatus = [];
        toast.error(action.payload.message, { autoClose: 1000 });
      })
      .addCase(togglePresence.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workdayStatus.findIndex(
          (item) => item.employeeId === action.payload.result.employeeId
        );
        if (index !== -1) {
          state.workdayStatus[index] = action.payload.result;
        }
      })
      .addCase(togglePresence.pending, (state) => {
        state.loading = true;
      })
      .addCase(togglePresence.rejected, (state, action) => {
        state.loading = true;
        toast.error(action.payload.message, { autoClose: 1000 });
      })
      .addCase(toggleLateness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workdayStatus.findIndex(
          (item) => item.employeeId === action.payload.result.employeeId
        );
        if (index !== -1) {
          state.workdayStatus[index] = action.payload.result;
        }
      })
      .addCase(toggleLateness.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLateness.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message, { autoClose: 1000 });
      })
      .addCase(dayTypeness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workdayStatus.findIndex(
          (item) => item.employeeId === action.payload.result.employeeId
        );
        if (index !== -1) {
          state.workdayStatus[index] = action.payload.result;
        }
      })
      .addCase(dayTypeness.pending, (state) => {
        state.loading = true;
      })
      .addCase(dayTypeness.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message, { autoClose: 1000 });
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      });
  },
});
export const { resetAttendanceState } = attendenceSlice.actions;
export default attendenceSlice.reducer;
