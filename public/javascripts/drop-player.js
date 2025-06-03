function initDropPlayer() {
  document.getElementById('drop-player-form').onsubmit = async function (e) {
    e.preventDefault();
    const teamName = document.getElementById('teamName').value.trim();
    const player = document.getElementById('player').value.trim();

    const res = await fetch('/api/dropPlayer', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName, player })
    });
    const msgDiv = document.getElementById('drop-player-message');
    const data = await res.json();
    if (res.ok && data.status === "success") {
      msgDiv.innerHTML = `<div class="alert alert-success">Player dropped successfully!</div>`;
    } else {
      msgDiv.innerHTML = `<div class="alert alert-danger">${data.message || 'Failed to drop player.'}</div>`;
    }
  };
}
