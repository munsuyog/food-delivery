import React from 'react'
import { OrderProvider } from '../components/contexts/OrderContext'
import PlaceOrderForm from '../components/order/PlaceOrder'
import { AuthProvider } from '../components/contexts/AuthContext'

const PlaceOrder = () => {
  return (
    <AuthProvider>
      <div className='p-4'>
      <PlaceOrderForm />

      </div>
    </AuthProvider>
  )
}

export default PlaceOrder