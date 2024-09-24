const allUserList = document.querySelector(".allUsers");
const status = document.querySelector(".status");
const mainBoxHeading = document.querySelector(".mainBoxHeading");
const downloadPdf = document.getElementById("downloadPdf");
const mode = document.querySelector("#mode");
const logo = document.querySelector("#logo");

export function isName(userName) {
  const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
  return regex.test(userName);
}

export function checkStatus(allUserList, mainBoxHeading, status, downloadPdf) {
  if (allUserList.textContent === "") {
    mainBoxHeading.classList.add("hidden");
    status.classList.remove("hidden");
    status.classList.add("flex");
    // downloadPdf.classList.add("hidden");
  } else {
    mainBoxHeading.classList.remove("hidden");
    status.classList.add("hidden");
    status.classList.remove("flex");
    // downloadPdf.classList.remove("hidden");
  }
}

export function alertMsg(alert, alertText, msg) {
  alert.classList.remove("hidden");
  alertText.textContent = msg;
  setTimeout(() => {
    alert.classList.add("hidden");
  }, 3000);
}

export function createUser(user) {
  const { userName, number } = user;
  if (localStorage.getItem(userName)) {
    alertMsg("User already exists");
    return;
  }
  localStorage.setItem(userName, number);
}
export function setCurrentDate(element) {
  const today = new Date().toISOString().split("T")[0];
  element.value = today;
}

export function setInitMealDate(element) {
  const dateValue = element.value;
  document.cookie = `initial_meal_date=${encodeURIComponent(
    dateValue
  )}; path=/`;
}

export function meal_dt_ck_point(element) {
  const today = new Date().toISOString().split("T")[0];
  const cookies = document.cookie;
  const cookiesArray = cookies.split("; ");
  const targetCookie = cookiesArray.find((cookie) =>
    cookie.startsWith("initial_meal_date=")
  );

  const mealDate = targetCookie ? targetCookie.split("=")[1] : today;
  element.value = decodeURIComponent(mealDate);

  setInitMealDate(element);
}

export function getMode() {
  const cookies = document.cookie;
  const cookiesArray = cookies.split("; ");
  const modeCookie = cookiesArray.find((c) => c.startsWith("mode="));
  if (modeCookie) {
    return modeCookie.split("=")[1];
  }
  return null;
}

// export function modeCheck() {
//   if (getMode() === null) {
//     document.cookie = "mode=light";
//   } else {
//     mode.src = `assets/${getMode()}.png`;
//     if (getMode() === "dark") {
//       document.body.style.backgroundColor = "black";
//       logo.style.filter = "invert(1)";
//     } else {
//       document.body.style.backgroundColor = "white";

//     }
//   }
// }
export const showUserDetails = async () => {
  try {
    const response = await fetch("/api/get-all-people", {
      method: "GET",
      credentials: "include", // Include cookies in the request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const { people } = await response.json();
    allUserList.innerHTML = "";

    people.sort((a, b) => a.name.localeCompare(b.name));

    people.forEach((person) => {
      const li = document.createElement("li");
      li.className = "justify-evenly flex bg-white my-2 rounded-md";

      const spanX = document.createElement("span");
      spanX.className = "flex items-center hover:text-red-500 cursor-pointer";
      spanX.textContent = "X";
      spanX.onclick = () => {
        const confirmation = confirm("Are you sure you want to delete this?");
        if (confirmation) {
          deletePerson(person.name);
        }
      };
      li.appendChild(spanX);

      const name = document.createElement("span");
      name.className = "name w-[60%] text-xl flex items-center";
      name.textContent = person.name;
      li.appendChild(name);

      const number = document.createElement("span");
      number.className = "justify-center flex w-[20%]";
      const inputNumber = document.createElement("input");
      inputNumber.className = "meal w-full p-2 border-2";
      inputNumber.value = person.meal;
      inputNumber.type = "number";
      inputNumber.onchange = () => {
        if (inputNumber.value === "") {
          inputNumber.value = 0;
        }
        updateMeal(person.name, inputNumber.value); // Call the update function
      };

      number.appendChild(inputNumber);
      li.appendChild(number);

      allUserList.appendChild(li);
    });

    checkStatus(allUserList, mainBoxHeading, status, downloadPdf);
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    showToast("Failed to load user details.", "error");
  }
};
// toast.js
export function showToast(
  message,
  type = "success",
  duration = 3000,
  options = {}
) {
  const colors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
  };

  Toastify({
    text: message,
    duration: duration,
    gravity: "top",
    position: "left",
    backgroundColor: colors[type] || colors.success,
    close: true,
    stopOnFocus: true,
    ...options,
  }).showToast();
}
export const deletePerson = async (personName) => {
  try {
    const response = await fetch("/api/delete-person", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name: personName }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete person");
    }

    showUserDetails();
  } catch (error) {
    console.error("Error deleting person:", error.message);
    showToast("Failed to delete person.", "error");
  }
};

export const updateMeal = async (personName, newMeal) => {
  try {
    const response = await fetch("/api/update-meal", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
      body: JSON.stringify({ name: personName, meal: newMeal }), // Assuming personName is the name
    });

    if (!response.ok) {
      throw new Error("Failed to update person");
    }

    showUserDetails(); // Refresh the list
  } catch (error) {
    console.error("Error updating person:", error.message);
    showToast("Failed to update person.", "error");
  }
};

window.deleteItem = async function (name, price) {
  const response = await fetch("/api/delete-food-item", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, price }),
  });
  if (response.ok) {
    showToast("Item deleted successfully.", "success");
    fetchFoodItems(); // Refresh the list
  } else {
    showToast("Failed to delete item.", "error");
  }
};
export const loadNavbar = () => {
  const navbarContainer = document.querySelectorAll("#navbar");

  fetch("/get/navbar")
    .then((response) => response.text())
    .then((data) => {
      navbarContainer.forEach((navbar) => {
        navbar.innerHTML = data;
      });
    })
    .catch((error) => console.error("Error loading navbar:", error));
};
export async function fetchFoodItems() {
  const response = await fetch("/api/get-food-items");
  const items = await response.json();
  const foodItems = document.getElementById("foodItems");

  foodItems.innerHTML = `
      <li class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <div class="flex-1 text-center font-semibold">State</div>
        <div class="flex-1 text-center font-semibold">Name</div>
        <div class="flex-1 text-center font-semibold">Price</div>
      </li>`;

  if (items.length > 0) {
    items.forEach((item) => {
      const newItem = document.createElement("li");
      newItem.className =
        "bg-white p-4 rounded-lg shadow-md flex justify-between items-center";
      newItem.innerHTML = `
          <div class="flex-1 text-center">${item.state}</div>
          <div class="flex-1 text-center">${item.name}</div>
          <div class="flex-1 text-center">৳${item.price.toFixed(2)}</div>
          <button class="text-red-500 hover:text-red-700" onclick="deleteItem('${
            item.name
          }', ${item.price})">X</button>
        `;
      foodItems.appendChild(newItem);
    });
  } else {
    const noItems = document.createElement("li");
    noItems.className =
      "bg-white p-4 rounded-lg shadow-md flex justify-between items-center";
    noItems.innerHTML = `
        <div class="flex-1 text-center">No items added yet.</div>
      `;
    foodItems.appendChild(noItems);
  }
}
export const addBtnEvent = async () => {
  const stateInput = document.getElementById("state");
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");

  const state = stateInput.value;
  let name = nameInput.value;
  let price = parseFloat(priceInput.value);

  if (!state || !name || isNaN(price)) {
    showToast("All fields are required.", "error");
    return;
  }

  if (price < 0) {
    showToast("Price must be a positive number.", "error");
    return;
  }

  if (state && name && price >= 0) {
    const response = await fetch("/api/add-food-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state, name, price }),
    });

    if (response.ok) {
      const newItem = document.createElement("li");
      newItem.className =
        "bg-white p-4 rounded-lg shadow-md flex justify-between items-center";
      newItem.innerHTML = `
            <div class="flex-1 text-center">${state}</div>
            <div class="flex-1 text-center">${name}</div>
            <div class="flex-1 text-center">৳${price.toFixed(2)}</div>
            <button class="text-red-500 hover:text-red-700" onclick="deleteItem('${name}', ${price})">X</button>
          `;
      foodItems.appendChild(newItem);

      // Hide modal
      modal.classList.add("hidden");

      // Reset the fields
      stateInput.value = "";
      nameInput.value = "";
      priceInput.value = "";

      // Optionally, you may want to call fetchFoodItems() to refresh the list
      fetchFoodItems();
    } else {
      showToast("Failed to add item.", "error");
    }
  }
};
