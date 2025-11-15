$(function () {
  // Getting all the elements
  let modal = $("#modal");
  let modalClosebtn = $("#modal-close");
  let modalImage = $("#modal-image");
  let modalText = $("#modal-text");
  let modalTitle = $("#modal-title");
  let bookLeft = $(".book.left");
  let bookRight = $(".book.right");
  let arrowleft = $("#left-arrow");
  let arrowright = $("#right-arrow");

  // Hover Effect for the arrows
  arrowleft.on("mouseover", function () {
    arrowleft.attr("src", "/Assets/Images/Recipe Book/ArrowLeftHover.png");
  });
  arrowleft.on("mouseleave", function () {
    arrowleft.attr("src", "/Assets/Images/Recipe Book/ArrowLeft.png");
  });

  arrowright.on("mouseover", function () {
    arrowright.attr("src", "/Assets/Images/Recipe Book/ArrowRightHover.png");
  });
  arrowright.on("mouseleave", function () {
    arrowright.attr("src", "/Assets/Images/Recipe Book/ArrowRight.png");
  });

  function LoadPartial(element, data) {
    for (let index = 0; index < 3; index++) {
      element.append(`<li>${data[index]}</li>`);
    }
  }

  let indexes = [{ left: 0 }, { right: 1 }];
  function loadDataToBook(data) {
    indexes.forEach((index) => {
      let half = Object.keys(index);
      let index1 = Object.values(index);
      let selected_data = data[index1];
      let DataDisplay = $(`
      <div class="book-text">
        <img src="${selected_data.image}" alt="${selected_data.name}" />
        <p>${selected_data.name}</p>
        <div class="ingredients">
          Ingredients:
          <ol id="ingredients-list"></ol>
          <button type="button" id="ingredients-btn">click to show more</button>
        </div>
        <div class="instructions">
          Instructions:
          <ol id="instructions-list">
          </ol>
          <button type="button" id="instructions-btn">
            click to show more
          </button>
        </div>
        <p>Prep Time in Minutes: ${selected_data.prepTimeMinutes}</p>
        <p>Cook Time in Minutes: ${selected_data.cookTimeMinutes}</p>
        <p>Cuisine: ${selected_data.cuisine}</p>
        <p>Rating: ${selected_data.rating}</p>
        <p>Meal Type: ${selected_data.mealType}</p>
      </div>
    `);
      $(`.book.${half}`).prepend(DataDisplay);
      LoadPartial($(`.book.${half} #ingredients-list`), selected_data.ingredients);
      LoadPartial($(`.book.${half} #instructions-list`), selected_data.instructions);

      $("#ingredients-btn").on("click", function () {
        modalImage.attr("src", "");
        modalTitle.text("");
        modalText.empty();
        modal.addClass("open");
        document.body.style.overflow = "hidden";

        modalImage.attr("src", temp.image);
        modalTitle.text(`${temp.name} Ingredients`);
        modalText.append(temp.ingredients.map((i) => `<li>${i}</li>`).join(""));
      });

      $("#instructions-btn").on("click", function () {
        modalImage.attr("src", "");
        modalTitle.text("");
        modalText.empty();
        modal.addClass("open");
        document.body.style.overflow = "hidden";

        modalImage.attr("src", temp.image);
        modalTitle.text(`${temp.name} Instructions`);
        modalText.append(
          temp.instructions.map((i) => `<li>${i}</li>`).join("")
        );
      });
    });
  }

  function DisplayNext(data) {
    if (indexes[1].right < 49) {
      indexes[0].left += 1;
      indexes[1].right += 1;
    }
    indexes.forEach((index) => {
      console.log(index);
    });
    loadDataToBook(data);
  }

  function DisplayPrevious(data) {
    if (indexes[0].left > 0) {
      indexes[0].left -= 1;
      indexes[1].right -= 1;
    }
    indexes.forEach((index) => {
      console.log(index);
    });
    loadDataToBook(data);
  }

  // loading the data from an external JSON File
  $.getJSON("/Assets/Scripts/Data.json", function (data) {
    loadDataToBook(data);
    arrowright.on("click", () => {
      $(".book-text").remove();
      DisplayNext(data);
    });

    arrowleft.on("click", () => {
      $(".book-text").remove();
      DisplayPrevious(data);
    });
  }).fail(function (jqxhr, textstatus, error) {
    console.log(`Failed to load Data.json: ${textstatus}, ${error}`);
  });

  modalClosebtn.on("click", function () {
    modal.removeClass("open");
    document.body.style.overflow = "";
  });

  modal.on("click", function (event) {
    if (
      event.target === modal ||
      event.target.hasAttribute("data-close-modal")
    ) {
      modal.removeClass("open");
      document.body.style.overflow = "";
    }
  });
});
