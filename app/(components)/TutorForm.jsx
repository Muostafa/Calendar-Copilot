"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

const TutorForm = () => {
  const router = useRouter();
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("Startsubmit");
    console.log(FormData);
    
    e.preventDefault();
    const res = await fetch("/api/Tutor", {
      method: "POST",
      body: JSON.stringify({ FormData }),
      "content-type": "application/json",
    });

    
    if (!res.ok) {
      throw new Error("Failed to create Tutor");
    }

    router.refresh();
    router.push("/");

    console.log("submitted");
  };

  const startingData = {
    name: "",
    available: "",
  };
  const [formData, setFormData] = useState(startingData);
  return (
    <div className="flex justify-center">
      <form method="post" onSubmit={handleSubmit}>
        <h3>Add Tutor</h3>
        <label>Tutor</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.name}
        />
        <label>available</label>
        <input
          id="availbel"
          name="available"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.available}
        />
        <Button variant="outlined" type="submit">
          Create Tutor
        </Button>
      </form>
    </div>
  );
};

export default TutorForm;
