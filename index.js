const artworkContainer = document.getElementById("artwork-container");
const favoritesContainer = document.getElementById("favorites-container");

async function fetchArtworks() {
  try {
    const res = await fetch("http://localhost:3000/artworks");
    const data = await res.json();
    renderArtworks(data);
  } catch (err) {
    artworkContainer.innerHTML = '<p class="error-message">Something went wrong loading artworks.</p>';
    console.error(err);
  }
}

function renderArtworks(artworks) {
  artworkContainer.innerHTML = "";
  artworks.forEach(art => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${art.title}</h3>
      <p><em>${art.artist}</em> (${art.year})</p>
      <img src="${art.image}" alt="${art.title}">
      <button data-id="${art.id}" class="save-btn">Save</button>
    `;
    artworkContainer.appendChild(card);
  });
}
// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

document.addEventListener("click", function (e) {
  if (e.target.tagName === "IMG" && e.target.closest(".art-works")) {
    lightboxImg.src = e.target.src;
    lightbox.style.display = "flex";
  } else if (e.target === lightbox || e.target === lightboxImg) {
    lightbox.style.display = "none";
  }
});

document.getElementById("search-form").addEventListener("submit", async e => {
  e.preventDefault();
  const query = document.getElementById("search-input").value.toLowerCase();
  try {
    const res = await fetch("http://localhost:3000/artworks");
    const data = await res.json();
    const filtered = data.filter(a => a.artist.toLowerCase().includes(query));
    renderArtworks(filtered);
  } catch (err) {
    console.error("Search failed:", err);
  }
});