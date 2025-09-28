import { useState, useEffect } from 'react'
import { detectUserLocation } from '../utils/locationUtils'

export default function LocationDetector({ onLocationDetected }) {
  const [pincode, setPincode] = useState('') // Start empty
  const [detecting, setDetecting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const savedPincode = localStorage.getItem('user_pincode')
    if (savedPincode) {
      setPincode(savedPincode)
      onLocationDetected?.(savedPincode)
    } else {
      // Set default pincode if none saved
      setPincode('110040')
      localStorage.setItem('user_pincode', '110040')
      onLocationDetected?.('110040')
    }
  }, [onLocationDetected])

  const handleDetectLocation = async () => {
    setDetecting(true)
    try {
      const locationData = await detectUserLocation()
      if (locationData.pincode) {
        setPincode(locationData.pincode)
        localStorage.setItem('user_pincode', locationData.pincode)
        onLocationDetected?.(locationData.pincode)
        setShowModal(false)
      }
    } catch (error) {
      console.log('Could not detect location, using default pincode')
      // Keep current pincode on error
    } finally {
      setDetecting(false)
    }
  }

  const handlePincodeSubmit = () => {
    if (pincode && pincode.length === 6) {
      localStorage.setItem('user_pincode', pincode)
      onLocationDetected?.(pincode)
      setShowModal(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only numbers, max 6 digits
    setPincode(value)
  }

  const handleCancel = () => {
    // Reset to saved pincode or default
    const savedPincode = localStorage.getItem('user_pincode') || '110040'
    setPincode(savedPincode)
    setShowModal(false)
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xs md:text-sm">
        <svg className="w-3 h-3 md:w-4 md:h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-gray-600">Deliver to:</span>
        <button 
          onClick={() => setShowModal(true)}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          {pincode || 'Select'}
        </button>
        {detecting && <span className="text-xs text-gray-500">Detecting...</span>}
      </div>

      {/* Pincode Change Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Change Delivery Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePincodeSubmit}
                  disabled={!pincode || pincode.length !== 6}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Update
                </button>
                <button
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {detecting ? 'Detecting...' : 'Auto Detect'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}