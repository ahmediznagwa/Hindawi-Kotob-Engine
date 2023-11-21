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
  // for demo only
  // window.addEventListener("load", async () => {
  //   // const bookId = "40262648"; // hindawi;
  //   // const bookId = "16264295"; // hindawi;
  //   // const bookId = "69058261"; // publisher;
  //   const bookId = "42581692"; // hindawi;
  //   const readerConfig: IReaderConfig = {
  //     bookId,
  //     paddingTop: 0,
  //     paddingBottom: 0,
  //     isIphone: false,
  //     bookTitle: "شلن واحد من أجل الشموع",
  //   };
  //   Promise.all([
  //     fetch(`./books/${bookId}/Content.main`).then((res) => res.text()),
  //     fetch(`./books/${bookId}/toc.nav`).then((res) => res.text()),
  //   ]).then(([res1, res2]) => {
  //     controller.initWithChapters(
  //       `{
  //         "bookId": "${readerConfig.bookId}",
  //         "paddingTop": ${readerConfig.paddingTop},
  //         "paddingBottom": ${readerConfig.paddingBottom},
  //         "bookTitle": "${readerConfig.bookTitle}"
  //       }`,
  //       res1,
  //       `./books/${readerConfig.bookId}`,
  //       res2
  //     );
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
}

$(window).on("resize", () => {
  controller?.book?.currentChapter?.hideActionsMenu();
});
