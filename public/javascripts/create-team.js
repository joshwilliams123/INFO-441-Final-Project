function initCreateTeam() {
    document.getElementById('create-team-form').onsubmit = async function(e) {
        e.preventDefault();
        const teamName = document.getElementById('teamName').value.trim();
        const members = document.getElementById('members').value.split(',').map(m => m.trim()).filter(Boolean);

        const res = await fetch('/team/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ teamName, members })
        });
        const msgDiv = document.getElementById('create-team-message');
        if (res.ok) {
            msgDiv.innerHTML = '<div class="alert alert-success">Team created successfully!</div>';
        } else {
            const err = await res.json();
            msgDiv.innerHTML = `<div class="alert alert-danger">${err.message || 'Failed to create team.'}</div>`;
        }
    };
}
