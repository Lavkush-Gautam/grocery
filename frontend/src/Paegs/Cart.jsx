import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import gsap from 'gsap';

const Cart = () => {
  const {
    navigate,
    products = [],
    currency,
    cartItems = {},
    updateCartItem,
    removeFromCart,
    getCartTotal,
    getCartCount,
    axios,
    user,
    setCartItems,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAdd, setSelectedAdd] = useState(null);
  const [paymentOption, setPaymentOption] = useState('COD');

  const getCart = () => {
    let tempArr = [];
    for (let key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArr.push({ ...product, quantity: cartItems[key] });
      }
    }
    setCartArray(tempArr);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAdd(data.addresses[0]);
        } else {
          toast.error('No addresses found');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch addresses');
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAdd) {
        return toast.error('Please select an address');
      }

      if (paymentOption === 'COD') {
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAdd._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate('/my-orders');
        } else {
          toast.error(data.message);
        }
      } else {
        toast('Online payment not implemented yet');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  useEffect(() => {
    if (products?.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  // ANIMATION EFFECT
  useEffect(() => {
    if (cartArray.length) {
      gsap.fromTo(
        '.cart-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.summary-panel',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [cartArray]);

  if (!products?.length || !Object.keys(cartItems || {}).length) return null;

  return (
    <div className="flex flex-col md:flex-row mt-16">
      {/* Left side: Cart List */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{' '}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="cart-item grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: <span>{product.weight || 'N/A'}</span></p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                      className="outline-none"
                      value={cartItems[product._id]}
                    >
                      {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9)
                        .fill('')
                        .map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate('/products');
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* Right side: Summary */}
      <div className="summary-panel max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAdd
                ? `${selectedAdd.street}, ${selectedAdd.city}, ${selectedAdd.state}, ${selectedAdd.country}`
                : 'No address found'}
            </p>

            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>

            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {address.map((add, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAdd(add);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {add.street}, {add.city}, {add.state}, {add.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate('/add-address')}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{getCartTotal().toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{(getCartTotal() * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{currency}{(getCartTotal() * 1.02).toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-primary text-white font-medium hover:bg-primary-dull transition"
        >
          {paymentOption === 'COD' ? 'Place Order' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
