import React from "react";

const Example = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-6 rounded-lg bg-lprim text-white space-y-6 shadow-lg">
      {/* User's Message */}
      <div>
        <p className="text-lg font-semibold">User</p>
        <p>How do I expand and factorize (a + b)^3 correctly?</p>
      </div>

      <pre className="bg-bgsec text-white p-4 rounded-lg overflow-x-auto">
        <code>{`(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3`}</code>
      </pre>

      <div>
        <p className="text-lg font-semibold">DhyanAI</p>
        <p>
          Your expansion is incorrect. The correct binomial expansion follows
          the binomial theorem:
        </p>
      </div>

      {/* Corrected Expansion */}
      <p className="text-lg font-semibold">Corrected Expansion:</p>
      <pre className="bg-bgsec text-white p-4 rounded-lg overflow-x-auto">
        <code>{`(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3`}</code>
      </pre>

      {/* Factorization */}
      <p className="text-lg font-semibold">Factorization:</p>
      <pre className="bg-bgsec text-white p-4 rounded-lg overflow-x-auto">
        <code>{`a^3 + 3a^2b + 3ab^2 + b^3 = (a + b)(a^2 + 2ab + b^2)`}</code>
      </pre>

      {/* Conclusion */}
      <p>Would you like to solve the next question on your own?</p>
      <button className="bg-bgsec border text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-200">
        Yes, let's try another!
      </button>
    </div>
  );
};

export default Example;
