import React from "react";

const CodeExample = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-6">
      <div>
        <p className="text-lg font-semibold">User</p>
        <p className="text-psec">
          This code is not working like I expect — how do I fix it?
        </p>
      </div>

      <div className="w-full bg-lprim p-6 rounded-lg text-foreground text-sm overflow-x-auto">
        <pre>
          <code>
            {`#include <stdio.h>

int main() {
    int numbers[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    for (int i = 0; i < 10; i++) {
        printf("Element %d: %d\\n", i, numbers[i]);
    }

    return 0;
}`}
          </code>
        </pre>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-lg font-semibold">DhyanAI</p>
          <p className="text-psec">
            It looks like your code is correctly printing the array elements. Is
            there a specific issue you're facing?
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeExample;
