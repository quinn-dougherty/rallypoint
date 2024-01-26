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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedStatuses(value as Status[]);
    onChange(value as Status[]);
  };

  return (
    <select multiple value={selectedStatuses} onChange={handleChange}>
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default StatusFilter;
