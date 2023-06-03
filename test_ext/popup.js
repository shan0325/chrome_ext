/**
 * ---------------------------------------------------------------------------------
 * | 팝업 |
 * ---------------------------------------------------------------------------------
 **/

console.log("popup.js 시작");

// document.querySelector("#sliderContaier").style.display = "none";
// setTimeout(() => {
//   document.querySelector("#pulseContainer").style.display = "none";
//   document.querySelector("#sliderContaier").style.display = "block";
// }, 3000);

/////////////////////////////////////////////////////////////////////////////////

let curDate = new Date();
const sliderSvg = document.querySelector(".slider-svg");
const sliderPath = document.querySelector(".slider-svg-path");
const sliderPathLength = sliderPath.getTotalLength();
const sliderThumb = document.querySelector(".slider-thumb");
const time = document.querySelector(".slider-value");
const sliderInput = document.querySelector("#sliderInput");
const sliderMinValue = +sliderInput.min || 0;
const sliderMaxValue = +sliderInput.max || 100;

const updateTime = (timeInMinutes) => {
  let hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  const isMorning = hours < 12;
  const formattedHours = String(
    isMorning ? hours || 12 : hours - 12 || 12
  ).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(curDate.getSeconds()).padStart(2, 0);

  time.textContent = `${
    isMorning || hours === 24 ? "AM" : "PM"
  } ${formattedHours}:${formattedMinutes}:${formattedSeconds} `;
};

const setColor = (progress) => {
  const colorStops = [
    // { r: 243, g: 217, b: 112 }, // #F3D970
    // { r: 252, g: 187, b: 93 }, // #FCBB5D
    // { r: 246, g: 135, b: 109 }, // #F6876D
    // { r: 147, g: 66, b: 132 }, // #934284
    // { r: 64, g: 40, b: 98 }, // #402862
    // { r: 1, g: 21, b: 73 }, // #011549
    { r: 1, g: 21, b: 73 }, // #011549
    { r: 64, g: 40, b: 98 }, // #402862
    { r: 246, g: 135, b: 109 }, // #F6876D
    { r: 252, g: 187, b: 93 }, // #FCBB5D
    { r: 243, g: 217, b: 112 }, // #F3D970
    { r: 243, g: 217, b: 112 }, // #F3D970
    { r: 243, g: 217, b: 112 }, // #F3D970
    { r: 252, g: 187, b: 93 }, // #FCBB5D
    { r: 246, g: 135, b: 109 }, // #F6876D
    { r: 64, g: 40, b: 98 }, // #402862
    { r: 1, g: 21, b: 73 }, // #011549
  ];
  const numStops = colorStops.length;

  const index = (numStops - 1) * progress;
  const startIndex = Math.floor(index);
  const endIndex = Math.ceil(index);

  const startColor = colorStops[startIndex];
  const endColor = colorStops[endIndex];

  const percentage = index - startIndex;

  const [r, g, b] = [
    Math.round(startColor.r + (endColor.r - startColor.r) * percentage),
    Math.round(startColor.g + (endColor.g - startColor.g) * percentage),
    Math.round(startColor.b + (endColor.b - startColor.b) * percentage),
  ];

  sliderThumb.style.setProperty("--color", `rgb(${r} ${g} ${b})`);
};

// updating position could be done with CSS Motion Path instead of absolute positioning but Safari <15.4 doesn’t seem to support it
const updatePosition = (progress) => {
  const point = sliderPath.getPointAtLength(progress * sliderPathLength);
  const svgRect = sliderSvg.getBoundingClientRect();
  const scaleX = svgRect.width / sliderSvg.viewBox.baseVal.width;
  const scaleY = svgRect.height / sliderSvg.viewBox.baseVal.height;
  sliderThumb.style.left = `${(point.x * scaleX * 100) / svgRect.width}%`;
  sliderThumb.style.top = `${(point.y * scaleY * 100) / svgRect.height}%`;
  const value = Math.round(progress * (sliderMaxValue - sliderMinValue));
  updateTime(value);
  setColor(progress);
};

const handlePointerMove = (event) => {
  const sliderWidth = sliderPath.getBoundingClientRect().width;
  const pointerX = event.clientX - sliderPath.getBoundingClientRect().left;
  const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
  updatePosition(progress);
};

const handlePointerDown = (event) => {
  const sliderWidth = sliderPath.getBoundingClientRect().width;
  const pointerX = event.clientX - sliderPath.getBoundingClientRect().left;
  const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
  const isThumb = event.target.classList.contains("slider-thumb");
  if (!isThumb) updatePosition(progress);

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", () => {
    window.removeEventListener("pointermove", handlePointerMove);
  });
};

sliderThumb.addEventListener("pointerdown", handlePointerDown);
sliderPath.addEventListener("pointerdown", handlePointerDown);

function updatePositionTime() {
  curDate = new Date();
  const curHours = curDate.getHours();
  const curMinutes = curDate.getMinutes();
  const curMinutesDay = curHours * 60 + curMinutes;

  const sliderInput = document.querySelector("#sliderInput");
  const sliderMinValue = +sliderInput.min || 0;
  const sliderMaxValue = +sliderInput.max || 100;

  sliderInput.value = curMinutesDay;
  updatePosition(sliderInput.valueAsNumber / (sliderMaxValue - sliderMinValue));
}

updatePositionTime();
setInterval(() => {
  updatePositionTime();
}, 1000);

///////////////////////////////////////////////////////////////////////

// 토글 true 시 태그 정보 미노출
const toggleSwitch = document.querySelector("#toggle");
toggleSwitch.addEventListener("click", async (event) => {
  const checked = event.currentTarget.checked;

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setToggleTooltip,
    args: [checked],
  });
});

function setToggleTooltip(checked) {
  const toggleSwitchOn = checked ? "1" : "";
  localStorage.setItem("chromeExtToggleSwitchOn", toggleSwitchOn);
  const chromeExtTooltip = document.querySelector("#chromeExtTooltip");
  if (checked) {
    chromeExtTooltip.style.display = "none";
  } else {
    chromeExtTooltip.style.display = "block";
  }
  setTooltipToggleSwitchOn(toggleSwitchOn);
}

chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: () => {
        return localStorage.getItem("chromeExtToggleSwitchOn");
      },
    })
    .then(([data]) => {
      toggleSwitch.checked = data.result === "1" ? true : false;
    });
});
