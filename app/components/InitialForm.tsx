import React from "react";

const InitialForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col md:flex-row items-center justify-between p-8 flex-grow">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-900">
            Personal Information & EcoSystem Setup
          </h2>
          <p className="text-gray-600 mt-2">
            Let's make your learning journey seamless. Help us know more about
            you.
          </p>
          <div className="flex items-center mt-4">
            <div className="h-1 w-1/4 bg-blue-500"></div>
            <div className="h-1 w-1/4 bg-gray-300"></div>
            <div className="h-1 w-1/4 bg-gray-300"></div>
            <div className="h-1 w-1/4 bg-gray-300"></div>
          </div>
          <form className="mt-8 space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="name"
                >
                  * Your Name
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  id="name"
                  type="text"
                  defaultValue="Sitanshu"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="mobile"
                >
                  * Your Mobile Number
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  id="mobile"
                  type="text"
                  defaultValue="98"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="language"
                >
                  * Choose your Language
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  id="language"
                >
                  <option>English</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="class"
                >
                  Select Your Class
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  id="class"
                >
                  <option>Grade 9</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-700">
                Choose the Subjects from your class
              </p>
              <div className="flex items-center mt-2">
                <input className="mr-2" id="select-all" type="checkbox" />
                <label className="text-blue-500" htmlFor="select-all">
                  Select all
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {[
                  "Science",
                  "Compulsory Math",
                  "Optional Math",
                  "Compulsory English",
                  "English Grammar",
                  "Accounts",
                  "Computer Science",
                ].map((subject) => (
                  <div
                    key={subject}
                    className="border-2 border-gray-400 p-3 rounded-md text-center text-gray-700"
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-6 mt-8">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md focus:outline-none hover:bg-blue-600">
                Pay Now
              </button>
              <button className="bg-gray-500 text-white px-6 py-3 rounded-md focus:outline-none hover:bg-gray-600">
                Start Free Trial
              </button>
            </div>
          </form>
        </div>
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <img
            alt="Educational illustration"
            className="w-full rounded-lg shadow-lg"
            src=""
          />
        </div>
      </main>
    </div>
  );
};

export default InitialForm;
