const photography = {
  "Ana De Armas - Blonde": 7,
  Boat: 25,
  Gongs: 100,
  "No Time to Die": 11,
  Partae: 26,
  Photography: 207,
};

const hollywoodAuthentic = {
  "Austin Butler": 19,
  "Awards Journey - Emma Stone": 22,
  Cannes: 16,
  "Dakota Johnson": 21,
  "David Corenswet": 14,
  Gongs: 86,
  "Kate Winslet": 10,
  "Mikey Madison": 9,
  "Paul Mescal": 19,
  "Simon Pegg": 12,
  "The Smashing Machine": 11,
  Wolfs: 10,
  "Zoe Saldana": 14,
  Photography: 131,
  Magazines: 7,
};

const basicLink = "https://shoneal.github.io/gregwilliams/"; // Главная ссылка

const setupImageWithContainer = (img, container = null) => {
  const onLoadOrError = () => {
    (container || img).style.opacity = "1";
    img.removeEventListener("load", onLoadOrError);
    img.removeEventListener("error", onLoadOrError);
  };

  (img.complete
    ? onLoadOrError
    : () => {
        img.addEventListener("load", onLoadOrError);
        img.addEventListener("error", onLoadOrError);
      })();
}; // Функция для настройки прозрачности изображения

let currentSlideIndex = 0;
let slidesData = [];
const elements = {
  // Навигация
  mainLink: document.querySelector(".site-title"),
  photographyLink: document.querySelector(".menu-list li:first-child a"),
  hollywoodLink: document.querySelector(".menu-list li:last-child a"),

  // Основные контейнеры
  main: document.querySelector("main"),
  entry: document.querySelector("main .entry"),
  entryContent: document.querySelector(".entry .entry-content"),
  blockColumns: document.querySelector(".entry-content .block-columns"),

  // Шаблоны
  introTemplate: document.getElementById("intro-template"),
  entryTemplate: document.getElementById("entry-template"),
  entryContentTemplate: document.getElementById("entry-content-template"),
  blockColumnsTemplate: document.getElementById("block-columns-template"),

  // Поп‑ап
  popup: document.querySelector(".popup"),
  slidesContainer: document.querySelector(".popup .slides"),
  closeButton: document.querySelector(".popup .close"),
  prevButton: document.querySelector(".popup .prev"),
  nextButton: document.querySelector(".popup .next"),
}; // Все нужные/главные элементы

function url(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
} // Форматирование названия в URL‑формат - "hollywood-authentic"

function camelCase(text) {
  const words = text.trim().split(/\s+/);
  let result = words[0].toLowerCase();

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if (word) {
      result += word[0].toUpperCase() + word.slice(1);
    }
  }

  return result;
} // Форматирование названия в camelCase формат - "hollywoodAuthentic"

function clearContent() {
  document
    .querySelectorAll(".intro, .entry-header, .block-image")
    .forEach((el) => el.remove());
  elements.blockColumns.innerHTML = "";
} // Функция очистки контента
function updateCurrentClasses(target) {
  const isHollywood = target === elements.hollywoodLink;

  elements.hollywoodLink.classList[isHollywood ? "add" : "remove"]("current");
  elements.mainLink.classList[!isHollywood ? "add" : "remove"]("current");
  elements.photographyLink.classList[!isHollywood ? "add" : "remove"](
    "current",
  );
} // Функция обновления классов current
const insertBlock = (template, container) =>
  container.insertBefore(
    template.content.cloneNode(true),
    container.firstElementChild,
  ); // Вставка базовых темплейтов

function populateBlockColumns(data, isHollywood = false) {
  const items = [];
  for (const [key, value] of Object.entries(data)) {
    if (!(isHollywood && key === "Magazines")) {
      items.push({ key, value });
    }
  }

  const totalItems = items.length;
  const splitIndex = isHollywood
    ? Math.floor(totalItems / 2)
    : Math.ceil(totalItems / 2);

  const column1 = createColumnFragment(
    items.slice(0, splitIndex),
    isHollywood,
    isHollywood,
  );
  const column2 = createColumnFragment(
    items.slice(splitIndex),
    isHollywood,
    false,
  );

  elements.blockColumns.replaceChildren(column1, column2);

  elements.blockColumns.addEventListener("click", (event) => {
    const figure = event.target.closest(".block-columns-image");
    if (figure) handleBlockColumnsClick(event);
  });
}

function createColumnFragment(items, isHollywood, addLogo = false) {
  const fragment = document.createDocumentFragment();
  const basePath = isHollywood
    ? url(elements.hollywoodLink.textContent)
    : url(elements.photographyLink.textContent);

  if (isHollywood && addLogo) {
    fragment.appendChild(createLogoFigure());
  }

  for (const { key, value } of items) {
    const figure = createOptimizedItemFigure(key, value, basePath, isHollywood);
    fragment.appendChild(figure);
  }

  const column = document.createElement("div");
  column.className = "block-column";
  column.appendChild(fragment);
  return column;
}
function createLogoFigure() {
  const figure = document.createElement("figure");
  figure.className = "special-block-columns-image";

  const link = document.createElement("a");
  link.href = "https://hollywoodauthentic.com/";
  link.target = "_blank";

  const img = document.createElement("img");
  img.src = `${basicLink}/images/ha-logo.webp`;
  img.alt = "Hollywood Authentic Logo";
  img.loading = "lazy";

  link.appendChild(img);
  figure.appendChild(link);
  return figure;
}
function createOptimizedItemFigure(key, value, basePath, isHollywood) {
  const clone = elements.blockColumnsTemplate.content.cloneNode(true);
  const figure = clone.querySelector(".block-columns-image");
  const link = figure.querySelector("a");
  const img = figure.querySelector("img");
  const caption = figure.querySelector(".element-caption");

  figure.style.opacity = "0";
  link.dataset.name = key;
  img.alt = key;

  caption.innerHTML = key
    .replace(
      /(\s+)(-|–|—|‐)(\s+|$)/g,
      (_, __, dash, spaceAfter) => `&nbsp;${dash}${spaceAfter || ""}`,
    )
    .split(" ")
    .join("<br>");

  const maxImages = isHollywood ? hollywoodAuthentic.Magazines : value;
  const randomNum = Math.floor(Math.random() * maxImages) + 1;
  img.src = `${basicLink}/images/${basePath}/${url(
    key,
  )}/thumb/${randomNum}.jpg`;

  setupImageWithContainer(img, figure);
  return figure;
}

function handleBlockColumnsClick(event) {
  clearContent();
  insertBlock(elements.entryTemplate, elements.entry);

  const isHollywood = elements.hollywoodLink.classList.contains("current");
  const currentLinkText = isHollywood
    ? elements.hollywoodLink.textContent
    : elements.photographyLink.textContent;

  const clickedData =
    event.target.closest(".block-columns-image")?.querySelector("a")?.dataset
      .name || "";

  const entryTitle = document.querySelector(".entry-title");
  const linkInTitle = entryTitle.querySelector("a");

  while (entryTitle.firstChild) {
    entryTitle.removeChild(entryTitle.firstChild);
  }
  linkInTitle.textContent = currentLinkText;
  entryTitle.appendChild(linkInTitle);

  if (currentLinkText !== clickedData) {
    const separator = document.createTextNode(` > ${clickedData}`);
    entryTitle.appendChild(separator);
  }

  const newLink = linkInTitle.cloneNode(true);
  newLink.addEventListener("click", () =>
    handleClick(
      isHollywood ? elements.hollywoodLink : elements.photographyLink,
      isHollywood,
    ),
  );
  linkInTitle.replaceWith(newLink);

  insertBlockImages(clickedData, currentLinkText, isHollywood);
}

function insertBlockImages(dataName, currentLinkText, isHollywood) {
  const dataObject = isHollywood ? hollywoodAuthentic : photography;
  const count = dataObject[dataName] || 0;

  const indices = shuffleArray(Array.from({ length: count }, (_, i) => i + 1));

  const basePath = camelCase(currentLinkText);
  slidesData.length = 0;

  const totalItems = indices.length;
  const firstColumnCount = Math.ceil(totalItems / 2);

  const column1 = createOptimizedColumnFragment(
    indices.slice(0, firstColumnCount),
    dataName,
    basePath,
  );
  const column2 = createOptimizedColumnFragment(
    indices.slice(firstColumnCount),
    dataName,
    basePath,
  );

  elements.blockColumns.replaceChildren(column1, column2);
}

function createOptimizedColumnFragment(indices, dataName, basePath) {
  const fragment = document.createDocumentFragment();
  const startIndex = slidesData.length;

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const globalIndex = startIndex + i;

    const baseImagePath = `${basicLink}/images/${basePath}/${url(dataName)}`;

    const figure = document.createElement("figure");
    figure.dataset.slideIndex = globalIndex;
    figure.classList.add("wp-block-image");

    const img = document.createElement("img");
    img.style.opacity = "0";
    img.src = `${baseImagePath}/thumb/${index}.jpg`;
    img.alt = dataName;
    img.loading = "lazy";
    setupImageWithContainer(img);

    slidesData[globalIndex] = {
      src: `${baseImagePath}/full/${index}.jpg`,
      srcset: `
      ${baseImagePath}/mobile/${index}.jpg 768w,
      ${baseImagePath}/full/${index}.jpg 2000w
    `,
      alt: dataName,
      originalIndex: index,
    };

    figure.appendChild(img);
    figure.addEventListener("click", () =>
      openGalleryPopupForColumn(globalIndex),
    );
    fragment.appendChild(figure);
  }

  const column = document.createElement("div");
  column.className = "block-column";
  column.appendChild(fragment);
  return column;
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function handleClick(target, isHollywood) {
  clearContent();
  updateCurrentClasses(target);

  if (!isHollywood) {
    insertBlock(elements.introTemplate, elements.main);

    document.querySelector(".brand-name").textContent =
      "Greg Williams Photography";
    document.querySelector(".introVideo source").src =
      `${basicLink}/video/intro.mp4`;

    populateBlockColumns(photography, false);
  } else {
    insertBlock(elements.entryContentTemplate, elements.entryContent);

    const randomMagazineNum =
      Math.floor(Math.random() * hollywoodAuthentic.Magazines) + 1;
    const formattedName = url(elements.hollywoodLink.textContent);

    const img = document.querySelector(".block-image img");
    img.src = `${basicLink}/images/${formattedName}/magazine/full/${randomMagazineNum}.jpg`;
    ((img.srcset = `
      ${basicLink}/images/${formattedName}/magazine/thumb/${randomMagazineNum}.jpg 768w,
      ${basicLink}/images/${formattedName}/magazine/full/${randomMagazineNum}.jpg 2000w
    `),
      (img.sizes = "100vw"));
    img.alt = elements.hollywoodLink.textContent;

    populateBlockColumns(hollywoodAuthentic, true);
  }
}

function openGalleryPopupForColumn(startIndex) {
  currentSlideIndex = startIndex;
  openPopup(elements.popup);
  addCloseOverlayListener(elements.popup);
  showSlide(currentSlideIndex);
  updateNavigationButtons();
}
// Показать конкретный слайд
function showSlide(index) {
  if (!slidesData || !slidesData[index]) return; // Защита от ошибок

  elements.slidesContainer.innerHTML = "";

  const slide = document.createElement("img");
  slide.style.opacity = "0";
  slide.src = slidesData[index].src;
  slide.srcset = slidesData[index].srcset;
  slide.sizes = "100vw";
  slide.alt = slidesData[index].alt;
  slide.loading = "lazy";
  setupImageWithContainer(slide);

  elements.slidesContainer.appendChild(slide);

  updateNavigationButtons();
}

function updateNavigationButtons() {
  // Скрываем/показываем кнопку "Prev"
  if (currentSlideIndex === 0) {
    elements.prevButton.classList.add("non-active");
  } else {
    elements.prevButton.classList.remove("non-active");
  }

  // Скрываем/показываем кнопку "Next"
  if (currentSlideIndex === slidesData.length - 1) {
    elements.nextButton.classList.add("non-active");
  } else {
    elements.nextButton.classList.remove("non-active");
  }
}

// Следующий слайд
function nextSlide() {
  if (currentSlideIndex < slidesData.length - 1) {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  }
}

// Предыдущий слайд
function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
  }
}

function handleKeyPress(e) {
  if (!elements.popup.classList.contains("popup_is-opened")) return; // Работаем только если попап открыт

  switch (e.key) {
    case "ArrowLeft":
      prevSlide();
      break;
    case "ArrowRight":
      nextSlide();
      break;
    case "Escape":
      closePopup(popup);
      break;
  }
}

function setupNavigationHandlers() {
  const handlers = [
    [elements.mainLink, false],
    [elements.photographyLink, false],
    [elements.hollywoodLink, true],
  ];

  handlers.forEach(([element, isHollywood]) => {
    element.addEventListener("click", () => handleClick(element, isHollywood));
  });
}

function setupPopupHandlers() {
  elements.closeButton.addEventListener("click", () =>
    closePopup(elements.popup),
  );
  elements.prevButton.addEventListener("click", prevSlide);
  elements.nextButton.addEventListener("click", nextSlide);
  document.addEventListener("keydown", handleKeyPress);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigationHandlers();
  setupPopupHandlers();
  handleClick(elements.mainLink, false);
});

const openPopup = (popup) => {
  const body = document.body;
  const scrollPosition = window.scrollY;
  body.dataset.scrollPosition = scrollPosition;
  body.style.top = `-${scrollPosition}px`;
  body.classList.add("scroll-lock");
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closePopupByEsc);
}; // Открытие popup
const closePopup = (popup) => {
  const body = document.body;
  const scrollPosition = body.dataset.scrollPosition;
  body.style.top = "";
  body.classList.remove("scroll-lock");
  window.scrollTo(0, scrollPosition);
  popup.classList.remove("popup_is-opened");
  popup.querySelectorAll("img").forEach((img) => {
    img.remove();
  });
  document.removeEventListener("keydown", closePopupByEsc);
}; // Закрытие popup
const closePopupByEsc = (e) =>
  e.key === "Escape" && closePopup(document.querySelector(".popup_is-opened")); // Закрытие popup по Esc
function addCloseOverlayListener(element) {
  element.addEventListener("click", function (e) {
    const isOnArrows = e.target.closest(".arrows");
    const isOnClose = e.target.closest(".close");

    if (!isOnArrows && !isOnClose) {
      // Если клик был не на стрелках и не на кнопке закрытия, закрываем попап
      closePopup(e.currentTarget);
    }
  });
}
