import { signInWithPopup } from "firebase/auth";
import { query, collection, getDocs, doc, setDoc, where, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export const loginAsDriver = async (setCurrentUser) => {
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
        console.log("Driver logged in successfully");
    } catch (error) {
        console.error("Error logging in as driver: ", error.message);
    }
};
