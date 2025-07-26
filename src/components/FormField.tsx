import type { ChangeEventHandler, JSX, PropsWithChildren } from "react";
import type React from "react";
export type SelectOption = {
  value: string;
  label: string;
};

type FormFieldProps = PropsWithChildren & {
  type: "input" | "textarea" | "radio" | "checkbox" | "select" | "password";
  id: string;
  label: string;
  placeHolder?: string;
  value?: string;
  onChange?: (v: string) => void;
  options?: SelectOption[];
};

const FormField: React.FunctionComponent<FormFieldProps> = ({
  type,
  id,
  label,
  placeHolder,
  value = "",
  onChange,
  options,
}) => {
  let formElm: JSX.Element;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    evt.stopPropagation();
    if (onChange) {
      onChange(evt.target.value);
    }
  };

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    evt
  ) => {
    evt.stopPropagation();
    if (onChange) {
      onChange(evt.target.value);
    }
  };

  const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    evt.stopPropagation();
    if (onChange) {
      onChange(evt.target.value);
    }
  };

  switch (type) {
    case "input":
      formElm = (
        <input
          type="text"
          id={id}
          value={value}
          placeholder={placeHolder}
          onChange={handleInputChange}
        />
      );
      break;
    case "password":
      formElm = (
        <input
          type="password"
          id={id}
          value={value}
          placeholder={placeHolder}
          onChange={handleInputChange}
          autoComplete=""
        />
      );
      break;
    case "textarea":
      formElm = (
        <textarea
          id={id}
          onChange={handleTextareaChange}
          placeholder={placeHolder}
        />
      );
      break;
    case "radio":
      formElm = <input type="radio" id={id} onChange={handleInputChange} />;
      break;
    case "checkbox":
      formElm = <input type="checkbox" id={id} onChange={handleInputChange} />;
      break;
    case "select":
      formElm = (
        <select name="options" id={id} onChange={handleSelectChange}>
          {options?.map((o) => {
            return (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            );
          })}
        </select>
      );
      break;
    default:
      throw new Error(`Unknown FormFiled type ${type}`);
  }

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {formElm}
    </div>
  );
};

export default FormField;
