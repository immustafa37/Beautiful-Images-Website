const accessKey = "wo8fKPVNGFISAxIcUfmfWO3s3pPxnrcbEdVt0cnTpro";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMore = document.getElementById("show-more-button");

let inputData = "";
let page = 1;
let totalPages = 1; // total pages from API

async function searchImages() {
    if (inputData.trim() === "") return; // Prevent empty searches

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}&per_page=9`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        totalPages = data.total_pages; // total pages from API

        // If page = 1, clear previous results
        if (page === 1) {
            searchResults.innerHTML = "";
        }

        const results = data.results;

        results.forEach(result => {
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add("search-result");

            const image = document.createElement('img');
            image.src = result.urls.small;
            image.alt = result.alt_description || "Unsplash Image";
            image.setAttribute("data-full", result.urls.full);

            const imageLink = document.createElement('a');
            imageLink.href = result.links.html;
            imageLink.target = "_blank";
            imageLink.textContent = result.alt_description || "View on Unsplash";

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(imageLink);
            searchResults.appendChild(imageWrapper);
        });

        // Show or hide the "Show More" button based on pages left
        if (page < totalPages) {
            showMore.style.display = "block";
        } else {
            showMore.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        alert("Failed to load images. Please try again later.");
    }
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    inputData = inputEl.value.trim();
    page = 1;
    searchImages();
});

showMore.addEventListener("click", () => {
    if (page < totalPages) {
        page++;
        searchImages();
    }
});

// Modal and download functionality remains same
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const downloadBtn = document.getElementById("download-btn");
const closeModal = document.querySelector(".close");

searchResults.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
        const img = event.target;
        const fullImageURL = img.dataset.full;

        modal.style.display = "block";
        modalImg.src = fullImageURL;
        modalImg.alt = img.alt;

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
