interface RangeFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}

export function RangeField({ id, label, value, min, max, step, display, onChange }: RangeFieldProps) {
  return (
    <div className="range-field">
      <div className="range-field__head">
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
        <output className="range-field__value" htmlFor={id}>
          {display}
        </output>
      </div>
      <input
        className="range-field__input"
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
