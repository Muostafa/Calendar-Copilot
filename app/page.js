"use client";
import styles from "../styles/home.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Description from "./(components)/Description";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/api/Tutor`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
      }),
      "content-type": "application/json",
    });

    if (!res.ok) {
      throw new Error("Failed to create Tutor");
    }

    if (res.ok) {
      router.push(`/tutor/${name}`);
    }
  };

  return (
    <div className={styles.holder}>
      <div className={styles.text}>
        <Description
          title={
            "Welcome to Calendar Co-Pilot: Your Personal Scheduling Assistant"
          }
          text={
            "Tired of manual calendar setup? Calendar Co-Pilot simplifies scheduling for tutors, consultants, and professionals."
          }
        />
        <Description
          title={"Experience the Difference with Calendar Co-Pilot:"}
          text={
            "Join the growing community of professionals who are revolutionizing their scheduling experience with Calendar Co-Pilot. Say hello to efficiency, productivity, and peace of mind. Try it today and take control of your schedule like never before."
          }
        />
        <Description
          title={"Effortless Scheduling, Powered by AI:"}
          text={
            "Just describe your availability, and our AI generates a precise calendar for you."
          }
        />

        <Description
          title={"Seamless Integration with MongoDB:"}
          text={
            "Securely store and access your schedule anytime with MongoDB integration."
          }
        />

        <Description
          title={"Intuitive Web Interface:"}
          text={
            "View your schedule at a glance with our intuitive calendar display."
          }
        />

        <Description
          title={"Visualize Your Schedule with Ease:"}
          text={
            "Join professionals revolutionizing scheduling. Try Calendar Co-Pilot today!"
          }
        />

        
      </div>
      <div className={styles.main}>
        <h1 className={styles.test}>Calendar co-pilot</h1>
        <div>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            size="medium"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Button
            variant="contained"
            size="medium"
            disabled={name === ""}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
