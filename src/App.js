import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useState } from 'react';
import './App.css';
import initializeAuthentication from './firebase/firebase.initialize';

function App() {
    initializeAuthentication();
    const googleProvider = new GoogleAuthProvider();
    const gitHubProvider = new GithubAuthProvider();
    const auth = getAuth();
    // user state is to store user data from google/github
    const [user, setUser] = useState({});
    //error state is to show any error in login/registration time
    const [error, setError] = useState('');
    // ----------------------now set 2 states to update email and password when user to try to register
    const [userEmail, setUserEmail] = useState('');
    const [userPass, setUserPass] = useState('');
    // loginstatus will decide whether the user is already registered or not
    //if registered that means he will login otherwise he will register himself
    const [loginStatus, setLoginStatus] = useState(false);
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                console.log(result.user);
                const { displayName, email, photoURL } = result.user;
                const userDetails = {
                    name: displayName,
                    email: email,
                    photo: photoURL
                };
                setUser(userDetails);
            })
            .catch(error => {
                console.log(error);
            })
        return signOutButton;
    }
    const handleGitHubSignIn = () => {
        signInWithPopup(auth, gitHubProvider)
            .then(result => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                console.log(result);
            })
    }
    const handleSignOut = () => {
        signOut(auth).then(() => {
            setUser({});
        }).catch((error) => {

        });
    }
    const signOutButton =
        <button onClick={handleSignOut}>Signout</button>



    // function to get value from email field
    const getEmail = e => {
        setUserEmail(e.target.value);


    }
    // function to get value from password field
    const getPass = e => {
        setUserPass(e.target.value);

    }


    //this function is to register user
    //this function calls another function(register to validate password)
    const handleRegistration = () => {
        register(userEmail, userPass);
    }
    // this fucntion is to stop the page from reloading when the register button is clicked
    const registerButton = event => {
        event.preventDefault();
    }
    // -------- validating password
    const register = (email, pass) => {
        if (pass.length < 6) {
            setError("password length should be 6 or more characters long");
            return;
        }
        if (!/(?=.*[A-Z])/.test(pass)) {
            setError("Give at least one uppercase character");
            return;
        }
        if (!/(?=.*\d)/.test(pass)) {
            setError("Give atleast one digit");
            return;
        }
        //--------------validation done here , if validate the next createuser function will execute
        createUserWithEmailAndPassword(auth, email, pass)
            .then(result => {
                const user = result.user;
                console.log(user);
                handleEmailVerification();

            })
            .catch(error => {
                setError(error.message);
            })
    }
    // fucntions of login
    const handleLoginStatus = e => {
        e.target.checked === true ? setLoginStatus(true) : setLoginStatus(false);
    }
    const handleLogin = () => {
        signInWithEmailAndPassword(auth, userEmail, userPass)
            .then((result) => {

                const user = result.user;
                setError('Welcome');
            })
            .catch((error) => {

                const errorMessage = error.message;
                setError(errorMessage);
            });
    }
    //fucntion for forgot password by user
    const handleForgotPass = () => {
        sendPasswordResetEmail(auth, userEmail)
            .then(result => {
                setError('Check your email');
            })
    }
    // handle email verification here
    // we will call this function after user done with registration
    const handleEmailVerification = () => {
        sendEmailVerification(auth.currentUser)
            .then((result) => {
                console.log()
                setError("email verification sent");
            });
    }

    return (
        <div className="mx-5 my-5">
            {
                loginStatus === false ? <h1 className="text-primary mb-3">Please Register</h1> : <h1 className="text-primary mb-3">Please Login</h1>
            }
            <form onSubmit={registerButton}>
                {/* login form starts here */}
                <div className="mb-3">
                    {/* email address field starts */}
                    <label htmlFor="exampleInputEmail1" className="form-label" id="">Email address</label>
                    <input type="email" onBlur={getEmail} className="form-control" id="check" aria-describedby="emailHelp" required />
                    {/* email address field ends */}

                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                {/* passoword field */}
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" onBlur={getPass} className="form-control" id="exampleInputPassword1" required />
                    {/* checkbox */}
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={handleLoginStatus} />
                        <label className="form-check-label" htmlFor="exampleCheck1">Already Registered?</label>
                    </div>
                    <div className="text-danger">
                        {error}
                    </div>
                </div>
                {/* Register  and login button */}
                {
                    loginStatus === false ? <button type="submit" className="btn btn-primary" onClick={handleRegistration}>Register</button> :
                        <div>
                            <button type="submit" className="btn btn-primary" onClick={handleLogin} >Login</button>
                            <button type="submit" className="btn btn-primary mx-5" onClick={handleForgotPass} >Forgot Password</button>
                        </div>
                }

            </form>




            {/* <div className="my-5">
        -----------------------------------------------
      </div>
      <br />
      <br />
      <br />
      <button onClick={handleGoogleSignIn}>Google sign in</button>
      <br />
      <button onClick={handleGitHubSignIn}>Github sign in </button>
      {
        user.email &&
        <div>
          <h1>Welcome {user.name}</h1>
          <h3>your email is : {user.email}</h3>
          <img src={user.photo} alt="imtiaz" />
          <br />
          {signOutButton}
        </div>
      } */}
        </div>
    );
}

export default App;
