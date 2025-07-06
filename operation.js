(function () {
  "use strict";

  const el = function (element) {
    return element.charAt(0) === "#"
      ? document.querySelector(element)
      : document.querySelectorAll(element);
  };

  const viewer = el("#viewer"),
    equals = el("#equals"),
    nums = el(".num"),
    ops = el(".ops"),
    resetBtn = el("#reset"),
    calculator = el("#calculator");

  let theNum = "",
    oldNum = "",
    resultNum,
    operator,
    justCalculated = false;

  const setNum = function () {
    const digit = this.getAttribute("data-num");

    if (resultNum && !justCalculated) {
      theNum = digit;
      resultNum = "";
    } else {
      if (justCalculated) theNum = "";
      if (digit === "." && theNum.includes(".")) return;
      theNum += digit;
    }

    viewer.innerHTML = theNum;
    justCalculated = false;
  };

  const moveNum = function () {
    if (theNum === "") return;
    oldNum = theNum;
    theNum = "";
    operator = this.getAttribute("data-ops");
    equals.setAttribute("data-result", "");
  };

  const displayNum = function () {
    oldNum = parseFloat(oldNum);
    theNum = parseFloat(theNum);

    switch (operator) {
      case "plus":
        resultNum = oldNum + theNum;
        break;
      case "minus":
        resultNum = oldNum - theNum;
        break;
      case "times":
        resultNum = oldNum * theNum;
        break;
      case "divided by":
        resultNum = oldNum / theNum;
        break;
      default:
        resultNum = theNum;
    }

    resultNum = parseFloat(resultNum.toFixed(10));

    if (!isFinite(resultNum)) {
      if (isNaN(resultNum)) {
        resultNum = "Error";
      } else {
        resultNum = "Подивись правила ділення";
        calculator.classList.add("broken");
        resetBtn.classList.add("show");
      }
    }

    viewer.innerHTML = resultNum;
    equals.setAttribute("data-result", resultNum);
    oldNum = 0;
    theNum = resultNum;
    justCalculated = true;
  };

  const clearAll = function () {
    oldNum = "";
    theNum = "";
    resultNum = "";
    viewer.innerHTML = "0";
    equals.setAttribute("data-result", "");
    justCalculated = false;
  };

  resetBtn.onclick = function (e) {
    e.preventDefault();
    calculator.classList.remove("broken");
    this.classList.remove("show");
    clearAll();
  };

  nums.forEach(btn => btn.addEventListener("click", setNum));
  ops.forEach(btn => btn.addEventListener("click", moveNum));
  equals.addEventListener("click", displayNum);
  el("#clear").addEventListener("click", clearAll);

  // Підтримка клавіатури
  document.addEventListener("keydown", function (e) {
    const key = e.key;

    if (!isNaN(key) || key === ".") {
      const button = [...nums].find(b => b.getAttribute("data-num") === key);
      if (button) button.click();
    }

    if (["+", "-", "*", "/"].includes(key)) {
      const map = {
        "+": "plus",
        "-": "minus",
        "*": "times",
        "/": "divided by"
      };
      const button = [...ops].find(b => b.getAttribute("data-ops") === map[key]);
      if (button) button.click();
    }

    if (key === "Enter" || key === "=") {
      e.preventDefault();
      equals.click();
    }

    if (key === "Escape" || key.toLowerCase() === "c") {
      clearAll();
    }
  });
})();
