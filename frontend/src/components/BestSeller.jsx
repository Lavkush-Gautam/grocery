import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => product.inStock).slice(0, 5);
  }, [products]);

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Seller</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {filteredProducts.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
