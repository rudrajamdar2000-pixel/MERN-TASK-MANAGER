import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Tasks from "../components/Tasks";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
  const [status, setStatus] = useState("");
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [priority, setPriority] = useState("");

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s tasks`
      : "Task Manager";
  }, [authState]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setPriority("");
    setStatus("");
  };

  return (
    <>
      <MainLayout>
        {!isLoggedIn ? (
          <div className="bg-primary text-white h-[40vh] py-8 text-center">
            <h1 className="text-2xl">Welcome to Task Manager App</h1>

            <Link
              to="/signup"
              className="mt-10 text-xl block space-x-2 hover:space-x-4"
            >
              <span className="transition-[margin]">
                Join now to manage your tasks
              </span>

              <span className="relative ml-4 text-base transition-[margin]">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-lg mt-8 mx-8 border-b border-b-gray-300">
              Welcome {authState.user.name}
            </h1>

            {/* Search and Filter */}
            <form
              onSubmit={handleSearch}
              className="mx-8 mt-6 flex flex-wrap gap-2 max-w-[900px]"
            >
              {/* Search */}
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tasks..."
                className="flex-1 min-w-[250px] border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-primary"
              />

              {/* Priority Filter */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-primary"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-primary"
              >
                <option value="">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-dark"
              >
                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                Search
              </button>

              {/* Clear Button */}
              {(search || priority || status) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600"
                >
                  Clear
                </button>
              )}
            </form>

            <Tasks search={search} priority={priority} status={status} />
          </>
        )}
      </MainLayout>
    </>
  );
};

export default Home;
