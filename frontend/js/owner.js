document.addEventListener('DOMContentLoaded', () => {
    const ordersTable = document.querySelector('.table');

    if (ordersTable) {
        ordersTable.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const row = btn.closest('tr');
            const badge = row.querySelector('.badge');
            const actionCell = btn.closest('td');

            if (btn.classList.contains('btn-success')) {
                badge.className = 'badge bg-info rounded-pill';
                badge.textContent = 'Confirmed';
                actionCell.innerHTML = '<span class="text-muted small">Done</span>';
            } 
            
            if (btn.classList.contains('btn-danger')) {
                badge.className = 'badge bg-danger rounded-pill';
                badge.textContent = 'Cancelled';
                actionCell.innerHTML = '<span class="text-muted small">Done</span>';
            }
        });
    }
});