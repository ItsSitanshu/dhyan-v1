"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
 
const DetailsPopup: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupStyle, setPopupStyle] = useState({});

  useEffect(() => {
    if (isOpen && buttonRef.current && popupRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();

      let top = buttonRect.bottom + 5;
      let left = buttonRect.left;

      if (top + popupRect.height > window.innerHeight) {
        top = buttonRect.top - popupRect.height - 5;
      }

      if (left + popupRect.width > window.innerWidth) {
        left = window.innerWidth - popupRect.width - 10;
      }


      setPopupStyle({ top, left: (left + popupRect.width / 4), position: "absolute" });
    }
  }, [isOpen]);

  return (
    <div >
      <button ref={buttonRef} className="px-3 py-2 rounded-md" onClick={() => setIsOpen(!isOpen)}>
        <Image src={require('@/app/assets/icons/more.svg')} className="h-5 w-5" height={64} width={64} alt="..."/>
      </button>
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute border border-white bg-foreground shadow-lg rounded-xl p-2 text-sm font-semibold z-50 w-32 max-w-[200px] overflow-hidden"
          style={popupStyle}
        >
          <button onClick={onEdit} className="block px-3 py-2 text-background hover:bg-white/10 duration-300 rounded-md w-full text-left">
            Edit Name
          </button>
          <button onClick={onDelete} className="block px-3 py-2 text-red-600 hover:bg-white/10 duration-300 rounded-md w-full text-left">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailsPopup;
