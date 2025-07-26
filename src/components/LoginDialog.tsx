import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";

export type ModalRef = {
  openModal: () => void;
  closeModal: () => void;
};

type LoginDialogProps = PropsWithChildren & {
  message: string;
  onLoginClick: () => void;
};

const LoginDialog = forwardRef<ModalRef, LoginDialogProps>((props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const loginBtnRef = useRef<HTMLButtonElement>(null);
  const { message, onLoginClick } = props;

  useImperativeHandle(ref, () => {
    return {
      openModal: () => {
        dialogRef.current?.showModal();
        loginBtnRef.current?.focus();
      },
      closeModal: () => {
        dialogRef.current?.close();
      },
    };
  });

  const handleLoginClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    dialogRef.current?.close();
    onLoginClick();
  };

  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    dialogRef.current?.close();
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="login-modal-container">
        <h1>Login</h1>
        <div className="message">{message}</div>
        <footer>
          <button className="btn" onClick={handleCancelClick}>
            I will do it later.
          </button>
          <button
            ref={loginBtnRef}
            className="btn btn-primary"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </footer>
      </div>
    </dialog>
  );
});

export default LoginDialog;
