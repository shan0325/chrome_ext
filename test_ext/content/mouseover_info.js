const data = {
  tooltip: {},
  tooltipIsDragging: false, // 드래그 중인지 여부
  tooltipOffset: { x: 0, y: 0 },
  tooltipId: "chromeExtTooltip",
  tooltipZoomBtnId: "chromeExtTooltipZoomBtn",
  tooltipContentId: "chromeExtTooltipContent",
};

// tooltip 엘리먼트를 생성하는 함수
function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.id = data.tooltipId;
  tooltip.classList.add("chrome-ext-tooltip");
  tooltip.style.fontSize = "12px";
  tooltip.style.minWidth = "100px";
  tooltip.style.maxWidth = "250px";
  tooltip.style.opacity = "90%";
  tooltip.style.borderRadius = "10px";
  tooltip.style.position = "fixed";
  tooltip.style.background = "#fff";
  tooltip.style.color = "#000";
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.setProperty("padding", "5px 15px 5px 5px", "important");
  tooltip.style.zIndex = "999999";
  tooltip.style.top = "10px";
  tooltip.style.left = "10px";
  tooltip.style.display = "none";
  tooltip.style.cursor = "move";

  const tooltipZoomBtn = document.createElement("span");
  tooltipZoomBtn.id = data.tooltipZoomBtnId;
  tooltipZoomBtn.textContent = "-";
  tooltipZoomBtn.style.position = "absolute";
  tooltipZoomBtn.style.top = "0";
  tooltipZoomBtn.style.right = "0";
  tooltipZoomBtn.style.padding = "2px";
  tooltipZoomBtn.style.cursor = "pointer";
  tooltipZoomBtn.style.backgroundColor = "#555";
  tooltipZoomBtn.style.color = "#fff";
  tooltipZoomBtn.style.fontSize = "12px";
  tooltipZoomBtn.style.lineHeight = "1";
  tooltipZoomBtn.style.borderRadius = "3px";
  tooltip.appendChild(tooltipZoomBtn);

  const tooltipContent = document.createElement("div");
  tooltipContent.id = data.tooltipContentId;
  tooltip.appendChild(tooltipContent);

  return tooltip;
}

// 마우스 오버 이벤트를 감지하여 엘리먼트 정보를 표시하는 함수
function handleMouseOver(event) {
  if (data.tooltipIsDragging) return;

  const target = event.target; // 이벤트가 발생한 엘리먼트 가져오기
  const elementInfo = getElementInfo(target); // 엘리먼트 정보 가져오기

  data.tooltip.style.display = "block";
  data.tooltip.childNodes[1].innerHTML = elementInfo;
  data.tooltip.childNodes[1].style.height = "";

  if (
    target.id === data.tooltipId ||
    (target.parentNode && target.parentNode.id === data.tooltipId)
  ) {
    document.removeEventListener("mouseover", handleMouseOver);
    data.tooltip.childNodes[1].textContent = "<TAG> INFO";
    data.tooltip.childNodes[1].style.height = "50px";
  }
}

// tooltip을 이동할 수 있도록 하는 함수
function startDrag(event) {
  data.tooltipIsDragging = true;

  // 마우스 위치 - tooltop 위치(left, top)를 빼서 tooltop과 마우스 간격을 구함
  const tooltipRect = data.tooltip.getBoundingClientRect();
  data.tooltipOffset.x = event.clientX - tooltipRect.left;
  data.tooltipOffset.y = event.clientY - tooltipRect.top;
}

function moveTooltip(event) {
  data.tooltip.style.left = `${event.clientX - data.tooltipOffset.x}px`;
  data.tooltip.style.top = `${event.clientY - data.tooltipOffset.y}px`;
}

// 엘리먼트 정보를 반환하는 함수
function getElementInfo(element) {
  let info = "<p style='font-size:12px; font-weight: bold;'>";
  info += `<span style='color:#8B1874;'>${element.tagName.toLowerCase()}</span>`;
  if (element.id) {
    info += `<span style='color:#2F58CD;'>#${element.id}</span>`;
  }
  if (element.classList && element.classList.length > 0) {
    info += `<span style='color:#E74646;'>.${Array.from(element.classList).join(
      "."
    )}</span>`;
  }
  info += `<span style='color:#537188;'>  ${element.clientWidth} x ${element.clientHeight}</span>`;
  info += "</p>";
  info += "<br/>";

  const eleStyle = getComputedStyle(element);
  info += '<div style="color:#27374D">';
  info += `<div>color ${eleStyle.color} <div style="display:inline-block; width:10px; height:10px; background-color:${eleStyle.color}"></div></div>`;
  info += `<div>background color ${eleStyle.backgroundColor} <div style="display:inline-block; width:10px; height:10px; background-color:${eleStyle.backgroundColor}"></div></div>`;
  info += "<div>";

  return info;
}

function initTooltip() {
  const chromeExtIsTooltipSmall =
    localStorage.getItem("chromeExtIsTooltipSmall") || "0";

  if (chromeExtIsTooltipSmall === "0") {
    changeBigTooltip();
  } else {
    changeSmallTooltip();
  }

  //   chrome.storage.sync.get("chromeExtIsTooltipSmall", (data) => {
  //     if (data && data.chromeExtIsTooltipSmall) {
  //       changeSmallTooltip();
  //     } else {
  //       changeBigTooltip();
  //     }
  //   });

  const chromeExtTooltipLocation = localStorage.getItem(
    "chromeExtTooltipLocation"
  );
  if (chromeExtTooltipLocation) {
    const chromeExtTooltipLocationObj = JSON.parse(chromeExtTooltipLocation);
    data.tooltip.style.left = chromeExtTooltipLocationObj.left;
    data.tooltip.style.top = chromeExtTooltipLocationObj.top;
  }
}

function changeSmallTooltip() {
  data.tooltip.style.minWidth = "25px";
  data.tooltip.style.width = "25px";
  data.tooltip.style.height = "20px";
  data.tooltip.childNodes[0].textContent = "+";
  data.tooltip.childNodes[1].style.display = "none";
}

function changeBigTooltip() {
  data.tooltip.style.minWidth = "100px";
  data.tooltip.style.width = "";
  data.tooltip.style.height = "";
  data.tooltip.childNodes[0].textContent = "-";
  data.tooltip.childNodes[1].style.display = "block";
}

data.tooltip = createTooltip();

// body에 tooltip 엘리먼트 추가
document.body.appendChild(data.tooltip);

initTooltip();

// 마우스 오버 이벤트 리스너 등록
document.addEventListener("mouseover", handleMouseOver);

// 엘리먼트를 클릭하여 tooltip 이동을 활성화하는 이벤트 리스너 등록
data.tooltip.addEventListener("mousedown", startDrag);

// 이동 이벤트 리스너 등록
document.addEventListener("mousemove", (event) => {
  if (data.tooltipIsDragging) {
    moveTooltip(event);
  }
});

// 드래그 종료 시 이벤트 리스너 해제
document.addEventListener("mouseup", () => {
  data.tooltipIsDragging = false;

  const chromeExtTooltipLocation = {
    left: data.tooltip.style.left,
    top: data.tooltip.style.top,
  };
  localStorage.setItem(
    "chromeExtTooltipLocation",
    JSON.stringify(chromeExtTooltipLocation)
  );
});

// tooltip 마우스 아웃 시 이벤트 리스너 다시 등록
data.tooltip.addEventListener("mouseout", () => {
  document.addEventListener("mouseover", handleMouseOver);
});

// 축소 버튼 클릭 시
data.tooltip.childNodes[0].addEventListener("click", () => {
  const chromeExtIsTooltipSmall =
    localStorage.getItem("chromeExtIsTooltipSmall") || "0";

  if (chromeExtIsTooltipSmall === "0") {
    localStorage.setItem("chromeExtIsTooltipSmall", "1");
    changeSmallTooltip();
  } else {
    localStorage.setItem("chromeExtIsTooltipSmall", "0");
    changeBigTooltip();
  }

  //   chrome.storage.sync.get("chromeExtIsTooltipSmall", (data) => {
  //     if (data && data.chromeExtIsTooltipSmall) {
  //       chrome.storage.sync.set({ chromeExtIsTooltipSmall: false });
  //       changeBigTooltip();
  //     } else {
  //       chrome.storage.sync.set({ chromeExtIsTooltipSmall: true });
  //       changeSmallTooltip();
  //     }
  //   });
});

// DB 등록
chrome.runtime.sendMessage(
  { myKey: "putDB", data: { isSmall: false } },
  (response) => {
    console.log(response);
  }
);

// DB 조회
chrome.runtime.sendMessage({ myKey: "getDB", id: 33 }, (response) => {
  console.log(response);
});
