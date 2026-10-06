import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/utils/Loader";
import Tooltip from "./utils/Tooltip";

const Tasks = ({ search, priority, status }) => {
  const authState = useSelector((state) => state.authReducer);

  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = {
      url: `/tasks?search=${encodeURIComponent(
        search || "",
      )}&priority=${encodeURIComponent(
        priority || "",
      )}&status=${encodeURIComponent(status || "")}`,

      method: "get",

      headers: {
        Authorization: authState.token,
      },
    };

    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data.tasks);
    });
  }, [authState.token, fetchData, search, priority, status]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;

    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: {
        Authorization: authState.token,
      },
    };

    fetchData(config).then(() => fetchTasks());
  };

  const handleComplete = (task) => {
    const config = {
      url: `/tasks/${task._id}`,
      method: "put",

      data: {
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: !task.completed,
      },

      headers: {
        Authorization: authState.token,
      },
    };

    fetchData(config).then(() => fetchTasks());
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "High";

      case "medium":
        return "Medium";

      case "low":
        return "Low";

      default:
        return "Medium";
    }
  };

  // Check whether due date has passed
  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  // Format date for display
  const formatDueDate = (date) => {
    if (!date) return "No due date";

    const [year, month, day] = date.split("T")[0].split("-");

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
        {tasks.length !== 0 && (
          <h2 className="my-2 ml-2 md:ml-0 text-xl">
            {search || priority || status
              ? `Filtered tasks (${tasks.length})`
              : `Your tasks (${tasks.length})`}
          </h2>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (
              <div className="w-[600px] h-[300px] flex items-center justify-center gap-4">
                <span>
                  {search || priority || status
                    ? "No matching tasks found"
                    : "No tasks found"}
                </span>

                <Link
                  to="/tasks/add"
                  className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
                >
                  + Add new task
                </Link>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`bg-white my-4 p-4 text-gray-600 rounded-md shadow-md ${
                    task.completed ? "opacity-70" : ""
                  }`}
                >
                  {/* Task Header */}
                  <div className="flex items-center">
                    <span
                      className={`font-medium ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      Task #{index + 1}
                    </span>

                    {/* Priority */}
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(
                        task.priority,
                      )}`}
                    >
                      {getPriorityText(task.priority)}
                    </span>

                    {/* Edit */}
                    <Tooltip text="Edit this task" position="top">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="ml-auto mr-2 text-green-600 cursor-pointer"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip text="Delete this task" position="top">
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(task._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>

                  {/* Description */}
                  <div
                    className={`whitespace-pre mt-2 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </div>

                  {/* Due Date */}
                  <div
                    className={`mt-3 text-sm font-medium ${
                      isOverdue(task)
                        ? "text-red-600"
                        : task.completed
                          ? "text-gray-500"
                          : "text-gray-600"
                    }`}
                  >
                    <i className="fa-regular fa-calendar mr-2"></i>

                    {task.dueDate ? (
                      <>
                        Due: {formatDueDate(task.dueDate)}
                        {isOverdue(task) && (
                          <span className="ml-2 font-semibold">(Overdue)</span>
                        )}
                      </>
                    ) : (
                      "No due date"
                    )}
                  </div>

                  {/* Complete Button */}
                  <button
                    type="button"
                    onClick={() => handleComplete(task)}
                    className={`mt-4 px-4 py-2 rounded-md text-white font-medium ${
                      task.completed
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {task.completed ? "Mark Pending" : "Complete"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;
