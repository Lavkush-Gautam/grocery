import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useAppContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/order/user'); // Adjust path as needed
        setMyOrders(response.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-16 pb-16">
      {/* Heading */}
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full" />
      </div>

      {myOrders.length === 0 && <p>No orders found.</p>}

      {myOrders.map((order) => (
        <div key={order._id} className="border border-gray-300 rounded-lg mb-10 p-4 p-y-5 max-w-4xl">
          <p className="flex justify-between text-gray-400 md:font-medium max-md:flex-col">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>
          {/* Order Items */}
          {order.items.map((item) => (
            <div key={item.product._id} className="relative bg-white text-gray-500/70 border-b border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
                  <p>{item.product.category}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity || 1}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-primary text-lg font-medium">
                Amount: {currency}{item.product.offerPrice * (item.quantity || 1)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
