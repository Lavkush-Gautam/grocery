import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(true);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');


    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth', {
                withCredentials: true, // ✅ ensure cookie is sent
            });
            setIsSeller(data.success === true); // ✅ fix logic
        } catch (error) {
            console.error('Error fetching seller authentication:', error);
            setIsSeller(false);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth', {
                withCredentials: true, // ✅ to ensure cookie is included
            });
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            }
        } catch (error) {
            console.error("Error fetching user authentication:", error);
            setUser(null);
        }
    };

    useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user/me', {
        method: 'GET',
        credentials: 'include', // important for cookies
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  checkAuth();
}, []);


    const fetchProduct = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch products');
        }
    };

    const AddTocart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Added to Cart');
    };

    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success('Cart updated');
    };

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success('Removed from Cart');
    };

    const updateCart = async () => {
        try {
            const { data } = await axios.post('/api/cart/update', { cartItems });
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cart');
        }
    };

    const getCartCount = () => {
        let count = 0;
        for (let item in cartItems) {
            count += cartItems[item];
        }
        return count;
    };

    const getCartTotal = () => {
        let total = 0;
        for (let item in cartItems) {
            let itemInfo = products.find((product) => product._id === item);
            if (itemInfo && cartItems[item] > 0) {
                total += itemInfo.offerPrice * cartItems[item];
            }
        }
        return Math.floor(total * 100) / 100;
    };

    useEffect(() => {
        fetchSeller();
        fetchProduct();
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            updateCart();
        }
    }, [cartItems]);

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        cartItems,
        AddTocart,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartTotal,
        axios,
        fetchProduct,
        setCartItems,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
