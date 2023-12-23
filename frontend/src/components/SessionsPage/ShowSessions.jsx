import { useState, useEffect } from "react";
import axios from "axios";
import ConvertDate from "../Shared/ConvertDate";

export default function ShowSessions() {
  const [allSessions, setAllSessions] = useState([]);

  useEffect(() => {
    axios
      .get("api/sessions")
      .then(function (res) {
        console.log(JSON.stringify(res.data, null, 2));
        setAllSessions(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  // Helper function to group by record_id
  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  };

  const groupedSessions = groupBy(allSessions, "record_id");

  const [expandedRecords, setExpandedRecords] = useState({});

  const toggleRecord = (recordId) => {
    setExpandedRecords({
      ...expandedRecords,
      [recordId]: !expandedRecords[recordId],
    });
  };

  return (
    <div>
      {Object.entries(groupedSessions).map(([recordId, sessions]) => (
        <div key={recordId}>
          <h2 onClick={() => toggleRecord(recordId)} style={{ cursor: "pointer" }}>
            Date: {ConvertDate(sessions[0].workout_date)}
            <span> </span>
            {sessions[0].template_name}
          </h2>
          {expandedRecords[recordId] && (
            <table style={{ width: "100%", border: "1px solid black", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ width: "40%", border: "1px solid black" }}>Exercise Name</th>
                  <th style={{ width: "20%", border: "1px solid black" }}>Body Part</th>
                  <th style={{ width: "20%", border: "1px solid black" }}>Weight</th>
                  <th style={{ width: "20%", border: "1px solid black" }}>Reps</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.set_id}>
                    <td style={{ width: "20%", border: "1px solid black" }}>{session.exercise_name}</td>
                    <td style={{ width: "20%", border: "1px solid black" }}>{session.body_part}</td>
                    <td style={{ width: "20%", border: "1px solid black" }}>{session.weight}</td>
                    <td style={{ width: "20%", border: "1px solid black" }}>{session.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
