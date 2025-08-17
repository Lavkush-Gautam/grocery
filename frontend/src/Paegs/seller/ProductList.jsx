import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import gsap from 'gsap';

const ProductList = () => {
    const { products, currency, axios } = useAppContext();

    const toggleProduct = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/stock', { id, inStock });
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (products?.length) {
            gsap.fromTo(
                '.product-row',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power2.out'
                }
            );
        }
    }, [products]);

    return (
        <div className="flex-1 py-10 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>

                {/* Table for md+ screens */}
                <div className="hidden md:block">
                    <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                        <table className="w-full">
                            <thead className="text-gray-900 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold truncate">Product</th>
                                    <th className="px-4 py-3 font-semibold truncate">Category</th>
                                    <th className="px-4 py-3 font-semibold truncate">Selling Price</th>
                                    <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-500">
                                {products?.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="product-row border-t border-gray-500/20"
                                    >
                                        <td className="px-4 py-3 flex items-center space-x-3 truncate">
                                            <div className="border border-gray-300 rounded p-2">
                                                <img src={product.image[0]} alt="Product" className="w-16" />
                                            </div>
                                            <span className="truncate w-full">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3">
                                            {currency}{product.offerPrice}
                                        </td>
                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                <input
                                                    onClick={() => toggleProduct(product._id, !product.inStock)}
                                                    checked={product.inStock}
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Card layout for small screens */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {products?.map((product) => (
                        <div
                            key={product._id}
                            className="product-row bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-4"
                        >
                            <img src={product.image[0]} alt="Product" className="w-20 h-20 object-cover rounded border" />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.category}</p>
                                <p className="font-semibold mt-1">{currency}{product.offerPrice}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    onClick={() => toggleProduct(product._id, !product.inStock)}
                                    checked={product.inStock}
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
