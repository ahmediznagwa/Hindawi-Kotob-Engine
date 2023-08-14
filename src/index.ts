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
  // window.addEventListener("load", () => {
  //   controller.initWithChapters("packages/life_prison", json);
  // });
  return {
    init: controller.initWithChapters.bind(controller),
    initHTML: controller.initWithPath.bind(controller),
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
