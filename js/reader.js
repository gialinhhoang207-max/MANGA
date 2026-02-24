(function () {

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const chapNumber = Number(params.get("chap"));

const manga = mangaData.find(m => m.id === id);

if (!manga) {
  document.body.innerHTML = "<h2>Manga không tồn tại</h2>";
  throw new Error("Manga not found");
}

if (!chapNumber) {
  document.body.innerHTML = "<h2>Chapter không tồn tại</h2>";
  throw new Error("Chapter not found");
}

const reader = document.getElementById("reader");
const pageList = document.getElementById("pageList");

/* Encode để tránh lỗi [ ] */
const chapterFolder = `${manga.baseFolder}chap${chapNumber}/`;

console.log("Đang load từ:", chapterFolder);

/* Tạo các biến thể số trang (1 → 5 chữ số) */
function generateFileNames(pageNumber) {

  const names = [];

  for (let digits = 1; digits <= 5; digits++) {
    names.push(pageNumber.toString().padStart(digits, "0"));
  }

  names.push(pageNumber.toString());

  return [...new Set(names)];
}

let pageIndex = 1;
let stop = false;

/* ===== Tạo nút trang ===== */

function createPageButton(pageNumber) {

  const btn = document.createElement("button");
  btn.textContent = pageNumber;

  btn.onclick = function () {

    const target = document.getElementById("page-" + pageNumber);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  pageList.appendChild(btn);
}

/* ===== Load ảnh ===== */

async function loadPage(pageNumber) {

  if (stop) return;

  const fileNames = generateFileNames(pageNumber);

  for (let name of fileNames) {
    for (let ext of extensions) {

      const url = `${chapterFolder}${name}.${ext}`;

      const img = new Image();
      img.src = url;

      try {

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        img.id = "page-" + pageNumber;
        img.setAttribute("data-page", pageNumber);

        reader.appendChild(img);

        /* Tạo nút trong menu */
        createPageButton(pageNumber);

        pageIndex++;
        loadPage(pageIndex);
        return;

      } catch {
        // thử tiếp
      }
    }
  }

  stop = true;

  if (pageNumber === 1) {
    reader.innerHTML = "<h3>Không tìm thấy ảnh trong chapter này</h3>";
  }
}

loadPage(pageIndex);


/* ===== Highlight trang đang xem ===== */

window.addEventListener("scroll", () => {

  const images = document.querySelectorAll("#reader img");

  let current = 1;

  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top <= 200) {
      current = img.getAttribute("data-page");
    }
  });

  const buttons = pageList.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent == current) {
      btn.classList.add("active");
    }
  });

});

})();

