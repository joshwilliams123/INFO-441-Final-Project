async function init() {
  await loadIdentity();
  document.getElementById("create-team-btn").onclick = function () {
    window.location.href = "create-team.html";
  };
}