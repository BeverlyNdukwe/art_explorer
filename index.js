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

ocument.getElementById("period-filter").addEventListener("change", async e => {
  const val = e.target.value;
  try {
    const res = await fetch("http://localhost:3000/artworks");
    const data = await res.json();
    if (val === "all") return renderArtworks(data);
    const [start, end] = val.split("-").map(Number);
    const filtered = data.filter(a => a.year >= start && a.year <= end);
    renderArtworks(filtered);
  } catch (err) {
    console.error("Filter failed:", err);
  }
});

artworkContainer.addEventListener("click", e => {
  if (e.target.classList.contains("save-btn")) {
    const id = e.target.dataset.id;
    fetch(`http://localhost:3000/artworks/${id}`)
      .then(res => res.json())
      .then(art => {
        fetch("http://localhost:3000/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(art)
        })
          .then(() => {
            loadFavorites();
            alert("Added to your gallery!");
          });
      });
  }
});

async function loadFavorites() {
  try {
    const res = await fetch("http://localhost:3000/favorites");
    const data = await res.json();
    favoritesContainer.innerHTML = "";
    data.forEach(art => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${art.title}</h3>
        <p><em>${art.artist}</em> (${art.year})</p>
        <img src="${art.image}" alt="${art.title}">
      `;
      favoritesContainer.appendChild(card);
    });
  } catch (err) {
    favoritesContainer.innerHTML = '<p class="error-message">Failed to load favorites. </p>';
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchArtworks();
  loadFavorites();
});
