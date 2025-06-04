const accessKey = "wo8fKPVNGFISAxIcUfmfWO3s3pPxnrcbEdVt0cnTpro";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMore = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if (page === 1) {
        searchResults.innerHTML = "";
    }

    results.forEach(result => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-result");

        const image = document.createElement('img');
        image.src = result.urls.small;
        image.alt = result.alt_description || "Unsplash Image";
        image.setAttribute("data-full", result.urls.full); // ⭐️ Store full res image

        const imageLink = document.createElement('a');
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description || "View on Unsplash";

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        searchResults.appendChild(imageWrapper);
    });

    page++;
    if (page > 1) {
        showMore.style.display = "block";
    }
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMore.addEventListener("click", () => {
    searchImages();
});

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const downloadBtn = document.getElementById("download-btn");
const closeModal = document.querySelector(".close");

searchResults.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
        const img = event.target;
        const fullImageURL = img.dataset.full; // ✅ Use full URL

        modal.style.display = "block";
        modalImg.src = fullImageURL;
        modalImg.alt = img.alt;

        // ✅ Use fullImageURL for download
        downloadBtn.onclick = async function () {
            try {
                const response = await fetch(fullImageURL);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = img.alt || "downloaded-image";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (err) {
                alert("Image download failed.");
                console.error(err);
            }
        };
    }
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});