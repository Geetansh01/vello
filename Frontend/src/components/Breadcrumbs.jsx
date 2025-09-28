import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentProduct } from '../store/slices/productsSlice';

export default function Breadcrumbs() {
  const location = useLocation();
  const currentProduct = useSelector(selectCurrentProduct);
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    'products': 'Products',
    'product': 'Product Details',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'profile': 'My Profile',
    'orders': 'Order History',
    'search': 'Search',
    'generic-info': 'Generic Medicines',
    'about': 'About Us',
    'contact': 'Contact Us',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'help': 'Help Center',
    'how-to-order': 'How to Order'
  };

  // Get display label for each breadcrumb
  const getDisplayName = (name, index) => {
    const isProductSlug =
      pathnames[index - 1] === 'product' &&
      currentProduct &&
      index === pathnames.length - 1;

    if (isProductSlug) {
      return currentProduct.name;
    }

    if (breadcrumbNameMap[name]) {
      return breadcrumbNameMap[name];
    }

    // Fallback: Humanize the slug
    return name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Build breadcrumb path route
  const getRouteForBreadcrumb = (name, index) => {
    // Special handling for product routes
    if (pathnames[index - 1] === 'product' && index === pathnames.length - 1) {
      return `/${pathnames.slice(0, index + 1).join('/')}`;
    }
    return `/${pathnames.slice(0, index + 1).join('/')}`;
  };

  // Don't render on homepage
  if (pathnames.length === 0) return null;

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              to="/"
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = getRouteForBreadcrumb(name, index);
            const isLast = index === pathnames.length - 1;
            const displayName = getDisplayName(name, index);

            return (
              <li key={name} className="flex items-center">
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {isLast ? (
                  <span className="text-gray-900 font-medium">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
