document.addEventListener("scroll", function() {
    var navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 0);
});