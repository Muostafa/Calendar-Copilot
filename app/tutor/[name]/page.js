"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/home.module.css";
import TextField from "@mui/material/TextField";
import Calendar from "@/app/(components)/Calendar";
import Confirmation from "@/app/(components)/Confirmation";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function toStr(obj) {
  var res = `{"availability": [`;

  var temp = Object.entries(obj);
  temp.map((e) => {
    res += `{"dayOfWeek": "${e[1].dayOfWeek}","timeSlots": [`;
    Object.entries(e[1].timeSlots).map(
      (e) =>
        (res += `
      {
          "from": "${e[1].from}",
          "to": "${e[1].to}"
      },`)
    );
    res = res.slice(0, -1);
    res += "]},";
  });

  res = res.slice(0, -1);
  res += "]}";

  return res;
}

function convertToTime(number) {
  // Calculate hours and minutes
  var hours = Math.floor(number / 100);
  var minutes = number % 100;

  // Format hours and minutes
  var formattedHours = ("0" + hours).slice(-2);
  var formattedMinutes = ("0" + minutes).slice(-2);

  // Return the formatted time
  return formattedHours + ":" + formattedMinutes;
}

var merge = function (intervals) {
  let ans = [];
  intervals.sort((a, b) => a[0] - b[0]);

  if (intervals.length === 0) {
    return ans;
  }

  let temp = intervals[0];
  for (let i = 0; i < intervals.length; i++) {
    if (intervals[i][0] <= temp[1]) {
      temp[1] = Math.max(temp[1], intervals[i][1]);
    } else {
      ans.push(temp);
      temp = intervals[i];
    }
  }
  ans.push(temp);

  return ans;
};

function handleOverlapping(arr) {
  var intervals = [];
  for (var i = 0; i < arr.length; i++) {
    var start = Number(arr[i].from.replace(":", ""));
    var end = Number(arr[i].to.replace(":", ""));
    intervals.push([start, end]);
  }

  var overlapped = merge(intervals);

  var res = [];

  for (var i = 0; i < overlapped.length; i++) {
    var from = convertToTime(overlapped[i][0]);
    var to = convertToTime(overlapped[i][1]);

    res.push({ from: from, to: to });
  }
  return res;
}

function combineTimeslots(obj1, obj2) {
  for (var i = 0; i < obj1.length; i++) {
    var dayOfWeek = obj1[i].dayOfWeek;
    for (var j = 0; j < obj2.length; j++) {
      if (obj2[j].dayOfWeek === dayOfWeek) {
        obj1[i].timeSlots = obj1[i].timeSlots.concat(obj2[j].timeSlots);
      }
    }
  }
  for (var j = 0; j < obj2.length; j++) {
    var bool = false;
    for (var i = 0; i < obj1.length; i++) {
      bool = bool || obj2[j].dayOfWeek == obj1[i].dayOfWeek;
    }
    if (!bool) {
      obj1.push(obj2[j]);
    }
  }

  for (var i = 0; i < obj1.length; i++) {
    obj1[i].timeSlots = handleOverlapping(obj1[i].timeSlots);
  }

  return obj1;
}

var counterOfSubmition = 0;
const page = ({ params }) => {
  const router = useRouter();
  const [found, setFound] = useState(true);
  const [res, setRes] = useState("");

  const [text, setText] = useState("");
  const [apires, setApires] = useState("{}");

  const [loading, setLoading] = React.useState(false);

  const [loading2, setLoading2] = React.useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/Tutor/${params.name}`)
      .then((res) => res.json())
      .then((result) => {
        setFound(isEmpty(result.tutors));
        setRes(result.tutors[0]);
      })
      .catch(console.log);
  }, [counterOfSubmition]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const inputPrompt = `I will give you an English statement to convert to a JSON object in this format: availability: [{dayOfWeek: { type: String}, timeSlots: [{from: { type: String }, to: { type: String },},],},]. Example: {"availability": [{"dayOfWeek": "monday", "timeSlots": [{ "from": "09:00", "to": "12:00" }]},{"dayOfWeek": "tuesday", "timeSlots": [{ "from": "14:00", "to": "17:00" }]},{"dayOfWeek": "friday", "timeSlots": [{ "from": "10:00", "to": "12:00" },{ "from": "1:00", "to": "2:00" }]}]}. There must be at least 1 in timeSlots for every day you provide. dayOfWeek must be saturday, sunday, monday, tuesday, wednesday, thursday, or friday. timeSlots from and to must be between 00:00 and 23:59. If the dayOfWeek doesn't have any timeSlots, don't provide it. Convert the time given in the English statement to a 24-hour clock format. from is less than to. from is greater than or equal to 00:00. to is less than or equal to 23:59. timeSlots must contain at least 1 time. If the English statement does not contain information relevant to converting return 1 random time at a random day. Provide JSON object only starting with '{' and ending with '{'.For example if the English statement is (I am available between noon and 4pm on weekends, after 7 pm to midnight on Monday and Wednesday, and after 9pm otherwise), the output should be {"availability": [{"dayOfWeek": "saturday","timeSlots": [{"from": "12:00","to": "16:00"}]},{"dayOfWeek": "sunday","timeSlots": [{"from": "12:00","to": "16:00" }]},{"dayOfWeek": "monday","timeSlots": [ {"from":"19:00","to": "23:59"}]},{"dayOfWeek": "wednesday","timeSlots": [{"from": "19:00","to": "23:59" }]},{"dayOfWeek": "tuesday","timeSlots": [{"from": "21:00","to": "23:59"}]},{"dayOfWeek": "thursday","timeSlots": [{"from": "21:00","to": "23:59"}]},{"dayOfWeek": "friday","timeSlots": [{"from": "21:00","to": "23:59"}]}]}. Here is the English statement to convert: “${text}".`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are ChatGPT, a helpful assistant.",
          },
          {
            role: "user",
            content: inputPrompt,
          },
        ],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.choices[0].message.content);
        setApires(data.choices[0].message.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    const firstAvailability = apires;
    const secondAvailability = toStr({ ...res.availability });

    console.log(firstAvailability);
    console.log(secondAvailability);

    var newAvailability = "";
    if (secondAvailability === `{"availability": ]}`) {
      newAvailability = firstAvailability;
    } else {
      newAvailability = toStr(
        combineTimeslots(
          JSON.parse(firstAvailability).availability,
          JSON.parse(secondAvailability).availability
        )
      );
    }

    console.log(newAvailability);

    const response = await fetch(
      `http://localhost:3000/api/Tutor/${params.name}`,
      {
        method: "PUT",
        body: JSON.stringify(JSON.parse(newAvailability)),
        "content-type": "application/json",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create slots");
    }

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <>
      {found ? (
        <div className={styles.main}>Loading...</div>
      ) : (
        <div className={styles.main}>
          <h1 className={styles.title}>Hello {decodeURI(params.name)}</h1>
          <h1 className={styles.title}>I am available at</h1>
          <Calendar {...res.availability} />
          <TextField
            className={styles.text2}
            id="standard-multiline-static"
            label="When are you available"
            multiline
            style={{ width: "40%" }}
            onChange={(e) => setText(e.target.value)}
          />
          <LoadingButton
            variant="contained"
            size="medium"
            onClick={handleSubmit}
            disabled={text === ""}
            loading={loading}
          >
            Submit
          </LoadingButton>

          <Confirmation availability={apires} />
          <LoadingButton
            variant="contained"
            size="medium"
            onClick={handleConfirm}
            disabled={apires === "{}"}
            loading={loading2}
          >
            Confirm
          </LoadingButton>
        </div>
      )}
    </>
  );
};

export default page;
