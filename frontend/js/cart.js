document.addEventListener('DOMContentLoaded', () => {
    const minusBtns = document.querySelectorAll('.btn-outline-secondary:first-of-type');
    const plusBtns = document.querySelectorAll('.btn-outline-secondary:last-of-type');
    
    // Very basic quantity logic for the UI
    plusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const span = e.target.previousElementSibling;
            let current = parseInt(span.textContent);
            span.textContent = current + 1;
        });
    });

    minusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const span = e.target.nextElementSibling;
            let current = parseInt(span.textContent);
            if (current > 1) {
                span.textContent = current - 1;
            }
        });
    });
});