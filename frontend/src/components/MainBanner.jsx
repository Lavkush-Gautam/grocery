import React, { useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const MainBanner = () => {
    const headingRef = useRef(null);
    const btnsRef = useRef(null);
    const imgDesktopRef = useRef(null);
    const imgMobileRef = useRef(null);

    useEffect(() => {
        // Animate only the visible image
        const desktopImg = imgDesktopRef.current;
        const mobileImg = imgMobileRef.current;

        gsap.fromTo(
            window.innerWidth >= 768 ? desktopImg : mobileImg,
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
        );

        gsap.from(headingRef.current, {
            y: 40,
            opacity: 0,
            delay: 0.2,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from(btnsRef.current.children, {
            y: 30,
            opacity: 0,
            delay: 0.6,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }, []);

    return (
        <div className='relative overflow-hidden z-0'>
            <img 
                ref={imgDesktopRef}
                src={assets.main_banner_bg} 
                alt="banner" 
                className='w-full hidden md:block' 
            />
            <img 
                ref={imgMobileRef}
                src={assets.main_banner_bg_sm} 
                alt="banner" 
                className='w-full md:hidden' 
            />

            <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
                <h1 
                    ref={headingRef}
                    className='text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left max-w-72 md:max-w-105 leading-tight lg:leading-14'
                >
                    Freshness You can Trust, Savings you will Love!
                </h1>

                <div ref={btnsRef} className='flex items-center mt-6 font-medium gap-4'>
                    <Link 
                        to={'/products'} 
                        className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'
                    >
                        Shop Now
                        <img 
                            className='transition group-hover:translate-x-1' 
                            src={assets.white_arrow_icon} 
                            alt="arrow" 
                        />
                    </Link>

                    <Link 
                        to={'/products'} 
                        className='group hidden md:flex items-center gap-2 px-7 md:px-9 py-3 border border-black rounded cursor-pointer hover:bg-gray-100'
                    >
                        Explore Deals
                        <img 
                            className='transition group-hover:translate-x-1' 
                            src={assets.black_arrow_icon} 
                            alt="arrow" 
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MainBanner;
