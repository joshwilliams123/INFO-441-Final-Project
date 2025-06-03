async function initLeagues() {
    await loadLeagues();
}

async function loadLeagues() {
    const leaguesUl = document.getElementById('leagues_ul');
    leaguesUl.innerHTML = 'Loading...';
    try {
        const leagues = await fetchJSON('/leagues');
        leaguesUl.innerHTML = leagues.map(league => `<li>league.leagueName</li>`).join('');
    } catch (err) {
        leaguesUl.innerHTML = 'Failed to load leagues';
    }
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