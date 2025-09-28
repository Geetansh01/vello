import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartLocal, debouncedSyncCart, selectCartSyncing } from '../store/slices/cartSlice';
import { useState, memo } from 'react';
import LazyImage from './LazyImage';

const ProductCard = memo(function ProductCard({ product }) {
  const dispatch = useDispatch();
  const syncing = useSelector(selectCartSyncing);
  const [isAdding, setIsAdding] = useState(false);
  const discountedPrice = product.discounted_price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.available_stock <= 0) return;
    
    setIsAdding(true);
    try {
      // Add to local state immediately for instant UI update
      dispatch(addToCartLocal({ product, qty: 1 }));
      // Debounce server sync
      dispatch(debouncedSyncCart());
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 500); // Small delay for better UX
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100"
    >
      <Link to={`/product/${product.slug}`} className="block flex-grow" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <LazyImage 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-32 md:h-48 object-cover" 
          />
          {product.trending && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 Trending
            </span>
          )}
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div className="p-3 md:p-4 flex-grow">
          <p className="text-xs md:text-sm text-gray-500 font-medium">{product.company}</p>
          <h3 className="text-sm md:text-base font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-lg md:text-xl font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</p>
              {product.discount > 0 && (
                <p className="text-xs md:text-sm text-gray-500 line-through">₹{product.mrp.toFixed(2)}</p>
              )}
            </div>
            <p className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.available_stock > 0 
                ? 'text-green-700 bg-green-100' 
                : 'text-red-700 bg-red-100'
            }`}>
              {product.available_stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="p-3 md:p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.available_stock <= 0 || isAdding || syncing}
          className={`w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            product.available_stock > 0
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdding || syncing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {syncing ? 'Syncing...' : 'Adding...'}
            </div>
          ) : product.available_stock > 0 ? (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </div>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </motion.div>
  );
});

export default ProductCard;