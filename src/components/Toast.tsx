import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export type ToastRef = {
  showToast: (message: string) => void;
};

const Toast = forwardRef<ToastRef>((props, ref) => {
  console.log(props); //ToDo - Remove this.
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");

  useImperativeHandle(ref, () => {
    return {
      showToast: (message) => {
        setMessage(message);
        setShow(true);
      },
    };
  });

  useEffect(() => {
    let timeout = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  if (!show || message == "") {
    return null;
  }

  return (
    <div className="toast two-controls-100-1">
      <div>{message}</div>
      <div>
        <button className="icon-btn">
          <span className="material-symbols-rounded">close_small</span>
        </button>
      </div>
    </div>
  );
});

export default Toast;
