async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
}

async function initLeagues() {
    await loadLeagues();
}

async function loadLeagues() {
    const leaguesUl = document.getElementById('leagues_ul');
    leaguesUl.innerHTML = 'Loading...';
    try {
        const leagues = await fetchJSON('/api/leagues');
        leaguesUl.innerHTML = leagues.map(league => `
            <li style="list-style:none; margin-bottom: 1rem;">
                <div class="card d-flex flex-row align-items-center justify-content-between p-3 text-dark">
                    <span><strong>${league.leagueName}</strong></span>
                    <button class="btn btn-primary" onclick="selectLeague('${league._id}', '${league.leagueName}')">Join</button>
                </div>
            </li>
        `).join('');
    } catch (err) {
        leaguesUl.innerHTML = 'Failed to load leagues';
    }
}

function selectLeague(leagueId, leagueName) {
    localStorage.setItem('selectedLeagueId', leagueId);
    localStorage.setItem('selectedLeagueName', leagueName);
    alert(`Selected league: ${leagueName}. Now go create your team!`);
}

async function createLeague() {
    const leagueNameInput = document.getElementById('leagueNameInput');
    const createLeagueStatus = document.getElementById('createLeagueStatus');
    const leagueName = leagueNameInput.value.trim();

    if (!leagueName) {
        createLeagueStatus.innerText = 'League name is required';
        return;
    }

    createLeagueStatus.innerText = 'Creating league...';
    try {
        const response = await fetch('/api/leagues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ leagueName })
        });
        createLeagueStatus.innerText = 'League created!';
        leagueNameInput.value = '';
        loadLeagues();
    } catch (err) {
        console.log(err);
        createLeagueStatus.innerText = 'Failed to create league';
    }
}