import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { UserProvider } from './contexts/UserContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { OrderProvider } from './contexts/OrderContext.jsx';
import { AddressProvider } from './contexts/AddressContext.jsx';
import './index.css'; // <-- MAKE SURE THIS LINE IS HERE
import App from './App.jsx';

// Loading component for persistence
const PersistenceLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PersistenceLoader />} persistor={persistor}>
        <UserProvider>
          <CartProvider>
            <OrderProvider>
              <AddressProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </AddressProvider>
            </OrderProvider>
          </CartProvider>
        </UserProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
