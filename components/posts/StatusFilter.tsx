import React from "react";
import { Status } from "@/types/Enums";

interface StatusFilterProps {
  onChange: (selectedStatuses: Status[]) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ onChange }) => {
  const statuses: Status[] = ["claimed", "unclaimed", "finished"];
  const [selectedStatuses, setSelectedStatuses] = React.useState<Status[]>([
    "claimed",
    "unclaimed",
  ]);

  const handleCheckboxChange = (status: Status) => {
    const newSelectedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newSelectedStatuses);
    onChange(newSelectedStatuses);
  };

  return (
    <div className="mt-1 w-full flex flex-row justify-start space-x-4">
      {statuses.map((status) => (
        <div key={status} className="flex items-center">
          <input
            type="checkbox"
            id={status}
            value={status}
            checked={selectedStatuses.includes(status)}
            onChange={() => handleCheckboxChange(status)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label htmlFor={status} className="ml-2 block bg-inherit text-sm">
            {status}
          </label>
        </div>
      ))}
    </div>
  );
};

export default StatusFilter;
