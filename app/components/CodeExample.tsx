import React from "react";

const CodeExample = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-6 rounded-lg bg-lprim text-white space-y-6">
      {/* User's Message */}
      <div>
        <p className="text-lg font-semibold">User</p>
        <p>This code is not working like I expect — how do I fix it?</p>
      </div>

      {/* Incorrect C Code */}
      <pre className="bg-bgsec text-white p-4 rounded-lg overflow-x-auto">
        <code>
          {`#include <stdio.h>

int main() {
    int numbers[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    for (int i = 0; i < 10; i-- { // Incorrect loop condition and syntax
        printf("Element %f: %f\\n", i, numbers[i]) // Incorrect format specifiers
    }

    return 0;
}`}
        </code>
      </pre>

      {/* DhyanAI's Response */}
      <div>
        <p className="text-lg font-semibold">DhyanAI</p>
        <p>
          Your C program has several syntax and logical errors. Here's what's
          wrong:
        </p>
      </div>

      {/* Errors List */}
      <div>
        <p className="text-lg font-semibold">Errors in the Code:</p>
        <ul className="list-disc pl-6">
          <li>Syntax Error: Missing closing parenthesis in `for` loop.</li>
          <li>
            Logical Error: `i--` causes an infinite loop; it should be `i++`.
          </li>
          <li>
            Incorrect format specifiers: `%f` is for floats, but `i` and
            `numbers[i]` are integers.
          </li>
          <li>Incorrect newline escape sequence (`\\n` instead of `\n`).</li>
        </ul>
      </div>

      {/* Corrected Code */}
      <p className="text-lg font-semibold">Corrected Code:</p>
      <pre className="bg-bgsec text-white p-4 rounded-lg overflow-x-auto">
        <code>
          {`#include <stdio.h>

int main() {
    int numbers[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    for (int i = 0; i < 10; i++) { // Fixed loop condition
        printf("Element %d: %d\\n", i, numbers[i]); // Fixed format specifiers
    }

    return 0;
}`}
        </code>
      </pre>

      {/* Conclusion */}
      <p>
        This corrected program properly iterates over the array and prints the
        elements as expected.
      </p>
    </div>
  );
};

export default CodeExample;
