import SignIn from "./SignIn";
import SignUp from "./SignUp";
import userSlice, { login, logout } from "./userSlice";

export { SignIn, SignUp, userSlice as userReducer, login, logout };



// The index.ts file serves as a central export point for the authentication components and Redux Slice.
// It imports the SignIn and SignUp components, along with the userSlice and specific actions (login, logout) from the userSlice.
// These imports are then re-exported, making them available for use in other parts of the application.
// By centralizing these exports, the index.ts file helps keep the import statements in other files cleaner and more manageable.
// This approach also promotes better organization and easier maintenance of the authentication-related code.