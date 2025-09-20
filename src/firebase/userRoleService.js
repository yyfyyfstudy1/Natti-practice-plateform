import { 
  collection, 
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { db } from "./config";

// Collection reference
const userRolesCollection = collection(db, "userRoles");

// User roles constants
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Get user role by user ID
export const getUserRole = async (userId) => {
  try {
    const q = query(userRolesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const roleDoc = querySnapshot.docs[0];
      return roleDoc.data().role;
    }
    
    // Default role is 'user' if not found
    return USER_ROLES.USER;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return USER_ROLES.USER;
  }
};

// Set user role
export const setUserRole = async (userId, role) => {
  try {
    const q = query(userRolesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing role
      const roleDoc = querySnapshot.docs[0];
      await updateDoc(roleDoc.ref, { role });
    } else {
      // Create new role entry
      await addDoc(userRolesCollection, {
        userId,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
};

// Check if user is admin
export const isUserAdmin = async (userId) => {
  try {
    const role = await getUserRole(userId);
    return role === USER_ROLES.ADMIN;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Initialize admin user (for development)
export const initializeAdminUser = async (userEmail) => {
  try {
    // This is for development purposes
    // In production, you would have a more secure way to assign admin roles
    const q = query(userRolesCollection, where("userId", "==", userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      await addDoc(userRolesCollection, {
        userId: userEmail,
        role: USER_ROLES.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Admin role assigned to ${userEmail}`);
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

// Get all users with roles (admin function)
export const getAllUsersWithRoles = async () => {
  try {
    const querySnapshot = await getDocs(userRolesCollection);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users with roles:", error);
    return [];
  }
};
