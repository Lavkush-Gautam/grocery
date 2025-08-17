import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import gsap from 'gsap'

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const formRef = useRef(null)

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const { data } = await axios.post('/api/seller/login', { email, password })
      console.log(data)
      if (data.success) {
        setIsSeller(true)
        navigate('/')
      } else {
        toast.error(data.message || 'Invalid credentials')
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    if (isSeller) {
      navigate('/seller')
    }
  }, [isSeller, navigate])

  // 🔥 Animate login form when it mounts
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out'
        }
      )
    }
  }, [])

  return (
    !isSeller && (
      <form
        ref={formRef}
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center text-sm text-gray-600"
      >
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 bg-white">
          <p className="text-3xl font-medium m-auto">
            <span className="text-primary">Seller</span> Login
          </p>
          <div className="w-full">
            <p>Email:</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>

          <div className="w-full">
            <p>Password:</p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>

          <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">
            Login
          </button>
        </div>
      </form>
    )
  )
}

export default SellerLogin
