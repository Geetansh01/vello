import { useState, useEffect } from 'react'

let toastTimeout

export default function Toast({ message, type = 'info', duration = 3000 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      clearTimeout(toastTimeout)
      toastTimeout = setTimeout(() => setVisible(false), duration)
    }
    return () => clearTimeout(toastTimeout)
  }, [message, duration])

  if (!visible || !message) return null

  return (
    <div className={`fixed top-20 right-6 z-50 px-4 py-2 rounded shadow text-white transition-all
      ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
      {message}
    </div>
  )
}
