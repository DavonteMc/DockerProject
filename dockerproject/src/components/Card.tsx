import React from "react";

interface Card {
  studentId: number;
  studentName: string;
  courseName: string;
  date: Date;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="bg-[#FAF9F6] shadow-lg rounded-lg p-2 mb-2">
      <p className="text-lg text-[#005050]">{card.studentId}</p>
      <p className="text-md font-semibold text- text-[#003a3a]">{card.studentName}</p>
      <p className="text-sm text-[#005050c3]">Course: {card.courseName}</p>
      <p className="text-xs text-[#005050c3]">Date: {new Date(card.date).toLocaleDateString()}</p>
    </div>
  );
};

export default CardComponent;
