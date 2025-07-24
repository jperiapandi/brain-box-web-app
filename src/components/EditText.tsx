import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type JSX,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";
import type React from "react";

type EditTextProps = PropsWithChildren & {
  text: string;
  onChange: (v: string) => void;
};
const EditText: React.FunctionComponent<EditTextProps> = ({
  text,
  onChange,
}) => {
  const [value, setValue] = useState(text);
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const changed = value.trim() !== text.trim();

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edit]);

  function save() {
    //Notify and switch back to non-edit mode.
    // console.log(`Compare value:${value} ::: text:${text}`);
    setEdit(false);
    if (changed) {
      onChange(value);
    }
  }

  function undo() {
    //Reset and switch back to non-edit mode.
    setValue(text);
    setEdit(false);
  }

  const handleTextClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (evt) => {
      evt.stopPropagation();
      setEdit(true);
    },
    []
  );

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    evt.stopPropagation();
    setValue(evt.target.value);
  };

  const handleKeyHits: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (evt.key == "Enter") {
      evt.stopPropagation();
      evt.preventDefault();
      save();
    }
    if (evt.key == "Escape") {
      evt.stopPropagation();
      evt.preventDefault();
      undo();
    }
  };

  const handleOkayClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    save();
  };
  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    undo();
  };

  let contentChildren: JSX.Element;
  if (edit) {
    contentChildren = (
      <>
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyHits}
          ref={inputRef}
        />
        <button
          className="icon-btn"
          onClick={handleCancelClick}
          disabled={!changed}
        >
          <span className="material-symbols-rounded">undo</span>
        </button>
        <button className="icon-btn" onClick={handleOkayClick}>
          <span className="material-symbols-rounded">check</span>
        </button>
      </>
    );
  } else {
    contentChildren = (
      <>
        <div onClick={handleTextClick} className="text-value">
          {text}
        </div>
      </>
    );
  }

  return <div className="edit-text">{contentChildren}</div>;
};

export default EditText;
