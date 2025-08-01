import React from "react";

interface Card {
  id: number;
  name: string;
  email: string;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="bg-[#FAF9F6] shadow-lg rounded-lg p-2 mb-2">
      <p className="text-lg text-[#005050]">{card.name}</p>
      <p className="text-md font-semibold text- text-[#003a3a]">{card.email}</p>
      <p className="text-sm text-[#005050c3]">ID: {card.id}</p>
    </div>
  );
};

export default CardComponent;
