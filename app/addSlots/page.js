"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/addSlots.module.css"
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

const handleSubmit = async (e) => {
  e.preventDefault();

};

const getAvailablity = async (name) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Tutor/${name}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Availablity");
    }

    console.log(res.json());
    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

const page = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name"));
    if (name !== "") {
      console.log(name);
    }
  }, [name]);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Hello {name}</h1>
      <TextField
          className={styles.text}
          id="standard-multiline-static"
          label="When are you available"
          multiline
        />
        <Button
          variant="contained"
          size="medium"
          onClick={handleSubmit}
        >
          My calendar
        </Button>
    </div>
  );
};

export default page;
