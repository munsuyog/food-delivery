import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { getRestaurantDetails, storeRestaurantDetails } from "../../../api/restaurants";
import { useToast } from "../../ui/use-toast";
import MapContainer from "../../common/Map/Map";

const DetailsForm = () => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null); // State for storing the restaurant location
  const { currentUser } = useAuth();
  const form = useForm({ defaultValues: restaurantDetails });
  const { toast } = useToast();
  console.log(restaurantLocation)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRestaurantDetails((prevState) => ({
        ...prevState,
        restaurantPic: file,
        profilePictureURL: URL.createObjectURL(file),
      }));
    }
  };

  const successMessage = () => {
    toast({
      title: "Success",
      description: "Restaurant details updated successfully...",
    });
  };

  useEffect(() => {
    const fetchRestaurantDetails = async (uid) => {
      try {
        const details = await getRestaurantDetails(uid);
        if (details) {
          setRestaurantDetails(details);
          form.reset(details); // Update form default values with fetched details
          setRestaurantLocation(details.location); // Set the restaurant location
        } else {
          console.log("No details found for the provided UID.");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error.message);
      }
    };

    if (currentUser) {
      fetchRestaurantDetails(currentUser.uid);
    }
  }, [currentUser, form]);

  const onSubmit = async (data) => {
    try {
      if (restaurantLocation) {
        await storeRestaurantDetails({ ...restaurantDetails, location: restaurantLocation }, currentUser.uid);
        successMessage();
      } else {
        console.error("Restaurant location is not defined.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleLocationChange = (location) => {
    setRestaurantLocation(location); // Update the restaurant location when the user selects a new location on the map
  };

  if (!restaurantDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {restaurantDetails.restaurantPic != "" && <img src={restaurantDetails.restaurantPic} alt="" className="h-[300px] object-cover w-full" />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="restaurantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Restaurant Name"
                    {...field}
                    onChange={(e) => setRestaurantDetails((prev) => ({ ...prev, restaurantName: e.target.value }))}
                    value={restaurantDetails.restaurantName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  disabled={true}
                  onChange={handleChange}
                  value={restaurantDetails.email}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Address"
                  {...field}
                  onChange={handleChange}
                  value={restaurantDetails.address}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="City"
                  {...field}
                  onChange={handleChange}
                  value={restaurantDetails.city}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Phone Number"
                  {...field}
                  onChange={handleChange}
                  value={restaurantDetails.phoneNumber}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="restaurantPic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          {/* Other form fields */}
          <MapContainer // Add the Map component
            location={restaurantLocation} // Pass the restaurant location to the map component
            onLocationChange={handleLocationChange} // Handle location change event
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default DetailsForm;
