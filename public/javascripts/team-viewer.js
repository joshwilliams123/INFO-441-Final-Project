document.addEventListener('DOMContentLoaded', async () => {
    const teamsList = document.getElementById('teams-list');
    teamsList.innerHTML = 'Loading...';

    try {
        const res = await fetch('/api/team/my-teams');
        const data = await res.json();

        if (data.status !== 'success') {
            teamsList.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            return;
        }

        if (data.teams.length === 0) {
            teamsList.innerHTML = '<div class="alert alert-info">You have not created any teams yet.</div>';
            return;
        }

        const leaguesRes = await fetch('/api/leagues');
        const leagues = await leaguesRes.json();
        const leagueMap = {};
        leagues.forEach(l => { leagueMap[l._id] = l.leagueName; });

        teamsList.innerHTML = data.teams.map(team => `
            <div class="card mb-3">
                <div class="card-body text-dark" style="background: #fff;">
                    <h5 class="card-title">${team.teamName}</h5>
                    <p class="card-text"><strong>Members:</strong> ${team.members.join(', ')}</p>
                    <p class="card-text"><strong>League:</strong> ${leagueMap[team.league] || team.league}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        teamsList.innerHTML = `<div class="alert alert-danger">Failed to load teams.</div>`;
    }
});