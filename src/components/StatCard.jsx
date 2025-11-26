import React from "react";

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    green: "bg-green-100 text-green-700 border-green-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
  };
  return (
    <div
      className={`text-center p-4 rounded-xl border shadow-sm ${colors[color]}`}
    >
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
};

export default StatCard;
