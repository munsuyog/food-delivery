import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";

// Function to upload restaurant image to Firebase Storage
const uploadRestaurantImageToStorage = async (file) => {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `restaurant_images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef); // Corrected usage
        return downloadURL;
    } catch (error) {
        console.error("Error uploading restaurant image to storage: ", error.message);
        throw error;
    }
};

// Function to store or update restaurant details in Firestore
export const storeRestaurantDetails = async (restaurantDetails, uid) => {
    try {
        console.log(restaurantDetails)
        const imageUpload = await uploadRestaurantImageToStorage(restaurantDetails.restaurantPic);
        restaurantDetails.restaurantPic = imageUpload;

        const restaurantRef = doc(db, 'restaurants', uid);
        const restaurantDoc = await getDoc(restaurantRef);

        if (restaurantDoc.exists()) {
            // If the document already exists, update it
            await updateDoc(restaurantRef, restaurantDetails);
            console.log('Restaurant details updated successfully');
        } else {
            // If the document doesn't exist, create a new one
            await setDoc(restaurantRef, restaurantDetails);
            console.log('Restaurant details stored successfully');
        }
    } catch (error) {
        console.error('Error storing/updating restaurant details: ', error.message);
        throw error;
    }
};

// Function to get restaurant details from Firestore using uid
export const getRestaurantDetails = async (uid) => {
    try {
        const restaurantRef = doc(db, 'restaurants', uid);
        const restaurantDoc = await getDoc(restaurantRef);

        if (restaurantDoc.exists()) {
            console.log('Restaurant details retrieved successfully');
            return restaurantDoc.data();
        } else {
            console.log('No such document exists!');
            return null;
        }
    } catch (error) {
        console.error('Error getting restaurant details: ', error.message);
        throw error;
    }
};
