import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../ui/form';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '../../ui/table';
import { useForm } from 'react-hook-form';
import { db } from '../../../api/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const ManageMenu = () => { // Pass uid as prop
  const [menuItems, setMenuItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const form = useForm();
  const {currentUser} = useAuth();

  useEffect(() => {
    // Fetch menu items from Firestore
    const fetchMenuItems = async () => {
      const restaurantRef = doc(db, 'restaurants', currentUser.uid);
      const restaurantDoc = await getDoc(restaurantRef);

      if (restaurantDoc.exists()) {
        const restaurantData = restaurantDoc.data();
        if (restaurantData.menu) {
          setMenuItems(restaurantData.menu);
        } else {
          setMenuItems([]);
        }
      } else {
        console.log('Restaurant document does not exist!');
      }
    };

    fetchMenuItems();
  }, [currentUser.uid]);

  const onSubmit = async (data) => {
    const updatedMenuItems = [...menuItems];
    if (selectedItem) {
      // Update existing item
      const index = updatedMenuItems.findIndex(item => item.id === selectedItem.id);
      if (index !== -1) {
        updatedMenuItems[index] = { ...data, id: selectedItem.id };
      }
    } else {
      // Add new item
      updatedMenuItems.push({ ...data, id: Date.now().toString() });
    }

    // Update Firestore with the updated menu items
    try {
      const restaurantRef = doc(db, 'restaurants', currentUser.uid);
      await updateDoc(restaurantRef, { menu: updatedMenuItems });
      setMenuItems(updatedMenuItems);
      setDialogOpen(false);
      form.reset();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating menu items:', error.message);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    form.reset(item);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updatedMenuItems = menuItems.filter(item => item.id !== id);

    // Update Firestore with the updated menu items
    try {
      const restaurantRef = doc(db, 'restaurants', currentUser.uid);
      updateDoc(restaurantRef, { menu: updatedMenuItems });
      setMenuItems(updatedMenuItems);
    } catch (error) {
      console.error('Error deleting menu item:', error.message);
    }
  };

  return (
    <div className='p-5'>
      <h4 className='text-lg font-semibold'>Manage Menu</h4>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogOpen(true)} className='mb-4'>
            Add Menu Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogDescription>
            {selectedItem ? 'Update the menu item details below.' : 'Fill in the details to add a new menu item.'}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Item Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder='Category' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='Price' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>{selectedItem ? 'Update' : 'Add'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(item)} className='mr-2'>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(item.id)} variant='destructive'>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ManageMenu;
