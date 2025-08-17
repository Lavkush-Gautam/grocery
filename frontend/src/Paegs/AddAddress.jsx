import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// InputField.jsx
const InputField = ({ type, placeholder, name, handleChanege, address }) => (
    <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChanege}
        value={address[name] || ''}
        className="w-full px-2 py-2.5 border ... focus:border-primary"
    />
);

// AddAddress.jsx
const AddAddress = () => {
    const { axios, navigate, user } = useAppContext();

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const handleChanege = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };
m
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/address/add', { address });
            toast[data.success ? 'success' : 'error'](data.message);
            if (data.success) navigate('/cart');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (!user) navigate('/cart');
    }, [user, navigate]);

    return (
        <div className="mt-16 pb-16">
            <p className="text-2xl md:text-3xl text-gray-500">
                Add shipping <span className="font-semibold text-primary">Address</span>
            </p>

            <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
                <form onSubmit={onSubmitHandler} className="flex-1 max-w-md space-y-3 mt-6 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="firstName" type="text" placeholder="First Name" handleChanege={handleChanege} address={address} />
                        <InputField name="lastName" type="text" placeholder="Last Name" handleChanege={handleChanege} address={address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="email" type="email" placeholder="Email" handleChanege={handleChanege} address={address} />
                        <InputField name="street" type="text" placeholder="Street" handleChanege={handleChanege} address={address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="city" type="text" placeholder="City" handleChanege={handleChanege} address={address} />
                        <InputField name="state" type="text" placeholder="State" handleChanege={handleChanege} address={address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="zipcode" type="text" placeholder="Pin Code" handleChanege={handleChanege} address={address} />
                        <InputField name="country" type="text" placeholder="Country" handleChanege={handleChanege} address={address} />
                    </div>

                    <InputField name="phone" type="text" placeholder="Phone" handleChanege={handleChanege} address={address} />

                    <button type="submit" className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull uppercase">
                        Save Address
                    </button>
                </form>
                <img src={assets.add_address_iamge} alt="address" className="md:mr-16 mb-16" />
            </div>
        </div>
    );
};

export default AddAddress;
