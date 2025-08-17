import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const Contacts = () => {
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const tl = gsap.timeline();

    // Heading animation
    tl.from(headingRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // Form fields animation
    tl.from(formRef.current.children, {
      y: 20,
      opacity: 0, // ensure visibility
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out",
    }, "-=0.4");

    // Extra info animation
    tl.from(infoRef.current.children, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "power3.out",
    }, "-=0.3");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent!\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="mt-16 flex flex-col items-center px-4 md:px-10 lg:px-20">
      {/* Heading */}
      <div className="flex flex-col items-start">
        <h1
          ref={headingRef}
          className="text-2xl md:text-3xl font-medium uppercase"
        >
          Contact Us
        </h1>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-1"></div>
      </div>

      {/* Contact Info */}
      <p className="mt-4 text-gray-600 max-w-lg text-center md:text-left">
        Have questions, feedback, or need help? Fill out the form below or
        reach us directly via phone or email. We’ll get back to you as soon as
        possible!
      </p>

      {/* Contact Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          required
        />
        <textarea
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary resize-none"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-dull transition"
        >
          Send Message
        </button>
      </form>

      {/* Extra Info */}
      <div ref={infoRef} className="mt-8 text-center md:text-left">
        <p className="font-medium">📍 Address:</p>
        <p className="text-gray-600">123 Fresh Street, Green City, 45678</p>

        <p className="font-medium mt-3">📞 Phone:</p>
        <p className="text-gray-600">+91 98765 43210</p>

        <p className="font-medium mt-3">📧 Email:</p>
        <p className="text-gray-600">support@freshmart.com</p>
      </div>
    </div>
  );
};

export default Contacts;
