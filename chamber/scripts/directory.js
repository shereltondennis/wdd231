const membersContainer = document.querySelector("#membersContainer");
const gridButton = document.querySelector("#gridView");
const listButton = document.querySelector("#listView");

const membershipLabels = {
  1: "Member",
  2: "Silver",
  3: "Gold"
};

const setView = (view) => {
  if (!membersContainer || !gridButton || !listButton) {
    return;
  }

  const isGrid = view === "grid";
  membersContainer.classList.toggle("grid-view", isGrid);
  membersContainer.classList.toggle("list-view", !isGrid);
  gridButton.classList.toggle("is-active", isGrid);
  listButton.classList.toggle("is-active", !isGrid);
  gridButton.setAttribute("aria-pressed", String(isGrid));
  listButton.setAttribute("aria-pressed", String(!isGrid));
};

const createMemberCard = (member) => {
  const card = document.createElement("article");
  card.className = "member-card";

  const membership = membershipLabels[member.membershipLevel] || "Member";

  card.innerHTML = `
    <img src="images/${member.image}" alt="${member.name} logo" width="88" height="88" loading="lazy">
    <div>
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Email:</strong> ${member.email}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
      <p>${member.description}</p>
      <span class="member-level">${membership} Member</span>
    </div>
  `;

  return card;
};

const renderMembers = (members) => {
  if (!membersContainer) {
    return;
  }

  membersContainer.innerHTML = "";
  members.forEach((member) => {
    membersContainer.append(createMemberCard(member));
  });
};

const loadMembers = async () => {
  if (!membersContainer) {
    return;
  }

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Failed to load members (${response.status})`);
    }

    const members = await response.json();
    renderMembers(members);
  } catch (error) {
    membersContainer.innerHTML = "<p>Unable to load member directory at this time.</p>";
    console.error(error);
  }
};

gridButton?.addEventListener("click", () => setView("grid"));
listButton?.addEventListener("click", () => setView("list"));

setView("grid");
loadMembers();
