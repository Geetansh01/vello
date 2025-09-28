import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProductBySlug, 
  fetchRelatedProducts, 
  selectCurrentProduct, 
  selectRelatedProducts, 
  selectProductLoading,
  clearCurrentProduct 
} from '../store/slices/productsSlice';
import { addToCartLocal, debouncedSyncCart } from '../store/slices/cartSlice';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import Toast from '../components/Toast';
import LazyImage from '../components/LazyImage';

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const relatedProducts = useSelector(selectRelatedProducts);
  const loading = useSelector(selectProductLoading);
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    // If no slug is provided, redirect to products page
    if (!slug) {
      navigate('/products');
      return;
    }
    
    window.scrollTo(0, 0);
    
    // Clear previous product data
    dispatch(clearCurrentProduct());
    
    // Fetch product and related products
    dispatch(fetchProductBySlug(slug)).then((result) => {
      if (result.type === 'products/fetchProductBySlug/rejected') {
        navigate('/products');
      } else {
        dispatch(fetchRelatedProducts(slug));
      }
    });
  }, [slug, dispatch, navigate]);
  
  const handleAddToCart = async () => {
    if (product && product.available_stock > 0) {
      try {
        dispatch(addToCartLocal({ product, qty }));
        dispatch(debouncedSyncCart());
        setToast({ message: `${product.name} added to cart!`, type: 'success' });
      } catch (error) {
        setToast({ message: error.message || 'Failed to add to cart', type: 'error' });
      }
    } else {
      setToast({ message: 'Product is out of stock', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
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
  
  const discountedPrice = product.discounted_price;

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
          {/* Product Images */}
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="relative">
              <LazyImage 
                src={product.images[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-96 object-cover rounded-lg shadow-2xl" 
              />
              {product.trending && (
                <span className="absolute top-4 left-4 bg-yellow-500 text-gray-900 text-sm font-bold px-3 py-1 rounded-full">
                  Trending
                </span>
              )}
              {product.discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      activeImageIndex === index ? 'border-teal-500' : 'border-gray-600'
                    }`}
                  >
                    <LazyImage src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <span className="text-teal-400 font-semibold">{product.company}</span>
            <h1 className="text-4xl font-extrabold my-2">{product.name}</h1>
            <p className="text-gray-400 text-lg mb-4">{product.disease_category}</p>

            <div className="my-4">
              <span className="text-4xl font-bold text-teal-400">₹{discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through ml-3">₹{product.mrp.toFixed(2)}</span>
                  <span className="text-lg text-green-400 font-semibold ml-3">{product.discount}% OFF</span>
                </>
              )}
            </div>

            <p className="leading-relaxed my-6">{product.description}</p>
            
            {/* Stock and Expiry Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${product.available_stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm text-gray-600">Stock Status</p>
                      <p className={`font-semibold ${product.available_stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.available_stock > 0 ? `${product.available_stock} Available` : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${product.returnable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm text-gray-600">Return Policy</p>
                      <p className={`font-semibold ${product.returnable ? 'text-green-600' : 'text-red-600'}`}>
                        {product.returnable ? 'Returnable' : 'Non-Returnable'}
                      </p>
                    </div>
                  </div>
                </div>
                {product.expiry_date && (
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <div>
                        <p className="text-sm text-gray-600">Expiry Date</p>
                        <p className="font-semibold text-orange-600">{formatDate(product.expiry_date)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            {product.available_stock > 0 && (
              <div className="flex items-center space-x-4 my-6">
                <div className="flex items-center border border-gray-600 rounded">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl">-</button>
                  <input 
                    type="number" 
                    value={qty} 
                    onChange={(e) => setQty(Math.max(1, Math.min(product.available_stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center bg-transparent focus:outline-none text-xl font-bold" 
                  />
                  <button onClick={() => setQty(q => Math.min(product.available_stock, q + 1))} className="px-4 py-2 text-xl">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-bold mb-4 text-green-700 flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Benefits
                </h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Ingredients */}
            {product.key_ingredients.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                    </svg>
                  </div>
                  Key Ingredients
                </h3>
                <ul className="space-y-3">
                  {product.key_ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dosage */}
            {product.dosage.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold mb-4 text-purple-700 flex items-center">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Dosage
                </h3>
                <ul className="space-y-3">
                  {product.dosage.map((dose, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{dose}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Directions for Use */}
            {product.directions_for_use && (
              <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-700 flex items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Directions for Use
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.directions_for_use}</p>
              </div>
            )}

          {/* Warning Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Cautions */}
            {product.cautions.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-bold mb-4 text-yellow-700 flex items-center">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  Cautions
                </h3>
                <ul className="space-y-3">
                  {product.cautions.map((caution, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side Effects */}
            {product.side_effects.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-bold mb-4 text-red-700 flex items-center">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Side Effects
                </h3>
                <ul className="space-y-3">
                  {product.side_effects.map((effect, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Manufacturer Info */}
          <div className="mt-8">
            {/* Manufacturer Info */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h3 className="text-lg font-bold mb-4 text-teal-700 flex items-center">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Manufacturer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.manufactured_by && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Manufactured by</p>
                    <p className="font-semibold text-gray-900">{product.manufactured_by}</p>
                  </div>
                )}
                {product.packed_by && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Packed by</p>
                    <p className="font-semibold text-gray-900">{product.packed_by}</p>
                  </div>
                )}
                {product.seller_information && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Seller</p>
                    <p className="font-semibold text-gray-900">{product.seller_information}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map(p => (
                <div key={p.product_id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
