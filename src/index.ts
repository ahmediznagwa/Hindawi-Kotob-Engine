import { Controller } from "./Modules/Controller";
import { json } from "./Modules/constants";
declare global {
  interface Window {
    hindawiReaders: any;
  }
}
export const hindawiReaders = (function () {
  const controller = new Controller();
  // window.addEventListener("load", () => {
  //   controller.initWithChapters("packages/life_prison", json);
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
    $(".actions-menu").remove();
    $(".bottom-bar").slideUp();
    $(".hide-fonts").trigger("click");
  }
});
$("body").on("click", function () {
  $(".actions-menu").remove();
  $(".dropdown").removeClass("show");
  $(".bottom-bar").slideToggle();
  $(".hide-fonts").trigger("click");
});
$(".dropdown, .bottom-bar").on("click", function (e) {
  e.stopPropagation();
});
