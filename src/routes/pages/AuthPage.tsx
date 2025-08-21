import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import FormField from "../../components/FormField";
import {
  useEffect,
  useState,
  type FormEventHandler,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { NavLink, useNavigate } from "react-router";
import { HOME_PAGE_PATH } from "../router";
import Spinner from "../../components/Spinner";

const SIGN_IN = "sign-in";
const SIGN_UP = "sign-up";
const FORGOT_PASSWORD = "forgot-password";
const ANONYMOUS_SIGN_IN = "anonymous-sign-in";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const AuthPage: React.FunctionComponent = () => {
  const [uiState, setUiState] = useState(SIGN_IN);
  let title = "Sign In";
  switch (uiState) {
    case SIGN_UP:
      title = "Sign Up";
      break;
    case FORGOT_PASSWORD:
      title = "Reset Password";
      break;
    case ANONYMOUS_SIGN_IN:
      title = "Guest Sign In";
      break;
  }

  return (
    <>
      <PageHeader title={title} profile={false} />

      <main className="main-auth-page">
        {uiState == SIGN_IN && <SignInSection changeUiState={setUiState} />}
        {uiState == SIGN_UP && <SignUpSection changeUiState={setUiState} />}
        {uiState == FORGOT_PASSWORD && (
          <RecoverSection changeUiState={setUiState} />
        )}
        {uiState == ANONYMOUS_SIGN_IN && (
          <AnonymousSignInSection changeUiState={() => {}} />
        )}
      </main>

      <footer className="auth-page-footer">
        <NavLink to={HOME_PAGE_PATH}>Home</NavLink>
      </footer>
    </>
  );
};

type AuthSectionProps = PropsWithChildren & {
  changeUiState: (v: string) => void;
};

//SignIn Section
const SignInSection: React.FunctionComponent<AuthSectionProps> = ({
  changeUiState,
}) => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [progressState, setProgressState] = useState(false);
  const [errorState, setShowErrorState] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setShowErrorState(false);
    setProgressState(false);
  }, [emailId, password]);

  const onSigninSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    console.log(`Signin `);
    //
    try {
      setShowErrorState(false);
      setProgressState(true);

      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        emailId,
        password
      );

      console.log(`SignIn Success`);
      console.log(userCredential);

      setShowErrorState(false);
      setProgressState(false);

      navigate(HOME_PAGE_PATH);
    } catch (err) {
      console.error(err);
      setShowErrorState(true);
      setProgressState(false);
    }
  };
  const onForgotPasswordClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    changeUiState(FORGOT_PASSWORD);
  };
  const onJoinUsClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    changeUiState(SIGN_UP);
  };

  const onGuestSignInClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    changeUiState(ANONYMOUS_SIGN_IN);
  };
  const disableSignIn = emailId == "" || password == "";

  return (
    <section className="section-signin">
      <h2>Registered users - Login using your email ID</h2>
      <form action="submit" onSubmit={onSigninSubmit} id="signin-form">
        <FormField
          value={emailId}
          onChange={setEmailId}
          id="signin-email"
          type="input"
          label="Email-ID"
          placeHolder="emailid@sample.com"
        />
        <FormField
          value={password}
          onChange={setPassword}
          id="signin-pwd"
          type="password"
          label="Password"
          placeHolder="Password"
        />
      </form>

      <div className="two-controls">
        <div>
          <a href="#forgotpwd" onClick={onForgotPasswordClick}>
            Forgot Password?
          </a>
        </div>
        <button
          className="btn btn-primary"
          form="signin-form"
          type="submit"
          disabled={disableSignIn || progressState}
        >
          <span className="material-symbols-rounded">login</span>
          <span>Sign In</span>
        </button>
      </div>

      <div className="controls-container-h">
        {progressState && (
          <>
            <Spinner />
            <div className="info">Please wait..</div>
          </>
        )}
        {errorState && <p className="error">Login failed. Please try again.</p>}
      </div>

      <div>OR</div>
      <button className="btn btn-secondary" onClick={onGuestSignInClick}>
        Login as a Guest User.
      </button>

      <p>
        Not a registered user ?{" "}
        <a href="#" onClick={onJoinUsClick}>
          Click here to join us.
        </a>
      </p>
    </section>
  );
};
//SignUp Section

const SignUpSection: React.FunctionComponent<AuthSectionProps> = ({
  changeUiState,
}) => {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [signUpDisabled, setSignUpDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [progressState, setProgressState] = useState(false);

  useEffect(() => {
    setErrorState(false);
    setErrorMsg("");
    setSignUpDisabled(true);

    const timeout = setTimeout(() => {
      //Delayed operation
      // console.log(`Debounced validation ${new Date().getTime()}`);
      if (
        displayName == "" ||
        email == "" ||
        password == "" ||
        passwordConfirm == ""
      ) {
        return;
      }
      const validDisplayName = displayName != "";
      const validEmail = email != "" && EMAIL_REGEX.test(email);

      if (!validEmail) {
        setErrorState(true);
        setErrorMsg("Please provide a valid email.");
        return;
      }

      const validPwd = password != "";
      const validPwdCfm = passwordConfirm != "";

      const pwdsSame = validPwd && validPwdCfm && password == passwordConfirm;
      const pwdRuleSatisfied = password.length >= 6;

      const allGood =
        validDisplayName &&
        validEmail &&
        validPwd &&
        validPwdCfm &&
        pwdsSame &&
        pwdRuleSatisfied;

      setSignUpDisabled(!allGood);

      if (password != "" && passwordConfirm != "" && !pwdsSame) {
        setErrorState(true);
        setErrorMsg("Please confirm the passwords are same.");
      } else {
        if (password.length < 6) {
          setErrorState(true);
          setErrorMsg("Password should be at least 6 characters.");
        }
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [displayName, email, password, passwordConfirm]);
  const onSignupSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    console.log(`Signup `);
    try {
      setErrorState(false);
      setErrorMsg("");
      setSignUpDisabled(true);
      setProgressState(true);

      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      console.log(
        `User '${userCredential.user.email}' Registered Successfully.`
      );
      await updateProfile(userCredential.user, { displayName });
      console.log(`User's display name set successfully.`);
      setProgressState(false);
      //Navigate to Home page
      navigate(HOME_PAGE_PATH);
    } catch (err) {
      console.error(err);
      setErrorState(true);
      setErrorMsg("Sorry, something went wrong. Please try signing up later.");
      setSignUpDisabled(false);
      setProgressState(false);
    }
  };
  const onLoginAnchorClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    changeUiState(SIGN_IN);
  };
  return (
    <section className="section-signup">
      <h2>Sign Up using your email ID</h2>
      <form action="submit" onSubmit={onSignupSubmit} id="signup-form">
        <FormField
          type="input"
          label="Full Name"
          id="signup-full-name"
          value={displayName}
          onChange={setDisplayName}
        />
        <FormField
          type="input"
          label="Email ID:"
          id="signup-email"
          value={email}
          onChange={setEmail}
        />
        <FormField
          type="password"
          label="Password:"
          id="signup-pwd"
          value={password}
          onChange={setPassword}
        />
        <FormField
          type="password"
          label="Confirm Password:"
          id="signup-pwd-cfm"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
        />
      </form>

      <div className="two-controls">
        <div>
          Existing user?{" "}
          <a href="#signin" onClick={onLoginAnchorClick}>
            Please login.
          </a>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          form="signup-form"
          disabled={signUpDisabled}
        >
          <span className="material-symbols-rounded">login</span>
          <span>Sign Up</span>
        </button>
      </div>

      <div className="controls-container-h">
        {progressState && (
          <>
            <Spinner />
            <div className="info">Please wait..</div>
          </>
        )}
        {errorState && <div className="error">{errorMsg}</div>}
      </div>
    </section>
  );
};
//Forgot Password Section
const RecoverSection: React.FunctionComponent<AuthSectionProps> = ({
  changeUiState,
}) => {
  const onResetPasswordSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    console.log(`Reset Password `);
  };
  const onLoginAnchorClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    changeUiState(SIGN_IN);
  };
  return (
    <section className="section-recover-password">
      <h2>Reset Password</h2>
      <form action="submit" onSubmit={onResetPasswordSubmit}>
        <FormField
          type="input"
          label="Registered Email ID:"
          id="reset-pwd-email-id"
          placeHolder="emaild@sample.com"
        />
      </form>
      <div>
        We will send a password reset email to your email id. Please follow the
        link to reset the password.
      </div>
      <div className="two-controls">
        <div>
          Remember Password?{" "}
          <a href="#signin" onClick={onLoginAnchorClick}>
            Please login.
          </a>
        </div>
        <button className="btn btn-primary" type="submit" form="signup-form">
          <span className="material-symbols-rounded">laps</span>
          <span>Reset Password</span>
        </button>
      </div>
    </section>
  );
};

//Anonymous SignIn Section
const AnonymousSignInSection: React.FunctionComponent<
  AuthSectionProps
> = () => {
  const navigate = useNavigate();
  const [progressState, setProgressState] = useState(true);
  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [needDisplayName, setNeedDisplayName] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setProgressState(true);
    setSuccessState(false);
    setErrorState(false);

    const timeout = setTimeout(async () => {
      try {
        const userCredential = await signInAnonymously(getAuth());
        console.log(userCredential);
        setProgressState(false);
        setSuccessState(true);
        setErrorState(false);

        //Check whether this user has a displayName or not
        if (userCredential.user.displayName == null) {
          setNeedDisplayName(true);
        } else {
          //Redirect to Home Page
          navigate(HOME_PAGE_PATH);
        }
      } catch (err) {
        setProgressState(false);
        setSuccessState(false);
        setErrorState(true);
      }
    }, 1000);

    return () => {
      //TODO Clean up
      clearTimeout(timeout);
    };
  }, []);

  const submitDisabled = displayName == "";

  const formSubmitHandler: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    //
    if (displayName == "") {
      setErrorState(true);
      // setProgressState(true);
    } else {
      console.log(`update display name for Guest User`);
      try {
        // if()
        const user = getAuth().currentUser;
        if (user) {
          await updateProfile(user, {
            displayName,
          });

          console.log(`Guest user displayName set successfully.`);
          navigate(HOME_PAGE_PATH);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <section className="section-recover-password">
      <h2>Sign In as a Guest</h2>
      <div className="container">
        {progressState && (
          <>
            <div className="controls-container-h">
              <Spinner />
              <div className="info">Please wait..</div>
            </div>
          </>
        )}
        {errorState && (
          <div className="error">
            Sorry! something went wrong. Please try again later.
          </div>
        )}

        {successState && (
          <div className="success-container">
            <div>You are now signed in as a guest user.</div>

            {needDisplayName && (
              <>
                <div>Set your display name</div>
                <form
                  action="submit"
                  id="anonymous-form"
                  onSubmit={formSubmitHandler}
                >
                  <FormField
                    value={displayName}
                    onChange={setDisplayName}
                    type="input"
                    label="Display Name"
                    id="anonymous-display-name"
                    placeHolder="Guest"
                  />
                </form>
                <div className="footer">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    form="anonymous-form"
                    disabled={submitDisabled}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
export default AuthPage;
