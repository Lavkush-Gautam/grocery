
import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [files, setFiles] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [offerPrice, setOfferPrice] = useState('')

    const { axios } = useAppContext()


    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice,
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            const { data } = await axios.post('/api/product/add', formData);

            if (data.success) {
                toast.success(data.message);
                setName('');
                setCategory('');
                setDescription('');
                setFiles([]);
                setOfferPrice('');
                setPrice('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    };



    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between ">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-3 space-y-3 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className='cursor-pointer'>
                                <input onChange={(e) => {
                                    const updatedFile = [...files]
                                    updatedFile[index] = e.target.files[0]
                                    setFiles(updatedFile)
                                }} accept="image/*" type="file" id={`image${index}`} hidden />

                                <img src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="img" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        {categories.map((item, idx) => (
                            <option key={idx} value={item.path}>
                                {item.path}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-24">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e) => setPrice(e.target.value)} value={price} id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>

                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice} id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>
                <button className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer">ADD</button>
            </form>
        </div>
    );
};

export default AddProduct