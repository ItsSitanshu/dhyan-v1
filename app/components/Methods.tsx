import React from "react";

const Methods = () => {
  return (
    <div className=" text-white w-full px-6 py-16 font-nue">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-nue text-center font-bold bg-background bg-clip-text text-transparent">
          Methods
        </h1>

        {/* Section Wrapper */}
        <div className="mt-12 space-y-10">
          {/* Reinforcement Learning Model */}
          <div className="bg-bgsec p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h2 className="text-3xl font-semibold text-gray-200 border-l-4 border-prim1 pl-4">
              Reinforcement Learning Model
            </h2>
            <p className="text-lg text-gray-300 mt-4">
              Our AI adapts dynamically using a reinforcement learning (RL)
              model:
            </p>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li>
                <span className="font-bold text-sec1">S (States):</span>{" "}
                Learning style, grades, hint requests, abrupt exits.
              </li>
              <li>
                <span className="font-bold text-sec2">A (Actions):</span>{" "}
                Explanation adjustments, follow-ups, hints, sentiment analysis.
              </li>
              <li>
                <span className="font-bold text-psec">R (Reward):</span> Student
                feedback (1-5 stars), correctness of answers, response time.
              </li>
            </ul>
          </div>

          {/* RAG Framework */}
          <div className="bg-bgsec p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h2 className="text-3xl font-semibold text-gray-200 border-l-4 border-sec1 pl-4">
              Retrieval-Augmented Generation (RAG)
            </h2>
            <p className="text-lg text-gray-300 mt-4">
              Dhyan.AI retrieves relevant knowledge from a vector database,
              ensuring every response is contextually accurate and tailored to
              the student’s needs.
            </p>
          </div>

          {/* Personalized Learning Paths */}
          <div className="bg-bgsec p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h2 className="text-3xl font-semibold text-gray-200 border-l-4 border-prim1 pl-4">
              Personalized Learning Paths
            </h2>
            <p className="text-lg text-gray-300 mt-4">
              The AI dynamically adjusts its difficulty based on student
              performance, ensuring that advanced learners stay challenged while
              struggling students receive extra support.
            </p>
          </div>

          {/* Real-Time Progress Tracking */}
          <div className="bg-bgsec p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h2 className="text-3xl font-semibold text-gray-200 border-l-4 border-sec2 pl-4">
              Real-Time Progress Tracking
            </h2>
            <p className="text-lg text-gray-300 mt-4">
              By continuously analyzing student responses, Dhyan.AI identifies
              weak areas and suggests targeted improvements, adapting
              explanations to enhance learning outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methods;
