import React, { useState } from "react";
import "./plan.css";
import { useNavigate } from "react-router-dom";

export default function Plan() {
  const initialPlan = {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    startLocation: "",
    endLocation: "",
  };

  const [plan, setPlan] = useState(initialPlan);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPlan((prev) => ({ ...prev, [name]: value }));
  };

  const validateDatesAndTimes = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (plan.startDate < today) {
      window.alert("Start date cannot be in the past.");
      return false;
    }

    if (plan.endDate < plan.startDate) {
      window.alert("End date cannot be before start date.");
      return false;
    }

    if (plan.endTime <= plan.startTime) {
      window.alert("End time cannot be before or the same as start time .");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateDatesAndTimes()) {
      return; // Stop the submission if validation fails
    }

    console.log(plan);

    try {
      const response = await fetch("http://localhost:1200/create-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(plan),
      });

      if (response.ok) {
        window.alert("Plan created successfully");
        console.log(response);
        navigate("/dashboard");
        setPlan(initialPlan);
      } else {
        window.alert(`Something went wrong: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      window.alert("Something went wrong");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="startDate">Start Date</label>
      <input
        type="date"
        name="startDate"
        onChange={handleChange}
        value={plan.startDate}
        required
      />
      <br />
      <label htmlFor="startTime">Start Time</label>
      <input
        type="time"
        name="startTime"
        onChange={handleChange}
        value={plan.startTime}
        required
      />
      <br />
      <label htmlFor="endDate">End Date</label>
      <input
        type="date"
        name="endDate"
        onChange={handleChange}
        value={plan.endDate}
        required
      />
      <br />
      <label htmlFor="endTime">End Time</label>
      <input
        type="time"
        name="endTime"
        onChange={handleChange}
        value={plan.endTime}
        required
      />
      <br />
      <label htmlFor="startLocation">Start Location</label>
      <input
        type="text"
        name="startLocation"
        onChange={handleChange}
        value={plan.startLocation}
        required
      />
      <br />
      <label htmlFor="endLocation">End Location</label>
      <input
        type="text"
        name="endLocation"
        onChange={handleChange}
        value={plan.endLocation}
        required
      />
      <br />
      <input type="submit" value="Create Plan" />
    </form>
  );
}
