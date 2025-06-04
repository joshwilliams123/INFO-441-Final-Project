async function initDropPlayer() {
    await loadTeamInfo();
}

async function loadTeamInfo() {
    const res = await fetch('/api/dropPlayer/team');
    const data = await res.json();
    
    if (res.ok && data.status === "success") {
        document.getElementById('team-name').textContent = data.team.teamName;
        const membersList = document.getElementById('members-list');
        membersList.innerHTML = '';
        
        data.team.members.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            memberItem.innerHTML = `
                ${member}
                <button class="btn btn-danger btn-sm" onclick="dropPlayer('${member}')">Remove</button>
            `;
            membersList.appendChild(memberItem);
        });
    } else {
        document.getElementById('drop-player-message').innerHTML = 
            `<div class="alert alert-danger">${data.message || 'Failed to load team info.'}</div>`;
    }
}

async function dropPlayer(player) {
    const teamName = document.getElementById('team-name').textContent;
    const res = await fetch('/api/dropPlayer', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, player })
    });
    
    const data = await res.json();
    const msgDiv = document.getElementById('drop-player-message');
    
    if (res.ok && data.status === "success") {
        msgDiv.innerHTML = `<div class="alert alert-success">Player dropped successfully!</div>`;
        await loadTeamInfo(); // Refresh the team info
    } else {
        msgDiv.innerHTML = `<div class="alert alert-danger">${data.message || 'Failed to drop player.'}</div>`;
    }
}
