/**
 * Author: Moataz Amer Hassan
 * Date: 2023-08-30
 * Description:
 *   This is a simple JavaScript code snippet that uses the SweetAlert 2, Bootstrap, Font awesome and local storage to create a bookmarking website.
 *   It allows users to add, edit, and delete bookmarks, and stores the bookmarks in local storage.
 *   The code also includes a search feature that allows users to filter bookmarks by name or URL.
 *   The code also includes a theme toggle that allows users to switch between light and dark themes.
 * 
 * Thanks to Route Academy [Israa Ismail , Mostafa El-saidy] for help and guide me to do this.
 * Thanks to SweetAlert 2 for the alert messages.
 * Thanks to Bootstrap and Font Awesome for the icons and CSS styling.
 * Thank for using this code snippet!
 */

// DOM elements
const siteNameInput = document.querySelector("#siteNameInput");
const siteUrlInput = document.querySelector("#siteUrlInput");
const siteName = document.querySelector("#siteName");
const siteUrlLink = document.querySelector("#siteUrlLink");
const siteUrlAddDateElement = document.querySelector("#siteUrlAddDate");
const siteUrlAddDateValue = new Date();

// Global variables
let allSites = [];
let listOfBookmarks = [];

// Get submit button
const submitButton = document.querySelector("#submit");

// Add new bookmark
submitButton.onclick = (event) => {
  event.preventDefault();
  const siteNameValue = siteNameInput.value.trim();
  const siteUrlValue = siteUrlInput.value.trim();
  const nameRegex = /^[a-zA-Z0-9\s-]+$/;
  const urlRegex = /^https?:\/\/[\w\d./]+$/;
  if (!siteNameValue || !siteUrlValue) {
    showValidationError("Please enter name and URL");
    return;
  }
  if (!nameRegex.test(siteNameValue)) {
    document.querySelector("#siteNameHelp").textContent =
      "Name should only contain letters, numbers, spaces, and dashes";
    return;
  }
  if (!urlRegex.test(siteUrlValue)) {
    document.querySelector("#siteUrlHelp").textContent =
      "URL should be in the format http(s)://example.com";
    return;
  }
  addNewBookmark(event);
};

// Load bookmarks on page load
document.addEventListener("DOMContentLoaded", loadBookmarks);

// Load bookmarks from local storage on page load
function loadBookmarks() {
  const savedBookmarks = localStorage.getItem("bookmarks");
  if (savedBookmarks) {
    allSites = JSON.parse(savedBookmarks);
    listOfBookmarks = [...allSites]; // Create a copy for search reset
    displayBookmarks();
  }
}

// Add new bookmark
function addNewBookmark(event) {
  event.preventDefault(); // Prevent default form submission
  const siteNameValue = siteNameInput.value.trim();
  const siteUrlValue = siteUrlInput.value.trim();

  if (!siteNameValue || !siteUrlValue) {
    showValidationError("Error");
    return;
  }

  // Show success message
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Bookmark added successfully",
    showConfirmButton: false,
    timer: 1500,
  });

  // Add new bookmark
  const bookmarks = {
    siteName: siteNameValue.charAt(0).toUpperCase() + siteNameValue.slice(1),
    siteUrl: siteUrlValue,
    siteUrlAddDate: siteUrlAddDateValue.toLocaleString(),
    id: Date.now(),
    color: getRandomColor(),
  };

  allSites.push(bookmarks);
  displayBookmarks();
  clearBookmarksFields();
  saveToLocalStorage();
}

// Generate random color
function getRandomColor() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

// Display bookmarks
function displayBookmarks() {
  const container = document.querySelector("#bookmarksView");
  container.innerHTML = ""; // Clear existing bookmarks
  allSites.forEach((bookmark) => {
    const encodedUrl = encodeURIComponent(bookmark.siteUrl);
    const html = `
            <div class="d-flex text-body-secondary p-3 bg-light">
            <i class="fa-solid fa-link fa-2x me-2" style="color: ${bookmark.color};"></i>
            <div class="pb-3 mb-0 small lh-sm border-bottom w-100">
                <div class="d-flex justify-content-between">
                <strong class="text-gray-dark">${bookmark.siteName}</strong>
                <div>
                    <button class="btn btn-sm btn-outline-primary text-muted" onclick="window.open('${bookmark.siteUrl}', '_blank', 'noopener noreferrer')"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Visit</button>
                    <button class="btn btn-sm btn-outline-warning ms-2" onclick="editBookmark(${bookmark.id})"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</button>
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteBookmark(${bookmark.id})"><i class="fa-solid fa-trash-can me-1"></i>Delete</button>
                </div>
                </div>
                <span class="d-block">${bookmark.siteUrlAddDate}</span>
            </div>
            </div>
        `;
    container.insertAdjacentHTML("beforeend", html);
  });

  // Apply theme toggle
  document.querySelectorAll("#bookmarksView .bg-dark").forEach((element) => {
    element.classList.toggle("bg-light");
    element.classList.toggle("bg-dark");
  });
}

// Delete bookmark
function deleteBookmark(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const index = allSites.findIndex((site) => site.id === id);
      if (index > -1) {
        allSites.splice(index, 1);
        displayBookmarks();
        saveToLocalStorage();

        // Show success message
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Bookmark deleted successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Show error message
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer:
            '<a href="https://example.com/help">Why do I have this issue?</a>',
          showConfirmButton: true,
          confirmButtonText: "Retry",
        });
      }
    }
  });
}

// Edit bookmark
function editBookmark(id) {
  const bookmark = allSites.find((site) => site.id === id);
  if (bookmark) {
    siteNameInput.value = bookmark.siteName;
    siteUrlInput.value = bookmark.siteUrl;
    siteNameInput.focus();
    submitButton.onclick = function () {
      const siteNameValue = siteNameInput.value.trim();
      const siteUrlValue = siteUrlInput.value.trim();
      const nameRegex = /^[a-zA-Z0-9\s-]+$/;
      const urlRegex = /^https?:\/\/[\w\d./]+$/;
      if (!siteNameValue || !siteUrlValue) {
        showValidationError("Please enter name and URL");
        return;
      }
      if (!nameRegex.test(siteNameValue)) {
        document.querySelector("#siteNameHelp").textContent =
          "Name should only contain letters, numbers, spaces, and dashes";
        return;
      }
      if (!urlRegex.test(siteUrlValue)) {
        document.querySelector("#siteUrlHelp").textContent =
          "URL should be in the format http(s)://example.com";
        return;
      }
      bookmark.siteName =
        siteNameValue.charAt(0).toUpperCase() + siteNameValue.slice(1);
      bookmark.siteUrl = siteUrlValue;
      displayBookmarks();
      clearBookmarksFields();
      saveToLocalStorage();
      submitButton.onclick = addNewBookmark;
      submitButton.textContent = "Add to bookmark";
      submitButton.style.backgroundColor = "#0d6efd";
      submitButton.style.color = "#ffffff";

      // Show success message
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Bookmark updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    };
    submitButton.textContent = "Update";
    submitButton.style.backgroundColor = "#ffc107";
    submitButton.style.color = "#000000";
  } else {
    // Show error message
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer:
        '<a href="https://example.com/help">Why do I have this issue?</a>',
      showConfirmButton: true,
      confirmButtonText: "Retry",
    });
  }
}

// Initialize search functionality
document.querySelector("#search").addEventListener("input", (e) => {
  const searchValue = e.target.value.trim().toLowerCase();
  if (searchValue) {
    const filteredBookmarks = listOfBookmarks.filter(
      (bookmark) =>
        bookmark.siteName.toLowerCase().includes(searchValue) ||
        bookmark.siteUrl.toLowerCase().includes(searchValue)
    );
    allSites = filteredBookmarks;
  } else {
    allSites = [...listOfBookmarks]; // Reset to original list
  }
  displayBookmarks();
});

// Clear input fields
function clearBookmarksFields() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
}

// Save bookmarks to local storage
function saveToLocalStorage() {
  localStorage.setItem("bookmarks", JSON.stringify(allSites));
}

// Clear search input
document.querySelector("#search-clear").addEventListener("click", () => {
  document.querySelector("#search").value = "";
  allSites = [...listOfBookmarks]; // Reset to original list
  displayBookmarks();
});

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle("bg-light");
  document.body.classList.toggle("bg-dark");
  document.querySelectorAll(".btn-outline-secondary, .btn-outline-primary, .btn-outline-warning, .btn-outline-danger, body").forEach(button => {
    button.classList.toggle("btn-outline-light");
    button.classList.toggle("btn-outline-dark");
  });
  document.querySelectorAll(".bg-body, .bg-light, .bg-dark").forEach(element => {
    element.classList.toggle("bg-body");
    element.classList.toggle("bg-light");
    element.classList.toggle("bg-dark");
  });
  document.querySelectorAll(".text-body-secondary, .text-gray-dark, .text-light, .text-white, strong").forEach(element => {
    element.classList.toggle("text-body-secondary");
    element.classList.toggle("text-light");
    element.classList.toggle("text-white");
  });
  document.querySelectorAll("label").forEach(element => {
    element.classList.toggle("text-light");
  });
  document.querySelectorAll("#toggle-theme").forEach(element => {
    if (element.querySelector("i").classList.contains("fa-sun")) {
      element.querySelector("i").classList.replace("fa-sun", "fa-moon");
      element.setAttribute("aria-label", "Toggle Light Theme");
    } else {
      element.querySelector("i").classList.replace("fa-moon", "fa-sun");
      element.setAttribute("aria-label", "Toggle Dark Theme");
    }
  });
  document.querySelectorAll("span.d-block").forEach(element => {
    element.classList.toggle("text-dark");
  });
  // Ensure bookmarksView has a dark background in dark mode
  const bookmarksView = document.querySelector("#bookmarksView");
  if (document.body.classList.contains("bg-dark")) {
    bookmarksView.classList.add("bg-dark");
  } else {
    bookmarksView.classList.remove("bg-dark");
  }
  // Ensure search-clear button has white background in dark mode
  const searchClearButton = document.querySelector("#search-clear");
  if (document.body.classList.contains("bg-dark")) {
    searchClearButton.classList.add("bg-white");
  } else {
    searchClearButton.classList.remove("bg-white");
  }
}
