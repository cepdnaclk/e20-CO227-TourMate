import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { getPlaceSuggestions } from "../../api";
import "./plan.css";
import { useNavigate } from "react-router-dom";

const Plan = () => {
  const [step, setStep] = useState(1);
  const [userPlan, setUserPlan] = useState({
    startLocation: "",
    endLocation: "",
    startTime: "",
    endTime: "",
    preference: "",
  });
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [currentField, setCurrentField] = useState("");

  const navigate = useNavigate();

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      getPlaceSuggestions(query).then((data) => {
        setSuggestions(data);
        console.log(data);
      });
    }, 400), // Debounce delay in milliseconds
    [userPlan.startLocation, userPlan.endLocation]
  );

  const handleSuggestionClick = (field, suggestion) => {
    setUserPlan((prev) => ({ ...prev, [field]: suggestion }));
    setSuggestions([]);
  };

  // Handling next and back steps
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Placeholder function for form submission
  const handleSubmit = async () => {
    console.log("User Plan Submitted:", userPlan);
    // Add your API call logic here to save the userPlan details.
    try {
      const response = await fetch("http://localhost:1200/addPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userPlan),
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data);
        navigate("/schedule-plan");
      } else {
        const error = await response.text();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handling input changes
  const handleChange = (input) => (e) => {
    const value = e.target.value;
    setUserPlan({ ...userPlan, [input]: value });
    if (step === 1) {
      fetchSuggestions(value);
    }
    setCurrentField(input);
  };

  // Validation checks for each step
  useEffect(() => {
    validateStep();
  }, [userPlan, step]);

  const validateStep = () => {
    switch (step) {
      case 1:
        setIsNextDisabled(
          !userPlan.startLocation.trim() || !userPlan.endLocation.trim()
        );
        break;
      case 2:
        setIsNextDisabled(!userPlan.startTime || !userPlan.endTime);
        break;
      case 3:
        setIsNextDisabled(!userPlan.preference.trim());
        break;
      default:
        setIsNextDisabled(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <ProgressBar step={step} />

      {step === 1 && (
        <Step1
          handleChange={handleChange}
          userPlan={userPlan}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          currentField={currentField}
        />
      )}
      {step === 2 && <Step2 handleChange={handleChange} userPlan={userPlan} />}
      {step === 3 && <Step3 handleChange={handleChange} />}

      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button
          variant="contained"
          onClick={prevStep}
          disabled={step === 1}
          sx={{
            borderRadius: 10,
            padding: "5px 10px",
            backgroundColor: "black",
          }}
        >
          Back
        </Button>
        {step === 3 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isNextDisabled}
            sx={{
              backgroundColor: "red",
              borderRadius: 10,
              padding: "10px 15px",
            }}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={nextStep}
            disabled={isNextDisabled}
            sx={{ borderRadius: 10, padding: "5px 10px" }}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Step 1: Location
const Step1 = ({
  handleChange,
  userPlan,
  suggestions,
  handleSuggestionClick,
  currentField,
}) => (
  <Box sx={{ mt: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "center", margin: "10px" }}>
      <Typography variant="h5">Where Do You Want To Go?</Typography>
    </Box>
    <Box sx={{ position: "relative" }}>
      <TextField
        label="Start Location"
        variant="outlined"
        fullWidth
        value={userPlan.startLocation}
        onChange={handleChange("startLocation")}
        margin="normal"
        required
      />
      {currentField === "startLocation" && suggestions.length > 0 && (
        <ul className="suggestionsList">
          {suggestions.map((suggestion, index) => (
            <li
              className="suggestion"
              key={index}
              onClick={() =>
                handleSuggestionClick(
                  "startLocation",
                  suggestion.structured_formatting.main_text
                )
              }
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </Box>

    <Box sx={{ position: "relative" }}>
      <TextField
        label="Destination"
        variant="outlined"
        fullWidth
        value={userPlan.endLocation}
        onChange={handleChange("endLocation")}
        margin="normal"
        required
      />
      {currentField === "endLocation" && suggestions.length > 0 && (
        <ul className="suggestionsList">
          {suggestions.map((suggestion, index) => (
            <li
              className="suggestion"
              key={index}
              onClick={() =>
                handleSuggestionClick(
                  "endLocation",
                  suggestion.structured_formatting.main_text
                )
              }
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </Box>
  </Box>
);

// Step 2: Time
const Step2 = ({ handleChange, userPlan }) => (
  <>
    <Box sx={{ display: "flex", justifyContent: "center", margin: "10px" }}>
      <Typography variant="h5">When Are You Planning To Go?</Typography>
    </Box>
    <Box
      sx={{
        mt: 2,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <label>Start Date:</label>
        <input
          type="date"
          value={userPlan.startDate}
          onChange={handleChange("startDate")}
          min={new Date().toISOString().split("T")[0]}
          required
          style={{
            padding: "10px",
            height: "40px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginTop: "5px",
            marginBottom: "20px",
            width: "80%",
          }}
        />
      </Box>
      <TextField
        label="Start Time"
        type="time"
        variant="outlined"
        style={{ width: "80%", marginBottom: "20px" }}
        value={userPlan.startTime}
        onChange={handleChange("startTime")}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        required
      />
      <TextField
        label="End Time"
        type="time"
        variant="outlined"
        style={{ width: "80%", marginBottom: "20px" }}
        value={userPlan.endTime}
        onChange={handleChange("endTime")}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        required
      />
    </Box>
  </>
);

// Step 3: User Preference
const Step3 = ({ handleChange }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/api/destinations/getTypes",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch destination types");
        }
        console.log(response);
        const data = await response.json();
        setTypes(data); // Set the response data (a list of strings) to state
      } catch (error) {
        console.error("Error fetching destination types:", error);
      }
    };

    fetchTypes();
  }, []);

  // Handle button click to add or remove types from preference
  const handleTypeClick = (type) => {
    let updatedTypes;

    if (selectedTypes.includes(type)) {
      // If the type is already selected, remove it
      updatedTypes = selectedTypes.filter((t) => t !== type);
    } else {
      // Otherwise, add it to the selected types
      updatedTypes = [...selectedTypes, type];
    }

    setSelectedTypes(updatedTypes);
    handleChange("preference")({
      target: { value: updatedTypes.join(", ") }, // Update userPlan with comma-separated string
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Select Your Preferences</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", mt: 2 }}>
        {types.map((type, index) => (
          <Button
            key={index}
            variant={selectedTypes.includes(type) ? "contained" : "outlined"}
            color={selectedTypes.includes(type) ? "secondary" : "primary"}
            onClick={() => handleTypeClick(type)}
            sx={{
              textTransform: "capitalize",
              borderRadius: "20px",
              padding: "5px 15px",
              margin: "5px",
            }}
          >
            {type}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

// Progress bar using MUI Stepper
const ProgressBar = ({ step }) => (
  <Stepper activeStep={step - 1} sx={{ mt: 2, height: "50px" }}>
    <Step>
      <StepLabel>Location</StepLabel>
    </Step>
    <Step>
      <StepLabel>Date & Time</StepLabel>
    </Step>
    <Step>
      <StepLabel>Preference</StepLabel>
    </Step>
  </Stepper>
);

export default Plan;
