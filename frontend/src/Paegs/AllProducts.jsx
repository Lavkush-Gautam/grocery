import React, { useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import gsap from 'gsap';

const AllProducts = () => {
  const { products = [], searchQuery = '' } = useAppContext();

  const filteredProducts = useMemo(() => {
    return (products || []).filter(product =>
      product.inStock &&
      (!searchQuery.trim() ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  useEffect(() => {
    if (filteredProducts.length) {
      gsap.fromTo(
        '.product-card',
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
  }, [filteredProducts]);

  return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All Products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className='mt-6 text-center text-gray-500'>
          No products match your search.
        </p>
      ) : (
        <div
          className='
            grid grid-cols-1
            xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
            gap-3 md:gap-6 mt-6
          '
        >
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
