// index.js

import {
  isName,
  checkStatus,
  showToast,
  setCurrentDate,
  meal_dt_ck_point,
  setInitMealDate,
  showUserDetails,
} from "./functions.js";

window.addEventListener("DOMContentLoaded", () => {
  const newBtn = document.querySelector(".newBtn");
  const userDetails = document.querySelector(".user-details");
  const okBtn = document.querySelector(".okBtn");
  const cancelBtn = document.querySelector(".cancelBtn");
  const userName = document.querySelector(".name");
  const number = document.querySelector(".number");
  const allUserList = document.querySelector(".allUsers");
  const mealNumber = document.querySelector(".mealNumber");
  const status = document.querySelector(".status");
  const mainBoxHeading = document.querySelector(".mainBoxHeading");
  const alert = document.querySelector(".alert");
  const alertText = document.querySelector(".alertText");
  const downloadPdf = document.getElementById("downloadPdf");
  const manage = document.querySelector(".manage");
  const currentDate = document.querySelector("#currentDate");
  const initMealDate = document.querySelector("#initialMealDate");
  const mode = document.querySelector("#mode");
  const logo = document.querySelector("#logo");

  // mode.addEventListener("click", () => {
  //   if (mode.src.includes("dark.png")) {
  //     mode.src = "assets/light.png";
  //     document.body.style.backgroundColor = "black";
  //     logo.style.filter = "invert(1)";
  //     document.cookie = "mode=dark";
  //   } else {
  //     mode.src = "assets/dark.png";
  //     document.body.style.backgroundColor = "white";
  //     logo.style.filter = "invert(0)";
  //     document.cookie = "mode=light";
  //   }
  // });

  newBtn.addEventListener("click", () => {
    newBtn.classList.add("hidden");
    userDetails.classList.remove("hidden");
  });
  mealNumber.addEventListener("change", () => {
    showToast(alert, alertText, "Meal number changed.");
  });

  cancelBtn.addEventListener("click", () => {
    newBtn.classList.remove("hidden");
    userDetails.classList.add("hidden");
  });
  initMealDate.addEventListener("change", () => {
    setInitMealDate(initMealDate);
  });
  okBtn.addEventListener("click", async () => {
    const user = { userName: userName.value, number: number.value };

    if (user.userName === "" || user.number === "") {
      showToast("Please fill all the fields", "error");
      return;
    }

    if (parseInt(user.number) < 0) {
      showToast("Meal number cannot be negative.", "error");
      return;
    }

    if (!isName(user.userName)) {
      showToast(
        "Invalid name. Only alphabetic characters are allowed",
        "error"
      );
      return;
    }

    try {
      const response = await fetch("/api/add-person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: user.userName, meal: user.number }),
      });

      const result = await response.json();

      if (response.ok) {
        showUserDetails();
        userName.value = "";
        number.value = "";
        newBtn.classList.remove("hidden");
        userDetails.classList.add("hidden");
        showToast(result.message);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred. Please try again.", "error");
    }
  });

  // downloadPdf.addEventListener("click", () => {
  //   html2pdf().from(manage).save();
  // });

  window.addEventListener("keypress", (e) => {
    if (!userDetails.classList.contains("hidden")) {
      if (e.key === "Enter") {
        okBtn.click();
      }
    }
  });

  showUserDetails();
  //Initial meal date check point
  checkStatus(allUserList, mainBoxHeading, status, downloadPdf);
  //Initial meal date check point
  meal_dt_ck_point(initMealDate);
  //Check mode
  // modeCheck();
  //Set current date
  setCurrentDate(currentDate);
});
