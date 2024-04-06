import React, { useState, useEffect } from "react";
import Day from "./Day";

var c = 0

const Confirmation = ({ availability }) => {
  const [days, setDays] = useState([]);
  var temp = JSON.parse(availability);
  if (availability !== "{}") {
    try {
      var result = Object.entries(temp);
      result = result[0][1];
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (availability != "{}") {
      setDays(
        result.map((e) => (
          <Day key={c++} day={e.dayOfWeek} timeSlots={e.timeSlots} />
        ))
      );
    }
  }, [availability]);

  return (
    <div>
      <>Your new slots</>
      {days}
    </div>
  );
};

export default Confirmation;
