let allPlayers = [];
let currentTeamPlayers = [];
let selectedPlayer = "";
let currentTeam = null;

async function initAddPlayer() {
  await loadPlayerList();
  await loadTeamPlayers();
  setupSearchableDropdown();

  document.getElementById("add-player-form").onsubmit = async function (e) {
    e.preventDefault();
    const player = selectedPlayer;

    if (!currentTeam) {
      document.getElementById("add-player-message").innerHTML =
        '<div class="alert alert-danger">No team found for your account.</div>';
      return;
    }

    if (!player) {
      document.getElementById("add-player-message").innerHTML =
        '<div class="alert alert-danger">Please select a player to add.</div>';
      return;
    }

    if (currentTeamPlayers.length >= 10) {
      document.getElementById("add-player-message").innerHTML =
        '<div class="alert alert-danger">Team already has maximum number of players (10).</div>';
      return;
    }

    if (currentTeamPlayers.includes(player)) {
      document.getElementById("add-player-message").innerHTML =
        '<div class="alert alert-warning">This player is already on the team.</div>';
      return;
    }

    const res = await fetch("/api/addPlayer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: currentTeam.teamName, player }),
    });
    const msgDiv = document.getElementById("add-player-message");
    const data = await res.json();
    if (res.ok && data.status === "success") {
      msgDiv.innerHTML = `<div class="alert alert-success">Player "${player}" added successfully!</div>`;
      selectedPlayer = "";
      document.getElementById("player-search").value = "";
      document.getElementById("player").value = "";
      await loadTeamPlayers();
    } else {
      msgDiv.innerHTML = `<div class="alert alert-danger">${
        data.message || "Failed to add player."
      }</div>`;
    }
  };
}

async function loadPlayerList() {
  try {
    const res = await fetch("/api/team/player-names");
    allPlayers = await res.json();
  } catch (error) {
    console.error("Failed to load players:", error);
    allPlayers = [];
  }
}

async function loadTeamPlayers() {
  const teamSection = document.getElementById("current-team-section");
  const teamInfo = document.getElementById("team-info");
  const playersDiv = document.getElementById("current-players");
  const messageDiv = document.getElementById("add-player-message");

  teamInfo.innerHTML = '<div class="loading">Loading team players...</div>';
  teamSection.style.display = "block";
  messageDiv.innerHTML = '';

  try {
    const res = await fetch("/api/addPlayer");
    const data = await res.json();

    if (res.ok && data.status === "success") {
      currentTeam = data.team;
      currentTeamPlayers = data.team.members || [];
      teamInfo.innerHTML = `
        <div class="team-header">
          <strong>Team: ${data.team.teamName}</strong> 
          <span class="badge bg-secondary">${currentTeamPlayers.length}/10 players</span>
        </div>`;

      if (currentTeamPlayers.length === 0) {
        playersDiv.innerHTML =
          '<div class="text-light">No players on this team yet.</div>';
      } else {
        playersDiv.innerHTML = currentTeamPlayers
          .map((player) => `<span class="player-tag">${player}</span>`)
          .join("");
      }
    } else {
      teamSection.style.display = "none";
      messageDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
      currentTeamPlayers = [];
    }
  } catch (error) {
    teamSection.style.display = "none";
    messageDiv.innerHTML = '<div class="alert alert-danger">Failed to load team players</div>';
    currentTeamPlayers = [];
    console.error("Error loading team players:", error);
  }
}

async function setupSearchableDropdown() {
  const searchInput = document.getElementById("player-search");
  const dropdown = document.getElementById("player-dropdown");

  try {
    const res = await fetch("/api/team/all-teams");
    const data = await res.json();
    const allTeamPlayers = data.teams.flatMap(team => team.members);

    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.trim().toLowerCase();

      if (query.length === 0) {
        hideDropdown();
        selectedPlayer = "";
        document.getElementById("player").value = "";
        return;
      }

      const filteredPlayers = allPlayers.filter((player) =>
        player.toLowerCase().includes(query)
      );

      showDropdownWithAvailability(filteredPlayers, allTeamPlayers);
    });
  } catch (error) {
    console.error("Error loading teams:", error);
  }

  searchInput.addEventListener("focus", function (e) {
    const query = e.target.value.trim().toLowerCase();
    if (query.length > 0) {
      const filteredPlayers = allPlayers.filter((player) =>
        player.toLowerCase().includes(query)
      );
      showDropdown(filteredPlayers);
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".player-search-container")) {
      hideDropdown();
    }
  });
}

function showDropdown(players) {
  const dropdown = document.getElementById("player-dropdown");

  if (players.length === 0) {
    dropdown.innerHTML = '<div class="no-results">No players found</div>';
  } else {
    dropdown.innerHTML = players
      .slice(0, 10)
      .map((player) => {
        const isOnTeam = currentTeamPlayers.includes(player);
        const className = isOnTeam
          ? "player-dropdown-item"
          : "player-dropdown-item";
        const style = isOnTeam ? "opacity: 0.6;" : "";
        const suffix = isOnTeam ? " (Already on team)" : "";
        return `<div class="${className}" style="${style}" onclick="selectPlayer('${player.replace(
          /'/g,
          "\\'"
        )}')">${player}${suffix}</div>`;
      })
      .join("");
  }

  dropdown.style.display = "block";
}

function showDropdownWithAvailability(players, allTeamPlayers) {
  const dropdown = document.getElementById("player-dropdown");

  if (players.length === 0) {
    dropdown.innerHTML = '<div class="no-results">No players found</div>';
  } else {
    dropdown.innerHTML = players
      .slice(0, 10)
      .map((player) => {
        const isOnAnyTeam = allTeamPlayers.includes(player);
        const isOnCurrentTeam = currentTeamPlayers.includes(player);
        const className = "player-dropdown-item" + (isOnAnyTeam ? " disabled" : "");
        const style = isOnAnyTeam ? "opacity: 0.6;" : "";
        let suffix = "";
        if (isOnCurrentTeam) suffix = " (Already on team)";
        else if (isOnAnyTeam) suffix = " (On another team)";
        
        return `<div class="${className}" style="${style}" ${!isOnAnyTeam ? `onclick="selectPlayer('${player.replace(/'/g, "\\'")}')"` : ""}>${player}${suffix}</div>`;
      })
      .join("");
  }

  dropdown.style.display = "block";
}

function hideDropdown() {
  document.getElementById("player-dropdown").style.display = "none";
}

function selectPlayer(playerName) {
  selectedPlayer = playerName;
  document.getElementById("player-search").value = playerName;
  document.getElementById("player").value = playerName;
  hideDropdown();

  document.getElementById("add-player-message").innerHTML = "";
}
