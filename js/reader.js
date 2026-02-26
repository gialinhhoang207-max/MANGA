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


/* =====================================================
   CHAPTER NAVIGATION (Top + Bottom)
===================================================== */

const prevButtons = document.querySelectorAll(".prevChap");
const nextButtons = document.querySelectorAll(".nextChap");
const chapInfos = document.querySelectorAll(".chapInfo");

chapInfos.forEach(info => {
  info.textContent = `Chap ${chapNumber} / ${manga.totalChapters}`;
});

// ===== Chap trước =====
if (chapNumber > 1) {

  prevButtons.forEach(btn => {
    btn.onclick = function () {
      window.scrollTo(0, 0);
      window.location.href = `reader.html?id=${id}&chap=${chapNumber - 1}`;
    };
  });

} else {
  prevButtons.forEach(btn => btn.disabled = true);
}

// ===== Chap sau =====
if (chapNumber < manga.totalChapters) {

  nextButtons.forEach(btn => {
    btn.onclick = function () {
      window.scrollTo(0, 0);
      window.location.href = `reader.html?id=${id}&chap=${chapNumber + 1}`;
    };
  });

} else {
  nextButtons.forEach(btn => btn.disabled = true);
}

// ===== Phím mũi tên để chuyển chap =====
document.addEventListener("keydown", function (e) {

  if (e.key === "ArrowLeft" && chapNumber > 1) {
    window.location.href = `reader.html?id=${id}&chap=${chapNumber - 1}`;
  }

  if (e.key === "ArrowRight" && chapNumber < manga.totalChapters) {
    window.location.href = `reader.html?id=${id}&chap=${chapNumber + 1}`;
  }

});


/* =====================================================
   LOAD CHAPTER IMAGES
===================================================== */

const chapterFolder = `${manga.baseFolder}chap${chapNumber}/`;

console.log("Đang load từ:", chapterFolder);

const extensions = ["jpg"];

function generateFileNames(pageNumber) {

  const names = [];

  for (let digits = 1; digits <= 3; digits++) {
    names.push(pageNumber.toString().padStart(digits, "0"));
  }

  names.push(pageNumber.toString());

  return [...new Set(names)];
}

let pageIndex = 1;
let stop = false;


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


/* =====================================================
   Highlight trang đang xem
===================================================== */

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
