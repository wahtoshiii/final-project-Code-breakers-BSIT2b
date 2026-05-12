document.addEventListener('DOMContentLoaded', () => {
    // 1. Check who is logged in
    const userData = localStorage.getItem('currentUser');
    if (!userData) return;

    const user = JSON.parse(userData);

    // 2. If the user is an Owner or Seller, modify their navigation
    if (user.role === 'owner' || user.role === 'seller') {

        // A. If they somehow land on the buyer marketplace, redirect them instantly
        if (window.location.pathname.includes('market.html')) {
            window.location.href = 'owner-dashboard.html';
            return;
        }

        // B. Find ANY link pointing to the consumer market and rewrite it to the Seller Dashboard
        const marketLinks = document.querySelectorAll('a[href="market.html"]');
        
        marketLinks.forEach(link => {
            // Change the link destination
            link.href = 'owner-dashboard.html';
            if (link.hasAttribute('data-target')) {
                link.setAttribute('data-target', 'owner-dashboard.html');
            }

            // Change the text underneath the icon from "Market" to "Seller"
            const textSpan = link.querySelector('span');
            if (textSpan) {
                textSpan.textContent = 'Seller';
            }
        });
    }
});