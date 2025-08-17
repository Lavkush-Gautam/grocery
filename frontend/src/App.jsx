import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Paegs/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './Paegs/AllProducts'
import ProductCategory from './Paegs/ProductCategory'
import ProductDetail from './Paegs/ProductDetail'
import Cart from './Paegs/Cart'
import AddAddress from './Paegs/AddAddress'
import MyOrders from './Paegs/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import Layout from './Paegs/seller/Layout'
import AddProduct from './Paegs/seller/AddProduct'
import ProductList from './Paegs/seller/ProductList'
import Orders from './Paegs/seller/Orders'
import Contacts from './Paegs/Contacts'


const App = () => {
  const isSellerPath = useLocation().pathname.includes('seller')
  const { showUserLogin, isSeller } = useAppContext()
  
  return (

    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />
      <div className={`${isSellerPath ? " " : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/contacts' element={<Contacts/>} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/seller' element={isSeller ? <Layout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path='product-list' element={isSeller ? <ProductList /> : null} />
            <Route path='orders' element={isSeller ? <Orders /> : null} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App