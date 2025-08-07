import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useUser();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const linkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClasses = "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";

  const mobileLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium";
  const mobileActiveLinkClasses = "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium";

  const links = (
    <>
      <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>Home</NavLink>
      {user && <NavLink to="/profile" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>Profile</NavLink>}
      {user && <NavLink to="/orders" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>Orders</NavLink>}
    </>
  );

  const mobileLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileLinkClasses}>Home</NavLink>
      {user && <NavLink to="/profile" className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileLinkClasses}>Profile</NavLink>}
      {user && <NavLink to="/orders" className={({ isActive }) => isActive ? mobileActiveLinkClasses : mobileLinkClasses}>Orders</NavLink>}
    </>
  )

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-bold text-2xl">
              Vello<span className="text-teal-400">.</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <button onClick={handleLogout} className={linkClasses}>Logout</button>
            ) : (
              <Link to="/login" className={linkClasses}>Login</Link>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {mobileLinks}
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-2">
                   <Link to="/cart" className="w-full relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700 flex justify-between items-center">
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {user ? (
                    <button onClick={handleLogout} className={`${mobileLinkClasses} w-full text-left`}>Logout</button>
                  ) : (
                    <Link to="/login" className={mobileLinkClasses}>Login</Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
