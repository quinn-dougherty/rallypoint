import React from "react";

interface PercentageInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

function PercentageInput({ value, onChange }: PercentageInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value, 10);

    // Ensure the value is between 0 and 100
    newValue = Math.max(0, Math.min(newValue, 100));

    onChange(newValue);
  };

  return (
    <input
      className="rounded-md px-4 py-2 bg-inherit border mb-6"
      type="number"
      value={value}
      onChange={handleChange}
      min={0}
      max={100}
    />
  );
}

export default PercentageInput;
