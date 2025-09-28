import { useState, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/images/placeholder.jpg',
  ...props 
}) {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [imageRef, setImageRef] = useState()
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && src && !loaded && !error) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setLoaded(true)
      }
      img.onerror = () => {
        setError(true)
        setImageSrc(placeholder)
      }
      img.src = src
    }
  }, [inView, src, loaded, error, placeholder])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-70'
        } ${className}`}
        {...props}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  )
}