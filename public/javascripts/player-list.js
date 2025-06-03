// This script loads player names from the backend endpoint and enables a searchable dropdown

async function loadPlayerList() {
    const select = document.getElementById('members');
    const searchInput = document.getElementById('player-search');
    if (!select || !searchInput) return;

    // Fetch player names from backend endpoint
    const res = await fetch('/api/team/player-names');
    const players = await res.json();

    // Helper to populate select options
    function populateOptions(filter = "") {
        select.innerHTML = '';
        players
            .filter(player => player.toLowerCase().includes(filter.toLowerCase()))
            .forEach(player => {
                const opt = document.createElement('option');
                opt.value = player;
                opt.textContent = player;
                select.appendChild(opt);
            });
    }

    // Initial population
    populateOptions();

    // Add search/filter functionality
    searchInput.addEventListener('input', function(e) {
        populateOptions(e.target.value);
    });
}

// Call on page load
if (document.readyState !== 'loading') loadPlayerList();
else document.addEventListener('DOMContentLoaded', loadPlayerList);
