/* eslint-disable react/prop-types */
import { Label, TextInput } from "flowbite-react";
import { useState } from "react";

const FamilyInfo = ({ formData, setFormData }) => {
  const [activeMember, setActiveMember] = useState(0);

  const handleMemberClick = (index) => {
    setActiveMember(index);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFamily = prevState.family.map((member, index) =>
        index === activeMember ? { ...member, [name]: value } : member
      );
      return { ...prevState, family: updatedFamily };
    });
  };

  return (
    <div className="">
      <div className="flex space-x-2 justify-center items-center">
        {formData.family.map((member, index) => (
          <button
            key={member.id}
            onClick={() => handleMemberClick(index)}
            className={`rounded-full w-10 h-10 bg-blue-400 text-white focus:outline-none ${activeMember === index ? "bg-blue-800" : ""
              }`}
          >
            {member.id}
          </button>
        ))}
      </div>
      <div className=" mb-2">
        <Label className="font-bold" htmlFor="firstname" value="First name" />
        <TextInput
          id="firstname"
          type="text"
          required
          name="firstname"
          className="felx-2"
          value={formData.family[activeMember].firstname}
          onChange={handleInputChange}
        />
      </div>
      <div className=" mb-2">
        <Label className="font-bold" htmlFor="lastname" value="Lastname" />
        <TextInput
          className=""
          id="lastname"
          type="text"
          name="lastname"
          required
          value={formData.family[activeMember].lastname}
          onChange={handleInputChange}
        />
      </div>
      <div className=" mb-2">
        <Label className="font-bold" htmlFor="relation" value="Relationship" />
        <TextInput
          className=""
          id="relation"
          type="text"
          name="relation"
          required
          value={formData.family[activeMember].relation}
          onChange={handleInputChange}
        />
      </div>
      <div className=" mb-2">
        <Label className="font-bold" htmlFor="email" value="Your email" />
        <TextInput
          id="email"
          placeholder="name@company.com"
          required
          name="email"
          value={formData.family[activeMember].email}
          onChange={handleInputChange}
        />
      </div>
      <div className=" mb-2">
        <Label className="font-bold" htmlFor="tel" value="Phone" />
        <TextInput
          id="tel"
          placeholder="Phone"
          required
          name="phone"
          value={formData.family[activeMember].phone}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default FamilyInfo;
