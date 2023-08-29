import { Controller } from "./Modules/Controller";
import { json, json4 } from "./Modules/constants";
declare global {
  interface Window {
    hindawiReaders: any;
  }
}
let controller = new Controller();
export const hindawiReaders = (function () {
  controller = new Controller();
  // for demo only
  // window.addEventListener("load", async () => {
  //   // const bookId = '13020208' // publisher;
  //   // const bookId = "30314251"; // hindawi;
  //   // const bookId = "79191640"; // hindawi;
  //   const bookId = "84026414"; // hindawi;
  //   Promise.all([
  //     fetch(`/books/${bookId}/Content.hfbc`).then((res) => res.text()),
  //     fetch(`/books/${bookId}/toc.nav`).then((res) => res.text()),
  //   ]).then(([res1, res2]) => {
  //     controller.initWithChapters(bookId, res1, `/books/${bookId}`, res2);
  //   });
  // });
  return {
    init: controller.initWithChapters.bind(controller),
  };
})();

window.hindawiReaders = hindawiReaders;

// Dropdown Menu
initDropdowns();
function initDropdowns() {
  $(".dropdown-toggle").each(function () {
    const dropdownToggle = $(this);
    const dropdownContainer = dropdownToggle.closest(".dropdown");
    dropdownToggle.on("click", function () {
      _showDropdownMenu(dropdownContainer);
    });
  });
}

function _showDropdownMenu(dropdownContainer) {
  if (dropdownContainer.hasClass("show")) {
    dropdownContainer.removeClass("show");
    return;
  }
  $(".dropdown").removeClass("show");
  dropdownContainer.addClass("show");
}

$(document).on("keydown", function (e: any) {
  if (e.key === "Escape") {
    $(".dropdown").removeClass("show");
    $(".bottom-bar").slideUp();
    $(".hide-fonts").trigger("click");
    controller.book.currentChapter.hideActionsMenu();
  }
});
$("body").on("click", function () {
  $(".dropdown").removeClass("show");
  $(".bottom-bar").slideToggle();
  $(".hide-fonts").trigger("click");
  controller.book.currentChapter.hideActionsMenu();
});
$(".dropdown, .bottom-bar").on("click", function (e) {
  e.stopPropagation();
});
