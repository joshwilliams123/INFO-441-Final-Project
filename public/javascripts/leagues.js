async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
}

async function initLeagues() {
    // Check if on homepage to load user leagues
    if (window.location.pathname === '/homepage.html') {
        await loadUserLeagues();
    }
    // Always load all leagues and set up team viewing if on leagues page
    if (window.location.pathname === '/leagues.html') {
         await loadLeagues();
         // Initially hide team actions
        document.getElementById('team_actions').style.display = 'none';
    }
}

async function loadUserLeagues() {
    const userLeaguesUl = document.getElementById('user_leagues_ul');
    if (!userLeaguesUl) return; // Exit if element doesn't exist on this page

    userLeaguesUl.innerHTML = 'Loading...';
    try {
        const teams = await fetchJSON('/api/team/my-teams');
        if (teams.status === 'success' && teams.teams.length > 0) {
            const leagueIds = [...new Set(teams.teams.map(team => team.league))];
            const leagues = await Promise.all(
                leagueIds.map(id => fetchJSON(`/api/leagues/${id}`))
            );
            
            userLeaguesUl.innerHTML = leagues.map(league => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${league.leagueName}</span>
                    <button class="btn btn-primary btn-sm" onclick="viewLeagueTeams('${league._id}', '${league.leagueName}')">
                        View Teams
                    </button>
                </li>
            `).join('');
        } else {
            userLeaguesUl.innerHTML = '<li class="list-group-item">You have not joined any leagues yet.</li>';
        }
    } catch (err) {
        userLeaguesUl.innerHTML = '<li class="list-group-item text-danger">Failed to load your leagues</li>';
    }
}

async function loadLeagues() {
    const leaguesUl = document.getElementById('leagues_ul');
     if (!leaguesUl) return; // Exit if element doesn't exist on this page

    leaguesUl.innerHTML = 'Loading...';
    try {
        const leagues = await fetchJSON('/api/leagues');
        leaguesUl.innerHTML = leagues.map(league => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${league.leagueName}</span>
                <button class="btn btn-primary btn-sm" onclick="selectLeague('${league._id}', '${league.leagueName}')">
                    Join
                </button>
            </li>
        `).join('');
    } catch (err) {
        leaguesUl.innerHTML = '<li class="list-group-item text-danger">Failed to load leagues</li>';
    }
}

async function viewLeagueTeams(leagueId, leagueName) {
    const teamsUl = document.getElementById('teams_ul');
    const selectedLeagueInfo = document.getElementById('selected_league_info');
    const teamActionsDiv = document.getElementById('team_actions');
    
    selectedLeagueInfo.innerHTML = `<h4>Teams in ${leagueName}</h4>`;
    teamsUl.innerHTML = 'Loading...';
    // Show team actions buttons
    if(teamActionsDiv) teamActionsDiv.style.display = 'block';

    try {
        const response = await fetchJSON(`/api/leagues/${leagueId}/teams`);
        if (response.status === 'success') {
            if (response.teams.length > 0) {
                teamsUl.innerHTML = response.teams.map(team => `
                    <li class="list-group-item">
                        <h5 class="mb-1">${team.teamName}</h5>
                        <p class="mb-1">Members: ${team.members.join(', ')}</p>
                    </li>
                `).join('');
            } else {
                teamsUl.innerHTML = '<li class="list-group-item">No teams in this league yet.</li>';
            }
        }
    } catch (err) {
        teamsUl.innerHTML = '<li class="list-group-item text-danger">Failed to load teams</li>';
         if(teamActionsDiv) teamActionsDiv.style.display = 'none'; // Hide actions on error
    }
}

function selectLeague(leagueId, leagueName) {
    localStorage.setItem('selectedLeagueId', leagueId);
    localStorage.setItem('selectedLeagueName', leagueName);
    alert(`Selected league: ${leagueName}. Now go create your team!`);
    window.location.href = '/create-team.html';
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
        const data = await response.json();
        if (data.status === 'success') {
            createLeagueStatus.innerText = 'League created!';
            leagueNameInput.value = '';
            await loadLeagues();
        } else {
            createLeagueStatus.innerText = data.message || 'Failed to create league';
        }
    } catch (err) {
        console.error(err);
        createLeagueStatus.innerText = 'Failed to create league';
    }
}