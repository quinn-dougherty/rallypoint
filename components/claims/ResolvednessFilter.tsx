import React from "react";

export type Status = boolean;

interface StatusFilterProps {
  onChange: (selectedStatuses: Status[]) => void;
}

const ResolvednessFilter: React.FC<StatusFilterProps> = ({ onChange }) => {
  const statuses: Status[] = [true, false];
  const [selectedStatuses, setSelectedStatuses] =
    React.useState<Status[]>(statuses);

  const handleCheckboxChange = (status: Status) => {
    const newSelectedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newSelectedStatuses);
    onChange(newSelectedStatuses);
  };

  return (
    <div className="flex flex-row justify-start p-2 composite-buttons center">
      {statuses.map((status) => {
        return (
          <button
            key={`_${status}`}
            onClick={() => handleCheckboxChange(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer button ${
              selectedStatuses.includes(status)
                ? "text-gray-800 bg-[hsl(var(--foreground))]"
                : "border border-[hsl(var(--foreground))] text-white"
            }`}
          >
            {status ? "Resolved" : "Unresolved"}
          </button>
        );
      })}
    </div>
  );
};

export default ResolvednessFilter;
