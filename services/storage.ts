import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  sendPasswordResetEmail, 
  sendEmailVerification 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { Project, User } from '../types';
import { PROJECTS as INITIAL_PROJECTS } from '../constants';

// Firebase Configuration
// NOTE: For a real deployment, ensure these are set in your environment variables.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-key", 
  authDomain: "afrohub-developer.firebaseapp.com",
  projectId: "afrohub-developer",
  storageBucket: "afrohub-developer.appspot.com",
  messagingSenderId: "217640246127",
  appId: process.env.FIREBASE_APP_ID || "demo-app-id"
};

const isDemo = firebaseConfig.apiKey === "demo-key" || firebaseConfig.apiKey === "YOUR_API_KEY_HERE";

// Initialize Firebase conditionally
let app: any;
let auth: any;
let db: any;

try {
  if (!isDemo) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase API Key missing. Running in DEMO mode with mock data.");
  }
} catch (e) {
  console.error("Firebase Initialization Failed", e);
}

export const storageService = {
  // Public Project Fetching
  getProjects: async (): Promise<Project[]> => {
    if (isDemo || !db) {
       // Return constants for demo
       return INITIAL_PROJECTS;
    }
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      let projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      projects = projects.filter(p => p.status === 'published');
      if (projects.length === 0) return INITIAL_PROJECTS;
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return INITIAL_PROJECTS;
    }
  },

  // Developer Specific Project Fetching
  getUserProjects: async (userId: string): Promise<Project[]> => {
    if (isDemo || !db) {
      return INITIAL_PROJECTS; // Just show initial ones for demo
    }
    try {
      const q = query(collection(db, 'projects'), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      return projects;
    } catch (error) {
      console.error("Error fetching user projects:", error);
      return [];
    }
  },

  addProject: async (project: Project): Promise<void> => {
    if (isDemo || !db) {
       console.log("DEMO: Added project", project);
       INITIAL_PROJECTS.push({ ...project, id: Math.random().toString() });
       return;
    }
    try {
      const { id, ...data } = project;
      if (id && id.length > 20) { 
         await setDoc(doc(db, 'projects', id), data);
      } else {
         await addDoc(collection(db, 'projects'), data);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  updateProject: async (project: Project): Promise<void> => {
    if (isDemo || !db) {
       console.log("DEMO: Updated project", project);
       return;
    }
    try {
      const { id, ...data } = project;
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, data);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  deleteProject: async (projectId: string): Promise<void> => {
    if (isDemo || !db) {
       console.log("DEMO: Deleted project", projectId);
       return;
    }
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  // Auth Methods
  checkUserExists: async (email: string): Promise<'exists' | 'new' | 'google'> => {
    if (isDemo || !auth) return 'new';
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) return 'new';
      if (methods.includes('google.com')) return 'google';
      return 'exists';
    } catch (error) {
      console.warn("Could not fetch sign in methods:", error);
      return 'new'; 
    }
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    if (isDemo || !auth) {
       // Simulate registration
       return { id: 'demo-user', name, email, role: 'developer', emailVerified: true };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      await updateProfile(fbUser, { displayName: name });
      await sendEmailVerification(fbUser);

      const user: User = {
        id: fbUser.uid,
        name: name,
        email: email,
        role: 'user',
        emailVerified: false
      };

      await setDoc(doc(db, 'users', fbUser.uid), user);
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    if (isDemo || !auth) {
       // Simulate login
       return { id: 'demo-user', name: 'Demo User', email, role: 'developer', emailVerified: true };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      await fbUser.reload();
      return await storageService.getUserProfile(auth.currentUser || fbUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  loginWithGoogle: async (): Promise<User> => {
    if (isDemo || !auth) {
       return { id: 'demo-user-google', name: 'Google User', email: 'demo@google.com', role: 'developer', emailVerified: true, avatar: 'https://via.placeholder.com/40' };
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      
      if (!userDoc.exists()) {
        const newUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'User',
          email: fbUser.email || '',
          role: 'user',
          avatar: fbUser.photoURL || undefined,
          emailVerified: fbUser.emailVerified
        };
        await setDoc(doc(db, 'users', fbUser.uid), newUser);
        return newUser;
      }
      
      return await storageService.getUserProfile(fbUser);
    } catch (error) {
      console.error("Google Sign In Error", error);
      throw error;
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    if (isDemo || !auth) return;
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
       console.error("Reset password error", error);
       throw error;
    }
  },

  resendVerification: async (): Promise<void> => {
    if (isDemo || !auth) return;
    if (auth.currentUser && !auth.currentUser.emailVerified) {
       await sendEmailVerification(auth.currentUser);
    }
  },

  getUserProfile: async (fbUser: any): Promise<User> => {
    if (isDemo || !db) {
       return { id: fbUser.uid, name: fbUser.displayName || 'Demo User', email: fbUser.email, role: 'developer', emailVerified: true };
    }
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    const userData = (userDoc.exists() ? userDoc.data() : {}) as Partial<User>;
    
    return {
      id: fbUser.uid,
      name: fbUser.displayName || userData.name || 'User',
      email: fbUser.email || userData.email || '',
      role: userData.role || 'user',
      avatar: fbUser.photoURL || userData.avatar,
      emailVerified: fbUser.emailVerified
    };
  },

  updateUser: async (user: User): Promise<void> => {
    if (isDemo || !db) return;
    try {
      await updateDoc(doc(db, 'users', user.id), {
        role: user.role,
        name: user.name
      });
      if (auth.currentUser && user.name !== auth.currentUser.displayName) {
          await updateProfile(auth.currentUser, { displayName: user.name });
      }
    } catch (error) {
       console.error("Update user error:", error);
       throw error;
    }
  },

  logout: async (): Promise<void> => {
    if (isDemo || !auth) return;
    await signOut(auth);
  },

  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    if (isDemo || !auth) {
      // Simulate no user initially for demo
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
         try {
            const user = await storageService.getUserProfile(fbUser);
            callback(user);
         } catch (e) {
            console.error("Error fetching user profile", e);
            callback(null);
         }
      } else {
        callback(null);
      }
    });
  }
};