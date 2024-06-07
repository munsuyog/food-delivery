import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import RestaurantOrders from '../Orders/Orders'
import ManageRestaurant from '../ManageRestaurant/ManageRestaurant'
import ManageMenu from '../ManageMenu/ManageMenu'

const RestaurantsTab = () => {
  return (
    <Tabs defaultValue='orders' className="p-5">
        <TabsList className="">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="manage">Manage Restaurant</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
            <RestaurantOrders />
        </TabsContent>
        <TabsContent value="manage">
            <ManageRestaurant />
        </TabsContent>
        <TabsContent value="menu">
            <ManageMenu />
        </TabsContent>
    </Tabs>
  )
}

export default RestaurantsTab