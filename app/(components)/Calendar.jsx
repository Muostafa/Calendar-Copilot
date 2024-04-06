import React, { useState, useEffect } from "react";
import Day from "./Day";
import styles from "../../styles/calendar.module.css";


const Calendar = (props) => {
  const [days, setDays] = useState([]);
  var result = Object.entries(props);

  useEffect(() => {
    setDays(
        result.map((e) => (
        <Day
          key={e[1].dayOfWeek}
          day={e[1].dayOfWeek}
          timeSlots={e[1].timeSlots}
        />
      ))
    );
  }, [props]);

  return <div className={styles.main}>{days}</div>;
};

export default Calendar;
