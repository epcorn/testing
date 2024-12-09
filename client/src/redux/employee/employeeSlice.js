import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  employees: [],
  loading: false,
  error: null,
};

export const getEmployees = createAsyncThunk(
  "getEmployees",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/employee/");
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

export const newEmployee = createAsyncThunk(
  "newEmployee",
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await fetch(
        "/api/v1/employee/new",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
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

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.result;
        toast.success(action.payload.message, { autoClose: 1000 });
        state.error = null;
      })
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message, { autoClose: 1000 });
      })
      .addCase(newEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload.result);
      })
      .addCase(newEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(newEmployee.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message, { autoClose: 1000 });
      });
  },
});

export default employeeSlice.reducer;
