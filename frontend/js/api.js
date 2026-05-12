const BASE_URL = '';

/**
 * Generic GET request to any API endpoint.
 * @param {string} endpoint - e.g. '/api/products'
 * @returns {Promise<Array>} - array of results
 */
async function getData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Shortcut functions per entity
const getUsers    = () => getData('/api/users');
const getProducts = () => getData('/api/products');
const getOrders   = () => getData('/api/orders');
