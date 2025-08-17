import React, { useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import gsap from "gsap";

const ProductCard = ({ product }) => {
    const cardRef = useRef(null);

    const { currency, AddTocart, updateCartItem, removeFromCart, navigate, cartItems } = useAppContext();

    useEffect(() => {
        // Animate card on mount
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }
        );
    }, []);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            scale: 1.03,
            duration: 0.2,
            ease: "power1.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power1.out"
        });
    };

    return product && (
        <div
            ref={cardRef}
            onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`) }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-50 max-w-50 w-full cursor-pointer"
        >
            <div className="group flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill("").map((_, i) => (
                        <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-3.5 w-3" />
                    ))}
                    <p>(4)</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                            {currency}{product.price}
                        </span>
                    </p>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-primary font-medium"
                                onClick={() => AddTocart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart-icon" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => { removeFromCart(product._id) }} className="cursor-pointer text-md px-2 h-full">-</button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => { AddTocart(product._id) }} className="cursor-pointer text-md px-2 h-full">+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
