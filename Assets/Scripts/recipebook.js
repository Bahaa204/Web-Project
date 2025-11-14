$(function () {
  // Hover Effect for the arrows
  let arrowleft = $("#left-arrow");
  let arrowright = $("#right-arrow");

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

  $.getJSON("/Assets/Scripts/Data.json", function (data) {

    console.log(data);
    
  }).fail(function (jqxhr, textstatus, error) {
    console.log(`Failed to load Data.json: ${textstatus}, ${error}`);
  });
});
