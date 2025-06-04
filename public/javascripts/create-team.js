function initCreateTeam() {
    const form = document.getElementById('create-team-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const teamName = document.getElementById('teamName').value;
        const memberSelect = document.getElementById('members');
        const members = Array.from(memberSelect.selectedOptions).map(opt => opt.value);
        
        try {
            const response = await fetch('/create-team/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamName, members })
            });
            
            const data = await response.json();
            const messageDiv = document.getElementById('create-team-message');
            
            if (data.status === 'success') {
                messageDiv.className = 'alert alert-success';
                messageDiv.textContent = 'Team created successfully!';
                form.reset();
                document.getElementById('selected-players').innerHTML = '';
            } else {
                messageDiv.className = 'alert alert-danger';
                messageDiv.textContent = data.message;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}