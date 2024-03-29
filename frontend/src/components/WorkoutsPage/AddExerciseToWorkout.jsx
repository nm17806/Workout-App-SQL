import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import "./AddExerciseToWorkout.css";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext";

export default function AddExerciseToWorkout() {
  const { sortedExercises, addExercisesToWorkout, workoutName } = useWorkoutsContext();
  const [selectedWorkout, setSelectedWorkout] = useState("Select a Workout");
  const [selectedWorkoutId, setselectedWorkoutId] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);

    if (selectedItems && selectedItems.length > 0 && selectedWorkoutId) {
      // Use map to create an array of promises
      const postRequests = selectedItems.map((item) => addExercisesToWorkout(selectedWorkoutId, item));

      // Use Promise.all to wait for all promises to resolve
      Promise.all(postRequests)
        .then(function (responses) {
          console.log(responses);
        })
        .catch(function (error) {
          setError(error);
          console.log(error);
        });
    } else {
      setError(true);
    }
    window.location.reload();
  };

  const onSelection = (item, id) => {
    setSelectedWorkout(item);
    setselectedWorkoutId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (showModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleChange = (e) => {
    // Update the selectedItems array based on the button that was clicked
    let { value } = e.currentTarget;
    value = Number(value);
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((item) => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  return (
    <div className="addExerciseForm">
      <h3 className="workoutsFormTitle">Add an Exercise</h3>
      <Form onSubmit={handleSubmit}>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary w-100 p-3">{selectedWorkout}</Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            {workoutName &&
              workoutName.map((workout) => (
                <Dropdown.Item
                  key={workout.template_id}
                  onClick={() => onSelection(workout.template_name, workout.template_id)}
                >
                  {workout.template_name}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
        <br />
        <Button className="exerciseFormBtn" variant="primary" type="submit">
          Submit
        </Button>
        {error && (
          <div className="error">
            Something Went Wrong! <br></br> Please try again later.
          </div>
        )}
      </Form>
      {
        <div className="modal" style={{ display: showModal ? "block" : "none" }}>
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h3 className="">Choose Exercises</h3>
            <div className="exerciseButtonsDiv" value={selectedItems} onChange={handleChange}>
              {sortedExercises &&
                sortedExercises.map((exercise) => (
                  <Button
                    type="checkbox"
                    key={exercise.exercise_id}
                    className="exerciseButtons"
                    variant="outline-primary"
                    value={exercise.exercise_id}
                    onClick={handleChange}
                    style={{
                      backgroundColor: selectedItems.includes(exercise.exercise_id) ? "blue" : "transparent",
                      color: selectedItems.includes(exercise.exercise_id) ? "white" : "blue",
                    }}
                  >
                    {exercise.exercise_name + " (" + exercise.body_part + ")"}
                  </Button>
                ))}
            </div>
            <button className="close-modal" onClick={toggleModal}>
              X
            </button>
            <Button className="submitButton" onClick={handleFormSubmit}>
              Submit
            </Button>
          </div>
        </div>
      }
    </div>
  );
}
