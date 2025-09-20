import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./config";

// User login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// User registration
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user display name
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }
    
    return user;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset failed:", error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Format error messages
export const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'User does not exist';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'Email address is already in use';
    case 'auth/weak-password':
      return 'Password is too weak, at least 6 characters required';
    case 'auth/invalid-email':
      return 'Invalid email format';
    case 'auth/too-many-requests':
      return 'Too many requests, please try again later';
    default:
      return error.message || 'An unknown error occurred';
  }
};
