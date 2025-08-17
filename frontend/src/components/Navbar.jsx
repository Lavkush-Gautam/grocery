import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';
const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, getCartTotal, axios } = useAppContext()

    const logout = async () => {
        try {
            const { data } = await axios.post('/api/user/logout', {
                withCredentials: true, // Include credentials (cookies)
            });

            if (data.success) {
                toast.success(data.message);
                setUser(null);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };


    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products')
        }
    }, [searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-10">
            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">

                <NavLink to='/' className='block'>Home</NavLink>
                <NavLink to='/products' className='block'>All Products</NavLink>

                {user && <NavLink to='/my-orders' className='block'>My Orders</NavLink>}
                <NavLink to='/contacts' className='block'>Contacts</NavLink>
                {/* Search Bar */}
                <div className="relative">
                    <input onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                        style={{ display: searchOpen ? 'block' : 'none' }}
                    />
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <img src={assets.search_icon} alt="search" className='w-4 h-4 opacity-80' />
                    </button>
                </div>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Login
                </button>) : (

                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt="profile" />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => navigate('/my-orders')} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                            <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>


            <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <img src={assets.menu_icon} alt="menu" />
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to='/' onClick={() => setOpen(false)}>Home</NavLink>
                <NavLink to='/products' onClick={() => setOpen(false)}>All Product</NavLink>

                {user && <NavLink to='/orders' onClick={() => setOpen(false)}>My Orders</NavLink>
                }
                <NavLink to='/contacts' onClick={() => setOpen(false)}>Contact</NavLink>

                {/* Mobile Search Bar */}
                <div className="relative w-full">
                    <input
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                        style={{ display: searchOpen ? 'block' : 'none' }}
                    />
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="absolute top-0 right-0 px-3 py-2"
                    >
                        <img src={assets.search_icon} alt="search" className='w-4 h-4 opacity-80' />
                    </button>
                </div>
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer sm:hidden">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Login
                </button>) : (

                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt="profile" />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => navigate('/my-orders')} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                            <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
