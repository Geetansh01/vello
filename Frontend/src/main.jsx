import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // <-- MAKE SURE THIS LINE IS HERE
import App from './App.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { OrderProvider } from './contexts/OrderContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
