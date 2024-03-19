import React from "react";
import { Status } from "@/types/Enums";

interface StatusFilterProps {
  onChange: (selectedStatuses: Status[]) => void;
  selectedStatuses: Status[];
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  onChange,
  selectedStatuses,
}) => {
  const statuses: Status[] = ["claimed", "unclaimed", "finished"];

  const toggleStatus = (status: Status) => {
    const isCurrentlySelected = selectedStatuses.includes(status);
    const newSelectedStatuses = isCurrentlySelected
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onChange(newSelectedStatuses);
  };

  return (
    <div className="flex flex-wrap justify-start gap-2 p-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => toggleStatus(status)}
          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
            selectedStatuses.includes(status)
              ? "text-gray-800 bg-[hsl(var(--foreground))]"
              : "border border-[hsl(var(--foreground))] text-white"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
