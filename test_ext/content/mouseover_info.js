const data = {
  tooltip: {},
  tooltipIsDragging: false, // 드래그 중인지 여부
  tooltipOffset: { x: 0, y: 0 },
  tooltipId: "chromeExtTooltip",
  tooltipZoomBtnId: "chromeExtTooltipZoomBtn",
  tooltipContentId: "chromeExtTooltipContent",
};

// 마우스 오버 이벤트를 감지하여 엘리먼트 정보를 표시하는 함수
function handleMouseOver(event) {
  const target = event.target; // 이벤트가 발생한 엘리먼트 가져오기

  const elementInfo = getElementInfo(target); // 엘리먼트 정보 가져오기

  data.tooltip.style.display = "block";
  data.tooltip.childNodes[1].textContent = elementInfo;

  if (target.id === data.tooltipId || target.parentNode.id === data.tooltipId) {
    data.tooltip.childNodes[1].textContent = "😗🫓🍧";
  }
}

// tooltip을 이동할 수 있도록 하는 함수
function startDrag(event) {
  data.tooltipIsDragging = true;

  const tooltipRect = data.tooltip.getBoundingClientRect();
  data.tooltipOffset.x = event.clientX - tooltipRect.left;
  data.tooltipOffset.y = event.clientY - tooltipRect.top;
}

function moveTooltip(pageX, pageY) {
  data.tooltip.style.left = `${pageX - data.tooltipOffset.x}px`;
  data.tooltip.style.top = `${pageY - data.tooltipOffset.y}px`;
}

// tooltip 엘리먼트를 생성하는 함수
function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.id = data.tooltipId;
  tooltip.style.width = "200px";
  tooltip.style.opacity = "70%";
  tooltip.style.borderRadius = "10px";
  tooltip.style.position = "absolute";
  tooltip.style.background = "#fff";
  tooltip.style.color = "#000";
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.padding = "5px";
  tooltip.style.zIndex = "9999";
  tooltip.style.top = "100px";
  tooltip.style.left = "10px";
  tooltip.style.display = "none";
  tooltip.style.cursor = "pointer";

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

// 엘리먼트 정보를 반환하는 함수
function getElementInfo(element) {
  let info = `<${element.tagName}>`;
  if (element.className) {
    info += `\nClass: ${element.className}`;
  }
  if (element.id) {
    info += `\nId: ${element.id}`;
  }

  // 이벤트 정보 가져오기
  const eventNames = Object.keys(element).filter((key) => key.startsWith("on"));
  if (eventNames.length > 0) {
    info += "\n\nEvents:";
    eventNames.forEach((eventName) => {
      const handler = element[eventName];
      if (typeof handler === "function") {
        info += `\n${eventName}: ${handler.name || "anonymous function"}`;
      }
    });
  }

  return info;
}

data.tooltip = createTooltip();

// body에 tooltip 엘리먼트 추가
document.body.appendChild(data.tooltip);

// 마우스 오버 이벤트 리스너 등록
document.addEventListener("mouseover", handleMouseOver);

// 엘리먼트를 클릭하여 tooltip 이동을 활성화하는 이벤트 리스너 등록
data.tooltip.addEventListener("mousedown", startDrag);

// 이동 이벤트 리스너 등록
document.addEventListener("mousemove", (event) => {
  if (data.tooltipIsDragging) {
    moveTooltip(event.pageX, event.pageY);
  }
});

// 드래그 종료 시 이벤트 리스너 해제
document.addEventListener("mouseup", () => {
  data.tooltipIsDragging = false;
});

// 툴팁 숨김 이벤트 리스너 등록
document.addEventListener("mouseout", function (event) {
  if (event.target.id === data.tooltipId) {
    // 툴팁 숨김
    data.tooltip.style.display = "none";
  }
});

data.tooltip.childNodes[0].addEventListener("click", () => {
  if (data.tooltip.classList.contains("tooltip-small")) {
    data.tooltip.classList.remove("tooltip-small");
  } else {
    data.tooltip.classList.add("tooltip-small");
  }
});
