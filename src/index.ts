import { Controller } from "./Modules/Controller";
declare global {
  interface Window {
    hindawiReaders: any;
  }
}
let controller = new Controller();
export const hindawiReaders = (function () {
  controller = new Controller();
  // for demo only
  window.addEventListener("load", async () => {
    // const bookId = "40262648"; // hindawi;
    // const bookId = "16264295"; // hindawi;
    // const bookId = "69058261"; // publisher;
    const bookId = "42581692"; // hindawi;

    const bookInfo = {
      bookId,
      bookTitle: "شلن واحد من أجل الشموع",
    };
    Promise.all([
      fetch(`./books/${bookId}/Content.main`).then((res) => res.text()),
      fetch(`./books/${bookId}/toc.nav`).then((res) => res.text()),
    ]).then(([res1, res2]) => {
      controller.initWithChapters(
        bookInfo.bookId,
        bookInfo.bookTitle,
        res1,
        `./books/${bookInfo.bookId}`,
        res2
      );
    });
  });
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

// adding tabs

$("[data-type='tab']").each(function () {
  const el = $(this);
  const tab = "#" + $(this).attr("data-target");
  el.on("click", function () {
    $(".tab-item").removeClass("active-tab");
    el.addClass("active-tab");
    $(".tab-content").removeClass("active");
    $(tab).addClass("active");
  });
});

$(document).on("keydown", function (e: any) {
  if (e.key === "Escape") {
    controller.hideToolbar();
    controller?.book?.currentChapter?.hideActionsMenu();
  }
});
$("body").on("click", function () {
  controller.toggleOverlay();
  controller?.book?.currentChapter?.hideActionsMenu();
});
$(".app-bar, .actions-menu").on("click", function (e) {
  e.stopPropagation();
});

if ($(".app-bar").length) {
  let isHovering = false;
  let timer;

  $("body").on("mousemove", function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (isHovering) {
        return;
      }
      controller.hideToolbar();
    }, 4000);
  });
  $(".app-bar").on("mouseenter", function () {
    isHovering = true;
  });
  $(".app-bar").on("mouseleave", function () {
    isHovering = false;
  });
}

$(window).on("resize", () => {
  controller?.book?.currentChapter?.hideActionsMenu();
});
