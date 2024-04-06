import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Time from "./Time";
import styles from "../../styles/calendar.module.css"

const Day = ({ day, timeSlots }) => {
  const [times, setTimes] = useState([]);
  var result = Object.entries(timeSlots);

  useEffect(() => {
    setTimes(
      result.map((e) => (
        <Typography key={e[1].from}>
          <Time from={e[1].from} to={e[1].to} />
        </Typography>
      ))
    );
  }, []);

  return (
    <div className={styles.calendar}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>{day}</Typography>
        </AccordionSummary>
        <AccordionDetails>{times}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Day;
