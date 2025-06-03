function initCreateTeam() {
    document.getElementById('create-team-form').onsubmit = async function (e) {
        e.preventDefault();
        const teamName = document.getElementById('teamName').value.trim();
        const membersSelect = document.getElementById('members');
        const members = Array.from(membersSelect.selectedOptions).map(opt => opt.value);

        const res = await fetch('/api/team/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName, members })
        });
        const msgDiv = document.getElementById('create-team-message');
        if (res.ok) {
            const data = await res.json();
            if (data.team) {
                msgDiv.innerHTML = `
                    <h4>Team</h4>
                    <div><strong>${data.team.teamName}</strong></div>
                    <ul>
                        ${data.team.members.map(member => `<li>${member}</li>`).join('')}
                    </ul>
                `;
            } else {
                msgDiv.innerHTML = '<div class="alert alert-success">Team created successfully!</div>';
            }
        } else {
            const err = await res.json();
            msgDiv.innerHTML = `<div class="alert alert-danger">${err.message || 'Failed to create team.'}</div>`;
        }
    };
}