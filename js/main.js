const container = document.getElementById("manga-list");
const searchInput = document.getElementById("searchInput");

/* ===== Render Manga ===== */

function renderManga(list) {

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <h3 style="grid-column:1/-1; text-align:center; color:#aaa;">
        Không tìm thấy truyện phù hợp
      </h3>
    `;
    return;
  }

  list.forEach(manga => {

    const div = document.createElement("div");
    div.className = "manga-card";

    const latestChap = manga.totalChapters;

    div.innerHTML = `
      <img src="${manga.cover}">
      <h3>${manga.title}</h3>
      <p>${manga.description}</p>

      <a class="btn read-btn" 
         href="reader.html?id=${manga.id}&chap=${latestChap}"
         onclick="event.stopPropagation();">
         📖 Đọc ngay (Chap ${latestChap})
      </a>
    `;

    div.addEventListener("click", () => {
      window.location.href = `manga.html?id=${manga.id}`;
    });

    container.appendChild(div);
  });

}

/* Render ban đầu */
renderManga(mangaData);


/* ===== Search ===== */

if (searchInput) {

  searchInput.addEventListener("input", function () {

    const keyword = this.value
      .toLowerCase()
      .trim();

    const filtered = mangaData.filter(manga =>
      manga.title.toLowerCase().includes(keyword) ||
      manga.description.toLowerCase().includes(keyword)
    );

    renderManga(filtered);

  });

}