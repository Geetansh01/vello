import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const discountedPrice = product.mrp - (product.mrp * product.discount / 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative">
          <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
          {product.trending && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded">
              Trending
            </span>
          )}
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <p className="text-sm text-gray-400">{product.company}</p>
          <h3 className="text-lg font-bold text-white mt-1 flex-grow">{product.name}</h3>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-teal-400">₹{discountedPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500 line-through">₹{product.mrp.toFixed(2)}</p>
            </div>
            <p className={`text-sm font-semibold ${product.available_stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.available_stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
