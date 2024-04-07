import React from "react";
import { Range } from "react-range";

interface PercentageInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

function PercentageInput({ value, onChange }: PercentageInputProps) {
  const handleChange = (number: number) => {
    // Ensure the value is between 0 and 100
    const newValue = Math.max(0, Math.min(number, 100));

    onChange(newValue);
  };

  return (
    <Range
      step={50}
      min={50}
      max={100}
      values={[value]}
      onChange={(values) => handleChange(values[0])}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "6px",
            width: "100%",
            backgroundColor: "#ccc",
          }}
        >
          {children}
        </div>
      )}
      renderMark={({ props, index }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "16px",
            width: "5px",
            backgroundColor: index * 50 < value ? "#548BF4" : "#ccc",
          }}
        />
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "24px",
            width: "24px",
            borderRadius: "4px",
            backgroundColor: "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0px 2px 6px #AAA",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-28px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              padding: "4px",
              borderRadius: "4px",
              backgroundColor: "#548BF4",
            }}
          >
            {value.toFixed(1)}%
          </div>
          <div
            style={{
              height: "16px",
              width: "5px",
              backgroundColor: isDragged ? "#548BF4" : "#CCC",
            }}
          />
        </div>
      )}
    />
  );
}

export default PercentageInput;
