/**
 * ---------------------------------------------------------------------------------
 * | 백그라운드 |
 * ---------------------------------------------------------------------------------
 * - 디폴트 컬러를 지정하여 스토리지 API 를 호출하여 지정한 색을 저장시킵니다.
 **/
const data = {
  toogle: false,
  db: {
    DB_NAME: "chromeExtDB",
    STORE_NAME: "settings",
    DB_VERSION: 1,
  },
};

function sendNotification(notiId, msg, dwellingTimeMs) {
  //clear noti for fast notification
  chrome.notifications.clear((notificationId = notiId), (callback = () => {}));

  chrome.notifications.create(notiId, {
    type: "basic",
    title: "태그 정보 알려줄게",
    iconUrl: "/images/helmet.png",
    message: msg,
    priority: 2, // -2 to 2 (highest)
    eventTime: Date.now(),
  });

  setTimeout(() => {
    chrome.notifications.clear(
      (notificationId = notiId),
      (callback = () => {})
    );
  }, dwellingTimeMs);
}

function createDB(dbRequest, STORE_NAME) {
  dbRequest.onupgradeneeded = () => {
    let db = dbRequest.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      db.onversionchange = function () {
        db.close();
        alert("Database is outdated, please reload the page.");
      };
      console.log("DB 생성 완료");
    }
  };
}

function getDBRequest(DB_NAME, DB_VERSION) {
  return indexedDB.open(DB_NAME, DB_VERSION);
}

function setupDB() {
  console.log("DB 셋업 확인");
  const { DB_NAME, STORE_NAME, DB_VERSION } = data.db;
  createDB(getDBRequest(DB_NAME, DB_VERSION), STORE_NAME);
}

function executeDB(dbRequest, dbConst, executeStatement) {
  return new Promise((resolve, reject) => {
    dbRequest.onerror = () => {
      console.error(dbRequest.error);
    };

    dbRequest.onsuccess = () => {
      let db = dbRequest.result;

      db.onversionchange = function () {
        db.close();
        alert("Database is outdated, please reload the page.");
      };

      let transaction = db.transaction(dbConst.STORE_NAME, "readwrite");
      let objStore = transaction.objectStore(dbConst.STORE_NAME);
      let request = executeStatement(objStore);

      request.onsuccess = (event) => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        console.log("Error: ", request.error);
        reject(event);
      };

      transaction.oncomplete = (event) => {
        db.close();
      };
    };
  });
}

// DB 저장(item은 객체여야함)
function putDB(item) {
  const { DB_NAME, STORE_NAME, DB_VERSION } = data.db;
  const dbRequest = getDBRequest(DB_NAME, DB_VERSION);

  // 혹시 DB 없는상태에서 실행하게 되면 이것도 같이 실행되면서 DB 만들어줌
  createDB(dbRequest, STORE_NAME);
  return executeDB(dbRequest, data.db, (objStore) => objStore.put(item));
}

// DB 조회(id로 조회)
function getDB(id) {
  const { DB_NAME, DB_VERSION } = data.db;
  const dbRequest = getDBRequest(DB_NAME, DB_VERSION);
  return executeDB(dbRequest, data.db, (objStore) => objStore.get(id));
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    // 첫 설치
    sendNotification(
      "설치 완료",
      "앱이 설치되었습니다.",
      (dwellingTimeMs = 5000)
    );
    setupDB();

    chrome.storage.sync.set({ toogle: data.toogle });
    chrome.storage.sync.set({ chromeExtIsTooltipSmall: false });
  } else if (details.reason == "update") {
    sendNotification(
      "업데이트 완료",
      "앱이 업데이트되었습니다.",
      (dwellingTimeMs = 5000)
    );
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.myKey) {
    case "putDB":
      putDB(request.data).then((result) => {
        sendResponse({ result: result });
      });
      return true;
    case "getDB":
      getDB(request.id).then((result) => {
        sendResponse({ result: result });
      });
      return true;
    case "myTest":
      sendResponse({ result: "성공" });
      return true; // 비동기 응답을 위해 true 반환
  }
});
