$(document).ready(function () {
  // Set current year
  $("#current-year").text(new Date().getFullYear());
  console.log($("#current-year").length); // Should print 1
  // Handle scroll events
  $(window).scroll(function () {
    var scroll = $(this).scrollTop();

    // Toggle sticky navbar
    $(".navbar").toggleClass("sticky", scroll > 20);

    // Toggle scroll-to-top button
    $(".scroll-up-btn").toggleClass("show", scroll > 500);
  });

  // Scroll to top
  $(".scroll-up-btn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
  });

  // Toggle mobile menu
  $(".menu-btn").click(function () {
    $(".navbar .manu").toggleClass("active");
    $(this).find("span").toggleClass("active");
  });
});
