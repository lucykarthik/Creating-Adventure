const key = document.querySelector(".little-key");
const openingLine = document.querySelector(".opening-line");

key.addEventListener("click", () => {
    openingLine.classList.add("fade-out");
    key.classList.add("unlocking");
});