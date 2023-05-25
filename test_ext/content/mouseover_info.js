const data = {
  tooltip: {},
  tooltipIsDragging: false, // 드래그 중인지 여부
  tooltipOffset: { x: 0, y: 0 },
  tooltipId: "chromeExtTooltip",
  tooltipZoomBtnId: "chromeExtTooltipZoomBtn",
  tooltipContentId: "chromeExtTooltipContent",
  tooltipLastTop: 100,
};

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

// 마우스 오버 이벤트를 감지하여 엘리먼트 정보를 표시하는 함수
function handleMouseOver(event) {
  if (data.tooltipIsDragging) return;

  const target = event.target; // 이벤트가 발생한 엘리먼트 가져오기
  const elementInfo = getElementInfo(target); // 엘리먼트 정보 가져오기

  data.tooltip.style.display = "block";
  data.tooltip.childNodes[1].innerHTML = elementInfo;
  data.tooltip.childNodes[1].style.height = "";

  if (target.id === data.tooltipId || target.parentNode.id === data.tooltipId) {
    document.removeEventListener("mouseover", handleMouseOver);
    data.tooltip.childNodes[1].textContent = "😗🫓🍧🏜️🥰🎈";
    // data.tooltip.childNodes[1].innerHTML = "<img src='https://picsum.photos/150/150' />";
    data.tooltip.childNodes[1].style.height = "100px";
  }
}

// tooltip을 이동할 수 있도록 하는 함수
function startDrag(event) {
  data.tooltipIsDragging = true;

  const tooltipRect = data.tooltip.getBoundingClientRect();
  data.tooltipOffset.x = event.clientX - tooltipRect.left;
  data.tooltipOffset.y = event.clientY - tooltipRect.top;
}

function moveTooltip(event) {
  data.tooltip.style.left = `${event.pageX - data.tooltipOffset.x}px`;
  data.tooltip.style.top = `${event.pageY - data.tooltipOffset.y}px`;
  data.tooltipLastTop = data.tooltip.getBoundingClientRect().top;
}

// 엘리먼트 정보를 반환하는 함수
function getElementInfo(element) {
  let info = `<p>&lt;${element.tagName}&gt;<p>`;
  if (element.className) {
    info += `<p>Class: ${element.className}</p>`;
  }
  if (element.id) {
    info += `<p>Id: ${element.id}</p>`;
  }

  // 이벤트 정보 가져오기
  const eventNames = Object.keys(element).filter((key) => key.startsWith("on"));
  if (eventNames.length > 0) {
    info += "<p>Events:</p>";
    eventNames.forEach((eventName) => {
      const handler = element[eventName];
      if (typeof handler === "function") {
        info += `<p>${eventName}: ${handler.name || "anonymous function"}</p>`;
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
    moveTooltip(event);
  }
});

// 드래그 종료 시 이벤트 리스너 해제
document.addEventListener("mouseup", () => {
  data.tooltipIsDragging = false;
});

// tooltip 마우스 아웃 시 이벤트 리스너 다시 등록
data.tooltip.addEventListener("mouseout", () => {
  document.addEventListener("mouseover", handleMouseOver);
});

// 스크롤 시 tooltip 같이 이동
window.addEventListener("scroll", () => {
  data.tooltip.style.top = `${data.tooltipLastTop + window.scrollY}px`;
});

// 축소 버튼 클릭 시
data.tooltip.childNodes[0].addEventListener("click", () => {
  if (data.tooltip.classList.contains("tooltip-small")) {
    data.tooltip.classList.remove("tooltip-small");
    data.tooltip.style.width = "200px";
    data.tooltip.style.height = "";
    data.tooltip.childNodes[1].style.display = "block";
  } else {
    data.tooltip.classList.add("tooltip-small");
    data.tooltip.style.width = "20px";
    data.tooltip.style.height = "20px";
    data.tooltip.childNodes[1].style.display = "none";
  }
});
