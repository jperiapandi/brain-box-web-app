import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";

export type DialogRef = {
  open: () => void;
  close: () => void;
};

type DialogProps = PropsWithChildren & {
  title: string;
  labelConfirm: string;
  labelCancel: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};
const Dialog = forwardRef<DialogRef, DialogProps>((props, ref) => {
  const dialogHtmlElm = useRef<HTMLDialogElement>(null);
  const {
    children,
    title,
    labelConfirm = "Yes",
    labelCancel = "No",
    onConfirm,
    onCancel,
  } = props;

  const handleConfirmClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    dialogHtmlElm.current?.close();
    onConfirm?.();
  };
  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    dialogHtmlElm.current?.close();
    onCancel?.();
  };
  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialogHtmlElm.current?.showModal();
      },
      close: () => {
        dialogHtmlElm.current?.close();
      },
    };
  });

  return (
    <dialog className="modal base-dialog" ref={dialogHtmlElm}>
      <div className="container">
        <div className="header">
          <h1>{title}</h1>
        </div>

        <div className="content">{children}</div>

        <div className="footer">
          <button className="btn" onClick={handleCancelClick}>
            {labelCancel}
          </button>
          <button className="btn btn-primary" onClick={handleConfirmClick}>
            {labelConfirm}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default Dialog;
