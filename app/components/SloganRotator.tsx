import { useEffect, useState } from "react";

interface SloganRotatorInterface {
  slogans?: string[];
  typingSpeed?: number; 
  deletingSpeed?: number;
  changingSpeed?: number;
};

const defaultSlogans = [
  "केहि मिठो पाठ पढ",  
  "ध्यान दिएर पढ",  
  "ध्यान संग अध्ययन",
];

  // "I will teach without the boring lectures",
  // "I will make learning fun—no chalk dust required",
  // "I will answer questions without sighing first",
  // "I will repeat myself without getting annoyed",
  // "I will simplify topics; no confusing tangents",
  // "I will adapt to your pace, unlike your social teacher",
  // "I will make tough topics easy; no red pen corrections",
  // "I will teach without saying ‘yo ta class 6 ko kura ho!’",
  // "I will repeat myself without saying ‘kaan kholera sun!’",
  // "I will explain without throwing dusters at you",
  // "I will answer questions; no ‘ghar gayera aafai gar!’",
  // "I will make learning fun; no duster flying at your head",
  // "I will teach without the ‘40 marks internal, ho ni?’ stress",
  // "I will simplify things; no unnecessary ghyan like sir ko lecture",
  // "I will help you learn; no ‘bujhena vane yo kitaab nalyauna!’",
  // "I will guide you; without ‘yo ta testo easy ho!’ frustration",
  // "I will make learning fun; no ‘yo exam ma aaudaina, hataideu’ moments",
  // "I will teach you like balram sir teaches chemistry",
  // "I will explain to you without calling you 'tori bhai'",
  // "I won't call you 'bekuf baccha'"

const SloganRotator: React.FC<SloganRotatorInterface> = ({
  slogans = defaultSlogans,
  typingSpeed = 100,
  deletingSpeed = 50,
  changingSpeed = 1500,
}) => {

  const [typedSlogan, setTypedSlogan] = useState<string>("");
  const [sloganIndex, setSloganIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = 0;
  
    const currentSlogan = slogans[sloganIndex];

    if (isDeleting) {
      interval = setInterval(() => {
        setTypedSlogan((prev) => prev.slice(0, -1));
      }, deletingSpeed);

      if (typedSlogan === "") {
        slogans.sort(() => 0.5 - Math.random());
        clearInterval(interval);
        setIsDeleting(false);
        setSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
      }
    } else {
      if (typedSlogan.length < currentSlogan.length) {
        interval = setInterval(() => {
          setTypedSlogan((prev) => currentSlogan.slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        clearInterval(interval);
        setTimeout(() => setIsDeleting(true), changingSpeed);
      }
    }

    return () => clearInterval(interval);
  }, [typedSlogan, isDeleting, sloganIndex, slogans]);

  return (
    <div className="flex flex-col items-center mt-10">
    <h1 className="text-8xl font-semibold mb-6">{typedSlogan}</h1>
    </div>
  );
};

export default SloganRotator;