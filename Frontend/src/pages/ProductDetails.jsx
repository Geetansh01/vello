import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import Toast from '../components/Toast';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    axios.get('/src/data/products.json').then(res => {
      const found = res.data.find(p => p.slug === slug);
      if (found) {
        setProduct(found);
        // Related: same disease_category, exclude self, max 5
        const relatedProducts = res.data
          .filter(p => p.disease_category === found.disease_category && p.slug !== slug)
          .slice(0, 5);
        setRelated(relatedProducts);
      } else {
        navigate('/404'); // Product not found
      }
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load product data", err);
      setLoading(false);
    });
  }, [slug, navigate]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setToast({ message: `${product.name} added to cart!`, type: 'success' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-1/2 h-8" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-1/4 h-10" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">Product Not Found</h1>
        <p className="mt-4">The product you are looking for does not exist.</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-teal-500 text-white font-bold py-2 px-4 rounded">Go Home</button>
      </div>
    );
  }
  
  const discountedPrice = product.mrp - (product.mrp * product.discount / 100);

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-2xl" />
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <span className="text-teal-400 font-semibold">{product.company}</span>
            <h1 className="text-4xl font-extrabold my-2">{product.name}</h1>
            <p className="text-gray-400 text-lg mb-4">{product.disease_category}</p>

            <div className="my-4">
              <span className="text-4xl font-bold text-teal-400">₹{discountedPrice.toFixed(2)}</span>
              <span className="text-xl text-gray-500 line-through ml-3">₹{product.mrp.toFixed(2)}</span>
              <span className="text-lg text-green-400 font-semibold ml-3">{product.discount}% OFF</span>
            </div>

            <p className="leading-relaxed my-6">{product.description}</p>
            
            <div className="flex items-center space-x-4 my-6">
              <div className="flex items-center border border-gray-600 rounded">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl">-</button>
                <input type="number" value={qty} readOnly className="w-16 text-center bg-transparent focus:outline-none text-xl font-bold" />
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-xl">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
            
            <p className={product.available_stock > 0 ? 'text-green-400' : 'text-red-500'}>
              {product.available_stock > 0 ? `${product.available_stock} in stock` : 'Out of Stock'}
            </p>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {related.map(p => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
