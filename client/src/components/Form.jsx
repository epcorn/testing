/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import FamilyInfo from "./FamilyInfo";
import ImagesInfo from "./ImagesInfo";
import CompanyInfo from "./CompanyInfo";
import { useDispatch, useSelector } from "react-redux";
import { newEmployee } from "../redux/employee/employeeSlice";
import Loading from "./Loading";
import { unwrapResult } from "@reduxjs/toolkit";

const getInitialForm = () => {
  const savedData = localStorage.getItem("formData");
  if (savedData) {
    const { formData } = JSON.parse(savedData);
    return formData;
  }
  return {
    firstname: "",
    lastname: "",
    email: "",
    division: "",
    sitename: "",
    category: "",
    phone: "",
    company: "",
    blood: "",
    family: [
      {
        id: 1,
        firstname: "",
        lastname: "",
        relation: "",
        email: "",
        phone: "",
      },
      {
        id: 2,
        firstname: "",
        lastname: "",
        relation: "",
        email: "",
        phone: "",
      },
      {
        id: 3,
        firstname: "",
        lastname: "",
        relation: "",
        email: "",
        phone: "",
      },
      {
        id: 4,
        firstname: "",
        lastname: "",
        relation: "",
        email: "",
        phone: "",
      },
    ],
    images: {
      aadhar: "",
      driving: "",
      electricity: "",
      pcc: "",
      insurance: "",
      passport: "",
      image: "",
    },
  };
};
function Form({ setOpenModal }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.workers);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState(getInitialForm);

  const FormTitles = ["Personal Info", "Family Info", "Images", "Company"];
  const PageDisplay = () => {
    if (page === 0) {
      return <PersonalInfo formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <FamilyInfo formData={formData} setFormData={setFormData} />;
    } else if (page === 2) {
      return <ImagesInfo formData={formData} setFormData={setFormData} />;
    } else {
      return <CompanyInfo formData={formData} setFormData={setFormData} />;
    }
  };

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const { formData } = JSON.parse(savedData);
      setFormData(formData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify({ formData }));
  }, [formData]);

  return (
    <div className="form">
      {loading && <Loading />}
      <div className="progressbar">
        <div
          style={{
            width:
              page === 0
                ? "25%"
                : page == 1
                ? "50%"
                : page == 2
                ? "75%"
                : "100%",
          }}
        ></div>
      </div>
      <div className=" w-full h-full">
        <div className=" flex items-center justify-center">
          <h1 className=" font-extrabold">{FormTitles[page]}</h1>
        </div>
        <div className="body">{PageDisplay()}</div>
        <div className=" mt-1 flex items-center justify-center gap-4">
          <button
            className="p-3 bg-green-400 text-gray-800 rounded-md hover:bg-green-300 w-24"
            disabled={page === 0}
            onClick={() => {
              setPage((currPage) => currPage - 1);
            }}
          >
            Prev
          </button>
          <button
            type={page === FormTitles.length - 1 ? "submit" : "button"}
            className="p-3 bg-green-400 text-gray-800 rounded-md hover:bg-green-300 w-24"
            onClick={async () => {
              if (page === FormTitles.length - 1) {
                const actionResult = await dispatch(newEmployee(formData));
                const result = await unwrapResult(actionResult);
                if (result.message === "Employee is Registered!") {
                  localStorage.removeItem("formData");
                }
                setOpenModal(false);
              } else {
                setPage((currPage) => currPage + 1);
              }
            }}
          >
            {page === FormTitles.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form;
