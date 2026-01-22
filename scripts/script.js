const photography = {
  "Ana De Armas - Blonde": 7,
  Boat: 26,
  Gongs: 100,
  "No Time to Die": 11,
  Partae: 27,
  Photography: 205,
}; // С сайта gregwilliams.com

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
  "Zoe Saldana": 13,
  Photography: 131,
}; // С сайта hollywoodauthentic.com

const magazines = 7; // Количество обложек Hollywood Authentic
const basicLink = "https://shoneal.github.io/gregwilliams/"; // Главная ссылка

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
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
} // Форматирование названия в camelCase формат - "hollywoodAuthentic"

const setupImageWithContainer = (img, container = null) => {
  const onLoadOrError = () => {
    (container || img).style.opacity = "1";
  };

  if (img.complete) {
    onLoadOrError();
  } else {
    img.addEventListener("load", onLoadOrError, { once: true });
    img.addEventListener("error", onLoadOrError, { once: true });
  }
}; // Функция для настройки прозрачности изображения
const sizes = [
  { path: "thumb", width: 768 },
  { path: "full", width: 2000 },
]; // Константы размеров изображений
const watchImageForHeight = (img) => {
  if (img && img.complete && img.naturalWidth) {
    updateResponsiveHeight(img);
    return;
  }
  img.addEventListener("load", () => updateResponsiveHeight(img), {
    once: true,
  });
}; // Устанавливаем max‑height изображениям
const updateResponsiveHeight = (img) => {
  img.style.maxHeight = img.offsetWidth * 1.1 + "px";
}; // Установка max‑height для resize

function isHollywood(value) {
  return value === "hollywoodAuthentic";
} // Проверка на нужный массив
function clearContent() {
  document
    .querySelectorAll(".intro, .entry-header, .block-image")
    .forEach((el) => el.remove());
  elements.blockColumns.innerHTML = "";
} // Функция очистки контента
const insertBlock = (template, container) =>
  container.insertBefore(
    template.content.cloneNode(true),
    container.firstElementChild,
  ); // Вставка базовых темплейтов
function createColumnFromFragment(fragment) {
  const column = document.createElement("div");
  column.className = "block-column";
  column.appendChild(fragment);
  return column;
} // Создание колонки из фрагмента

function updateCurrentClasses(target) {
  const isHollywood = target === elements.hollywoodLink;

  elements.hollywoodLink.classList[isHollywood ? "add" : "remove"]("current");
  elements.mainLink.classList[!isHollywood ? "add" : "remove"]("current");
  elements.photographyLink.classList[!isHollywood ? "add" : "remove"](
    "current",
  );
} // Функция обновления классов current
function setupNavigationHandlers() {
  const handlers = [
    elements.mainLink,
    elements.photographyLink,
    elements.hollywoodLink,
  ];

  handlers.forEach((element) => {
    element.addEventListener("click", () => handleClick(element));
  });
} // Нажатия на кнопки навигации
function handleClick(target) {
  clearContent();
  updateCurrentClasses(target);
  window.scrollTo(0, 0);

  if (!isHollywood(camelCase(target.textContent))) {
    insertBlock(elements.introTemplate, elements.main);

    document.querySelector(".brand-name").textContent =
      "Greg Williams Photography";
    document.querySelector(".introVideo source").src =
      `${basicLink}/video/intro.mp4`;

    populateBlockColumns(photography, elements.photographyLink.textContent);
  } else {
    insertBlock(elements.entryContentTemplate, elements.entryContent);

    const randomMagazineNum = Math.floor(Math.random() * magazines) + 1;

    const basePath = `${basicLink}/images/${url(target.textContent)}/magazine`;

    const img = document.querySelector(".block-image img");
    img.style.opacity = "0";
    img.src = `${basicLink}/images/${url(
      target.textContent,
    )}/magazine/full/${randomMagazineNum}.jpg`;
    img.srcset = sizes
      .map((s) => `${basePath}/${s.path}/${randomMagazineNum}.jpg ${s.width}w`)
      .join(", ");
    img.sizes = "100vw";
    img.alt = target.textContent;
    setupImageWithContainer(img);

    populateBlockColumns(hollywoodAuthentic, target.textContent);
  }
} // Сама функция нажатия на кнопки навигации

function populateBlockColumns(data, target) {
  const items = Object.entries(data).map(([key, value]) => ({ key, value }));

  const splitIndex = isHollywood(url(target))
    ? Math.floor(items.length / 2)
    : Math.ceil(items.length / 2);

  const column1 = createColumnFragment(
    items.slice(0, splitIndex),
    target,
    true,
  );
  const column2 = createColumnFragment(items.slice(splitIndex), target, false);

  elements.blockColumns.replaceChildren(column1, column2);

  if (!elements.blockColumns._clickHandler) {
    const handler = (event) => {
      const figure = event.target.closest(".block-columns-image");
      if (figure) handleBlockColumnsClick(event, url(target));
    };
    elements.blockColumns.addEventListener("click", handler);
    elements.blockColumns._clickHandler = handler;
  }
} // Разбиение блока на колонки
function createColumnFragment(items, target, isFirstColumn) {
  const fragment = document.createDocumentFragment();

  if (isFirstColumn && isHollywood(camelCase(target))) {
    fragment.appendChild(createLogoFigure());
  }

  for (let i = 0; i < items.length; i++) {
    const { key, value } = items[i];
    const clone = elements.blockColumnsTemplate.content.cloneNode(true);
    const figure = clone.querySelector(".block-columns-image");
    const link = figure.querySelector("a");
    const img = figure.querySelector("img");
    const caption = figure.querySelector(".element-caption");

    const randomNum = Math.floor(Math.random() * value) + 1;
    figure.style.opacity = "0";
    link.dataset.name = key;
    img.alt = key;
    img.src = `${basicLink}/images/${url(target)}/${url(
      key,
    )}/thumb/${randomNum}.jpg`;
    setupImageWithContainer(img, figure);
    watchImageForHeight(img);
    window.addEventListener("resize", () => {
      updateResponsiveHeight(img);
    });

    caption.innerHTML = key
      .replace(
        /(\s+)(-|–|—|‐)(\s+|$)/g,
        (_, __, dash, spaceAfter) => `&nbsp;${dash}${spaceAfter || ""}`,
      )
      .split(" ")
      .join("<br>");

    fragment.appendChild(figure);
  }

  return createColumnFromFragment(fragment);
} // Создание фрагмента колонки
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
} // Создание логотипа только для голливудского контента

function handleBlockColumnsClick(event, target) {
  clearContent();
  elements.mainLink.classList.remove("current");
  insertBlock(elements.entryTemplate, elements.entry);
  window.scrollTo(0, 0);

  const currentLink = document.querySelector(".menu-list .current");
  const clickedData =
    event.target.closest(".block-columns-image")?.querySelector("a")?.dataset
      .name || "";
  const entryTitle = document.querySelector(".entry-title");
  const linkInTitle = entryTitle.querySelector("a");

  entryTitle.textContent = "";
  linkInTitle.textContent = currentLink.textContent;
  entryTitle.appendChild(linkInTitle);
  if (currentLink.textContent !== clickedData) {
    entryTitle.append(" > ", clickedData);
  }
  const newLink = linkInTitle.cloneNode(true);
  newLink.addEventListener("click", () => handleClick(currentLink), {
    once: true,
  });
  linkInTitle.replaceWith(newLink);

  const count = isHollywood(camelCase(currentLink.textContent))
    ? hollywoodAuthentic[clickedData]
    : photography[clickedData];

  slidesData.length = 0;
  const indices = Array.from({ length: count }, (_, i) => i + 1);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const firstColumnCount = Math.ceil(indices.length / 2);

  const column1 = createOptimizedColumnFragment(
    indices.slice(0, firstColumnCount),
    clickedData,
    currentLink,
  );
  const column2 = createOptimizedColumnFragment(
    indices.slice(firstColumnCount),
    clickedData,
    currentLink,
  );

  elements.blockColumns.replaceChildren(column1, column2);
} // Клик по элементу изначальной колонки
function createOptimizedColumnFragment(indices, dataName, basePath) {
  const fragment = document.createDocumentFragment();
  const startIndex = slidesData.length;
  const baseImagePath = `${basicLink}/images/${url(basePath.textContent)}/${url(
    dataName,
  )}`;

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const globalIndex = startIndex + i;

    const figure = document.createElement("figure");
    figure.dataset.slideIndex = globalIndex;
    figure.classList.add("wp-block-image");

    const img = document.createElement("img");
    img.style.opacity = "0";
    img.src = `${baseImagePath}/thumb/${index}.jpg`;
    img.alt = dataName;
    img.loading = "lazy";
    setupImageWithContainer(img);
    watchImageForHeight(img);
    window.addEventListener("resize", () => {
      updateResponsiveHeight(img);
    });

    slidesData[globalIndex] = {
      src: `${baseImagePath}/full/${index}.jpg`,
      srcset: sizes
        .map((s) => `${baseImagePath}/${s.path}/${index}.jpg ${s.width}w`)
        .join(", "),
      alt: dataName,
      originalIndex: index,
    };

    figure.appendChild(img);
    figure.addEventListener("click", () =>
      openGalleryPopupForColumn(globalIndex),
    );
    fragment.appendChild(figure);
  }

  return createColumnFromFragment(fragment);
} // Создание фрагмента углубленной колонки
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
} // Создание изображения в попапе
function openGalleryPopupForColumn(index) {
  currentSlideIndex = index;
  openPopup(elements.popup);
  addCloseOverlayListener(elements.popup);
  showSlide(currentSlideIndex);
}
// Открытие конкретного попапа

function openPopup(popup) {
  const body = document.body;
  const scrollPosition = window.scrollY;

  body.dataset.scrollPosition = scrollPosition;
  body.style.top = `-${scrollPosition}px`;
  body.classList.add("scroll-lock");
  popup.classList.add("popup_is-opened");

  updateNavigationButtons();
  setupPopupHandlers();
  document.addEventListener("keydown", handleKeyPress);
} // Открытие popup
function closePopup(popup) {
  const body = document.body;
  const scrollPosition = body.dataset.scrollPosition;
  body.style.top = "";
  body.classList.remove("scroll-lock");
  window.scrollTo(0, scrollPosition);
  popup.classList.remove("popup_is-opened");

  popup.querySelectorAll("img").forEach((img) => {
    img.remove();
  });

  document.removeEventListener("keydown", handleKeyPress);
} // Закрытие popup
function addCloseOverlayListener(element) {
  element.addEventListener("click", (e) => {
    if (!e.target.closest(".arrows, .close")) {
      closePopup(elements.popup);
    }
  });
} // Закрытие попапа при нажатии куда угодно кроме кнопок навигации
function nextSlide() {
  if (currentSlideIndex < slidesData.length - 1) {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  }
} // Следующий слайд
function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
  }
} // Предыдущий слайд
function updateNavigationButtons() {
  elements.prevButton.classList.toggle("non-active", currentSlideIndex === 0);
  elements.nextButton.classList.toggle(
    "non-active",
    currentSlideIndex === slidesData.length - 1,
  );
} // Активная ли кнопка перелистывания слайдов
function handleKeyPress(e) {
  if (!elements.popup.classList.contains("popup_is-opened")) return;

  switch (e.key) {
    case "Escape":
      closePopup(elements.popup);
      break;
    case "ArrowLeft":
      prevSlide();
      break;
    case "ArrowRight":
      nextSlide();
      break;
  }
} // Нажатия на клавиши
function setupPopupHandlers() {
  elements.closeButton.addEventListener("click", () =>
    closePopup(elements.popup),
  );
  elements.prevButton.addEventListener("click", prevSlide);
  elements.nextButton.addEventListener("click", nextSlide);
} // Использование обработчиков

document.addEventListener("DOMContentLoaded", () => {
  setupNavigationHandlers();
  handleClick(elements.mainLink);
});
