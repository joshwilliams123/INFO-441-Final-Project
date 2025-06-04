let allPlayers = [];
let selectedPlayers = [];

async function initCreateTeam() {
  await loadPlayerList();
  setupSearchableDropdown();

  document.getElementById("create-team-form").onsubmit = async function (e) {
    e.preventDefault();
    const teamName = document.getElementById("teamName").value.trim();
    const members = selectedPlayers;

    if (members.length === 0) {
      document.getElementById("create-team-message").innerHTML =
        '<div class="alert alert-danger">Please select at least one player.</div>';
      return;
    }

    const leagueId = localStorage.getItem("selectedLeagueId");
    console.log("leagueId:", leagueId);

    const res = await fetch("/api/team/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, members, leagueId }),
    });
    const msgDiv = document.getElementById("create-team-message");
    if (res.ok) {
      const data = await res.json();
      if (data.team) {
        msgDiv.innerHTML = `
                        <div class="alert alert-success">
                            <h4>Team Created Successfully!</h4>
                            <div><strong>${data.team.teamName}</strong></div>
                            <ul>
                                ${data.team.members
                                  .map((member) => `<li>${member}</li>`)
                                  .join("")}
                            </ul>
                        </div>
                    `;
      } else {
        msgDiv.innerHTML =
          '<div class="alert alert-success">Team created successfully!</div>';
      }
    } else {
      const err = await res.json();
      msgDiv.innerHTML = `<div class="alert alert-danger">${
        err.message || "Failed to create team."
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

function setupSearchableDropdown() {
  const searchInput = document.getElementById("player-search");
  const dropdown = document.getElementById("player-dropdown");

  searchInput.addEventListener("input", function (e) {
    const query = e.target.value.trim().toLowerCase();

    if (query.length === 0) {
      hideDropdown();
      return;
    }

    const filteredPlayers = allPlayers.filter(
      (player) =>
        player.toLowerCase().includes(query) &&
        !selectedPlayers.includes(player)
    );

    showDropdown(filteredPlayers);
  });

  searchInput.addEventListener("focus", function (e) {
    const query = e.target.value.trim().toLowerCase();
    if (query.length > 0) {
      const filteredPlayers = allPlayers.filter(
        (player) =>
          player.toLowerCase().includes(query) &&
          !selectedPlayers.includes(player)
      );
      showDropdown(filteredPlayers);
    }
  });

  // Hide dropdown when clicking outside
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
      .map(
        (player) =>
          `<div class="player-dropdown-item" onclick="selectPlayer('${player.replace(
            /'/g,
            "\\'"
          )}')">${player}</div>`
      )
      .join("");
  }

  dropdown.style.display = "block";
}

function hideDropdown() {
  document.getElementById("player-dropdown").style.display = "none";
}

function selectPlayer(playerName) {
  if (!selectedPlayers.includes(playerName)) {
    selectedPlayers.push(playerName);
    updateSelectedPlayersDisplay();
    document.getElementById("player-search").value = "";
    hideDropdown();
  }
}

function removePlayer(playerName) {
  selectedPlayers = selectedPlayers.filter((p) => p !== playerName);
  updateSelectedPlayersDisplay();
}

function updateSelectedPlayersDisplay() {
  const container = document.getElementById("selected-players");
  const membersInput = document.getElementById("members");

  if (selectedPlayers.length === 0) {
    container.innerHTML =
      '<small class="form-text text-light">Selected players will appear here. You need at least one player to create a team.</small>';
    membersInput.value = "";
  } else {
    container.innerHTML = selectedPlayers
      .map(
        (player) =>
          `<span class="selected-player-tag">
                    ${player}
                    <span class="remove-player" onclick="removePlayer('${player.replace(
                      /'/g,
                      "\\'"
                    )}')">&times;</span>
                </span>`
      )
      .join("");
    membersInput.value = JSON.stringify(selectedPlayers);
  }
}
