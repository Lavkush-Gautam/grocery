import React, { useEffect } from 'react';
import { assets, categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import gsap from 'gsap';

const Categories = () => {
  const { navigate } = useAppContext();

  useEffect(() => {
    gsap.fromTo(
      '.category-card',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );
  }, []);

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
        {categories.map((category, idx) => (
          <div
            key={idx}
            className='category-card group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              className='group-hover:scale-108 transition max-w-28'
              alt={category.text}
            />
            <p className='text-sm font-medium'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
