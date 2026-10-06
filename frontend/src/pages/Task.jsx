import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "../components/utils/Input";
import Loader from "../components/utils/Loader";
import useFetch from "../hooks/useFetch";
import MainLayout from "../layouts/MainLayout";
import validateManyFields from "../validations";

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";

  const [task, setTask] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = {
        url: `/tasks/${taskId}`,
        method: "get",
        headers: {
          Authorization: authState.token,
        },
      };

      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);

        setFormData({
          description: data.task.description,
          priority: data.task.priority || "medium",

          // Convert MongoDB date into YYYY-MM-DD
          dueDate: data.task.dueDate ? data.task.dueDate.split("T")[0] : "",
        });
      });
    }
  }, [mode, authState.token, taskId, fetchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();

    setFormData({
      description: task.description,
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateManyFields("task", formData);

    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce(
          (total, ob) => ({
            ...total,
            [ob.field]: ob.err,
          }),
          {},
        ),
      );

      return;
    }

    if (mode === "add") {
      const config = {
        url: "/tasks",
        method: "post",
        data: formData,
        headers: {
          Authorization: authState.token,
        },
      };

      fetchData(config).then(() => navigate("/"));
    } else {
      const config = {
        url: `/tasks/${taskId}`,
        method: "put",
        data: {
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          completed: task.completed || false,
        },
        headers: {
          Authorization: authState.token,
        },
      };

      fetchData(config).then(() => navigate("/"));
    }
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <>
      <MainLayout>
        <form className="m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="text-center mb-4">
                {mode === "add" ? "Add New Task" : "Edit Task"}
              </h2>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description">Description</label>

                <Textarea
                  type="description"
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write here.."
                  onChange={handleChange}
                />

                {fieldError("description")}
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label htmlFor="priority" className="block mb-1">
                  Priority
                </label>

                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                {fieldError("priority")}
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <label htmlFor="dueDate" className="block mb-1">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                />

                {fieldError("dueDate")}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark"
                onClick={handleSubmit}
              >
                {mode === "add" ? "Add task" : "Update Task"}
              </button>

              {/* Cancel */}
              <button
                type="button"
                className="ml-4 bg-red-500 text-white px-4 py-2 font-medium"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              {/* Reset */}
              {mode === "update" && (
                <button
                  type="button"
                  className="ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </>
          )}
        </form>
      </MainLayout>
    </>
  );
};

export default Task;
