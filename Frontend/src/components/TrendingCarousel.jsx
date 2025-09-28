import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function TrendingCarousel({ products, title = "Trending Products", showTitle = true }) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef(null)
  const navigate = useNavigate()

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('mousedown', handleMouseDown)
      carousel.addEventListener('mousemove', handleMouseMove)
      carousel.addEventListener('mouseup', handleMouseUp)
      carousel.addEventListener('mouseleave', handleMouseUp)
      carousel.addEventListener('touchstart', handleTouchStart)
      carousel.addEventListener('touchmove', handleTouchMove)
      carousel.addEventListener('touchend', handleTouchEnd)

      return () => {
        carousel.removeEventListener('mousedown', handleMouseDown)
        carousel.removeEventListener('mousemove', handleMouseMove)
        carousel.removeEventListener('mouseup', handleMouseUp)
        carousel.removeEventListener('mouseleave', handleMouseUp)
        carousel.removeEventListener('touchstart', handleTouchStart)
        carousel.removeEventListener('touchmove', handleTouchMove)
        carousel.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, startX, scrollLeft])

  if (!products || products.length === 0) return null

  return (
    <div className="relative mb-8">
      {showTitle && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}

      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-2"
        style={{ 
          scrollBehavior: 'smooth',
          userSelect: 'none'
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.product_id}
            className="flex-shrink-0 w-40 md:w-56"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !isDragging && navigate(`/product/${product.slug}`)}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
                 onMouseDown={(e) => e.preventDefault()}>
              <div className="relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-28 md:h-40 object-cover"
                  loading="lazy"
                />
                {product.trending && (
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                    🔥
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xs text-gray-500 font-medium">{product.company}</p>
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 mt-1 line-clamp-2 h-8 md:h-10 leading-tight">
                  {product.name}
                </h3>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm md:text-lg font-bold text-gray-900">₹{product.discounted_price.toFixed(2)}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-gray-500 line-through">₹{product.mrp.toFixed(2)}</p>
                    )}
                  </div>
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}