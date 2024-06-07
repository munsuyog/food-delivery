import { signInWithPopup } from "firebase/auth";
import { query, collection, getDocs, doc, setDoc, where, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export const loginAsCustomer = async (setCurrentUser, setUserType) => {
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

export const loginAsRestaurant = async (setCurrentUser, setUserType) => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const checkEmailInCollection = async (collectionName) => {
            const q = query(collection(db, collectionName), where("email", "==", user.email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        };

        const emailExistsInCustomers = await checkEmailInCollection("customers");
        const emailExistsInDrivers = await checkEmailInCollection("drivers");

        if (emailExistsInCustomers) {
            throw new Error("This email is already registered as a customer.");
        }

        if (emailExistsInDrivers) {
            throw new Error("This email is already registered as a driver.");
        }

        const restaurantDocRef = doc(db, "restaurants", user.uid);
        const restaurantDoc = await getDoc(restaurantDocRef);

        if (!restaurantDoc.exists()) {
            await setDoc(restaurantDocRef, {
                userName: user.displayName,
                email: user.email,
                address: "",
                phoneNumber: "",
                profilePictureURL: user.photoURL,
                menu: [],
                restaurantName: "",
                restaurantPic: ""
            });
        }

        setCurrentUser(user);
        setUserType("restaurant");
        console.log("Restaurant logged in successfully");
    } catch (error) {
        console.error("Error logging in as restaurant: ", error.message);
    }
};
