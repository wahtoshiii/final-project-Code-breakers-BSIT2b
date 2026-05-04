document.addEventListener('DOMContentLoaded', () => {
    // Setup for virtual tour interactions
    const exploreCards = document.querySelectorAll('.explore-card');

    exploreCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Logic to handle opening a specific establishment walkthrough
            console.log("Navigating to facility details...");
        });
    });
});