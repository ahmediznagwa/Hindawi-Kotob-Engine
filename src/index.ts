import { IReaderConfig } from "./Models/IReaderConfig.model";
import { Controller } from "./Modules/Controller";
declare global {
  interface Window {
    hindawiReaders: any;
  }
}
let controller = new Controller();
export const hindawiReaders = (function () {
  controller = new Controller();
  // Demo [START]
  window.addEventListener("load", async () => {
    // const bookId = "40262648"; // hindawi;
    // const bookId = "16264295"; // hindawi;
    // const bookId = "69058261"; // publisher;
    // const bookId = "42581692"; // hindawi;
    const bookId = "74718574"; // hindawi;
    const readerConfig: IReaderConfig = {
      bookId,
      paddingTop: 20,
      paddingBottom: 0,
      isIphone: true,
      bookTitle: "شلن واحد من أجل الشموع",
    };
    Promise.all([
      fetch(`./books/${bookId}/Content.main`).then((res) => res.text()),
      fetch(`./books/${bookId}/toc.nav`).then((res) => res.text()),
    ]).then(([res1, res2]) => {
      controller.initWithChapters(
        `{
          "bookId": "${readerConfig.bookId}",
          "paddingTop": ${readerConfig.paddingTop},
          "paddingBottom": ${readerConfig.paddingBottom},
          "isIphone": ${readerConfig.isIphone},
          "bookTitle": "${readerConfig.bookTitle}"
        }`,
        res1,
        `./books/${readerConfig.bookId}`,
        res2
      );
    });
  });
  // Demo [END]
  return {
    init: controller.initWithChapters.bind(controller),
    nextPage: controller.goToNextPage.bind(controller),
    prevPage: controller.goToPrevPage.bind(controller),
    nextChapter: controller.goToNextChapter.bind(controller),
    prevChapter: controller.goToPrevChapter.bind(controller),
  };
})();

window.hindawiReaders = hindawiReaders;

// Dropdown Menu
// initDropdowns();
// function initDropdowns() {
//   $(".dropdown-toggle").each(function () {
//     const dropdownToggle = $(this);
//     const dropdownContainer = dropdownToggle.closest(".dropdown");
//     dropdownToggle.on("click", function () {
//       _showDropdownMenu(dropdownContainer);
//     });
//   });
// }

// function _showDropdownMenu(dropdownContainer) {
//   if (dropdownContainer.hasClass("show")) {
//     dropdownContainer.removeClass("show");
//     return;
//   }
//   $(".dropdown").removeClass("show");
//   dropdownContainer.addClass("show");
// }

// Dropdown Menu
const dropdownToggle = document.querySelectorAll(".dropdown-toggle");
dropdownToggle.forEach(function (dropdownToggle) {
  dropdownToggle.addEventListener("click", function (e) {
    let dropdownContainer = dropdownToggle.closest(".dropdown");
    if (dropdownContainer.classList.contains("show")) {
      dropdownContainer.classList.remove("show");
      return;
    }
    dropdownContainer.classList.remove("show");
    dropdownContainer.classList.add("show");
  });
});

// tabs
// $("[data-type='tab']").each(function () {
//   const el = $(this);
//   const tab = "#" + $(this).attr("data-target");

//   el.on("click", function () {
//     $(".tab-item").removeClass("active-tab");
//     el.addClass("active-tab");
//     $(".tab-content").removeClass("active");
//     $(tab).addClass("active");
//   });
// });
let allTabsTriggers = document.querySelectorAll("[data-type='tab']");
allTabsTriggers.forEach((tabTrigger) => {
  const target = `#${tabTrigger.getAttribute("data-target")}`;
  tabTrigger.addEventListener("click", function (e) {
    let tabsButtons = document.querySelectorAll(".tab-item");
    document.querySelector(".tab-content.active").classList.remove("active");
    document.querySelector(target).classList.add("active");
    document.querySelector(".tab-item.active-tab").classList.remove("active-tab");
    // document.querySelector(tabsButtons).classList.add("active-tab");
  });
});
// panels
let allPanelsTriggers = document.querySelectorAll("[data-type='panel']");
allPanelsTriggers.forEach((panelTrigger) => {
  const targetId = `#${panelTrigger.getAttribute("data-target")}`;
  panelTrigger.addEventListener("click", function (e) {
    document.querySelector(".side-panel").classList.remove("show");
    document.querySelector(targetId).classList.add("show");
  });
});

// $(".hide-side-panel").on("click", function (e) {
//   e.stopPropagation();
//   $(".side-panel").removeClass("show");
// });

const hidePanel = document.querySelectorAll(".hide-side-panel");
const panel = document.getElementsByClassName("side-panel");
hidePanel.forEach((button) => {
  button.addEventListener("click", () => {
    for (var i = 0; i < hidePanel.length; i++) {
      panel[i].classList.remove("show");
    }
  });
});

// $(document).on("keydown", function (e: any) {
//   if (e.key === "Escape") {
//     controller.hideToolbar();
//     controller?.book?.currentChapter?.hideActionsMenu();
//   }
// });

document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
  var keyCode = e.keyCode;
  if (keyCode == 27) {
    controller.hideToolbar();
    controller?.book?.currentChapter?.hideActionsMenu();
  }
}

$("body").on("click", function () {
  controller.toggleOverlay();
  controller?.book?.currentChapter?.hideActionsMenu();
});

$(".app-bar, .actions-menu").on("click", function (e) {
  e.stopPropagation();
});

// if ($(".app-bar").length) {
//   let isHovering = false;
//   let timer;

//   $("body").on("mousemove", function () {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       if (isHovering) {
//         return;
//       }
//       controller.hideToolbar();
//     }, 4000);
//   });
// }

function appBars() {
  let isHovering = false;
  let timer;
  let wholeContainer = document.getElementsByTagName("body")[0];
  wholeContainer.addEventListener("mousemove", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (isHovering) {
        return;
      }
      controller.hideToolbar();
    }, 4000);
  });
}
appBars();

// $(window).on("resize", () => {
//   controller?.book?.currentChapter?.hideActionsMenu();
//   console.log("resizing")
// });

function windowSize() {
  controller?.book?.currentChapter?.hideActionsMenu();
}
window.onresize = windowSize;
