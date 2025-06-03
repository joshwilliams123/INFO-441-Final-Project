async function initLeagues() {
    await loadLeagues();
}

async function loadLeagues() {
    const leaguesUl = document.getElementById('leagues_ul');
    leaguesUl.innerHTML = 'Loading...';
    try {
        const leagues = await fetchJSON('/leagues');
        leaguesUl.innerHTML = leagues.map(league => `<li>${escapeHTML(league.leagueName)}</li>`).join('');
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
        await fetchJSON('/leagues', {
            method: 'POST',
            body: { leagueName }
        });
        createLeagueStatus.innerText = 'League created!';
        leagueNameInput.value = '';
        loadLeagues();
    } catch (err) {
        createLeagueStatus.innerText = 'Failed to create league';
    }
}