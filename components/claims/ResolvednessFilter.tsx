import React from "react";

export type Status = boolean;

interface StatusFilterProps {
  onChange: (selectedStatuses: Status[]) => void;
}

function pprint(status: Status): string {
  return status ? "Resolved" : "Unresolved";
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
    <div className="mt-1 w-full flex flex-row justify-start space-x-4">
      {statuses.map((status) => {
        const resolvedness = pprint(status);
        return (
          <div key={resolvedness} className="flex items-center">
            <input
              type="checkbox"
              id={resolvedness}
              value={resolvedness}
              checked={selectedStatuses.includes(status)}
              onChange={() => handleCheckboxChange(status)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label
              htmlFor={resolvedness}
              className="ml-2 block bg-inherit text-sm"
            >
              {resolvedness}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default ResolvednessFilter;
