// 마우스 오버 이벤트를 감지하여 엘리먼트 정보를 표시하는 함수
function handleMouseOver(event) {
  const target = event.target; // 이벤트가 발생한 엘리먼트 가져오기
  const elementInfo = getElementInfo(target); // 엘리먼트 정보 가져오기

  // 엘리먼트 정보를 표시하기 위해 새로운 div 엘리먼트 생성
  const tooltip = document.createElement("div");
  tooltip.textContent = elementInfo;
  tooltip.style.width = "200px";
  tooltip.style.opacity = "70%";
  tooltip.style.position = "fixed";
  tooltip.style.background = "#fff";
  tooltip.style.color = "#000";
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.padding = "5px";
  tooltip.style.zIndex = "9999";
  //   tooltip.style.top = `${event.pageY}px`;
  //   tooltip.style.left = `${event.pageX}px`;
  tooltip.style.top = `100px`;
  tooltip.style.left = `10px`;

  // body에 tooltip 엘리먼트 추가
  document.body.appendChild(tooltip);

  // 마우스 이벤트 리스너 해제
  //   target.removeEventListener("mouseover", handleMouseOver);
  target.addEventListener("mouseout", () => {
    // tooltip 엘리먼트 제거
    tooltip.remove();
    // 다시 마우스 오버 이벤트 리스너 등록
    // target.addEventListener("mouseover", handleMouseOver);
  });
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

// 모든 엘리먼트에 대한 마우스 오버 이벤트 리스너 등록
document.addEventListener("mouseover", handleMouseOver);
