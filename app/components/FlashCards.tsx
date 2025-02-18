import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FlashcardDeck: React.FC<{ flashcards: any }> = ({ flashcards }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="flex flex-col items-center h-64 justify-center border border-white/20 rounded-xl p-6">
      <div className="relative w-full h-full flex flex-row items-center justify-between">
        {/* Previous Button */}
        <button
          className="px-4 py-2 h-1/4 aspect-square hover:bg-white/30 transition-all duration-500 text-white rounded-lg shadow-md"
          onClick={prevCard}
        >
          <Image src={require("@/app/assets/icons/larrow.svg")} width={256} height={256} alt="←" />
        </button>

        {/* Flashcard */}
        <div className="h-full w-4/6 perspective-1000">
          <motion.div
            className="relative w-full h-full shadow-xl rounded-2xl cursor-pointer text-xl text-background text-center bg-lprim"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setFlipped(!flipped)}
          >
            <div
              className="absolute inset-0 flex items-center justify-center p-6 backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              {flashcards[index].question}
            </div>

            <div
              className="absolute inset-0 flex items-center justify-center p-6 bg-lprim rounded-2xl backface-hidden"
              style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            >
              {flashcards[index].answer}
            </div>
          </motion.div>
        </div>

        {/* Next Button */}
        <button
          className="px-4 py-2 h-1/4 aspect-square hover:bg-white/30 transition-all duration-500 text-white rounded-lg shadow-md"
          onClick={nextCard}
        >
          <Image src={require("@/app/assets/icons/rarrow.svg")} width={256} height={256} alt="→" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
