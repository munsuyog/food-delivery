import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { query, collection, getDocs, doc, setDoc, where, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from '../../api/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userType = await determineUserType(user.email);
        setUserType(userType);
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const determineUserType = async (email) => {
    const checkEmailInCollection = async (collectionName) => {
      const q = query(collection(db, collectionName), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    };

    if (await checkEmailInCollection("restaurants")) {
      return "restaurant";
    }
    if (await checkEmailInCollection("drivers")) {
      return "driver";
    }
    if (await checkEmailInCollection("customers")) {
      return "customer";
    }
    return null;
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const loginAsCustomer = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const checkEmailInCollection = async (collectionName) => {
        const q = query(collection(db, collectionName), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
      };

      const emailExistsInRestaurants = await checkEmailInCollection("restaurants");
      const emailExistsInDrivers = await checkEmailInCollection("drivers");

      if (emailExistsInRestaurants) {
        throw new Error("This email is already registered as a restaurant.");
      }

      if (emailExistsInDrivers) {
        throw new Error("This email is already registered as a driver.");
      }

      const customerDocRef = doc(db, "customers", user.uid);
      const customerDoc = await getDoc(customerDocRef);

      if (!customerDoc.exists()) {
        await setDoc(customerDocRef, {
          name: user.displayName,
          email: user.email,
          address: "",
          phoneNumber: "",
          profilePictureURL: user.photoURL,
          orderHistory: []
        });
      }

      setCurrentUser(user);
      setUserType("customer");
      console.log("Customer logged in successfully");
    } catch (error) {
      console.error("Error logging in as customer: ", error.message);
    }
  };

  const loginAsDriver = async (setCurrentUser) => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const checkEmailInCollection = async (collectionName) => {
            const q = query(collection(db, collectionName), where("email", "==", user.email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        };

        const emailExistsInRestaurants = await checkEmailInCollection("restaurants");
        const emailExistsInCustomers = await checkEmailInCollection("customers");

        if (emailExistsInRestaurants) {
            throw new Error("This email is already registered as a restaurant.");
        }

        if (emailExistsInCustomers) {
            throw new Error("This email is already registered as a customer.");
        }

        const driverDocRef = doc(db, "drivers", user.uid);
        const driverDoc = await getDoc(driverDocRef);

        if (!driverDoc.exists()) {
            await setDoc(driverDocRef, {
                name: user.displayName,
                email: user.email,
                phoneNumber: "",
                profilePictureURL: user.photoURL,
                vehicle: "", // Add additional driver-specific fields if needed
            });
        }

        setCurrentUser(user);
        setUserType("driver");
        console.log("Driver logged in successfully");
    } catch (error) {
        console.error("Error logging in as driver: ", error.message);
    }
};

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    currentUser,
    userType,
    signInWithGoogle,
    loginAsCustomer,
    loginAsDriver,
    logOut,
    setCurrentUser,
    setUserType
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
