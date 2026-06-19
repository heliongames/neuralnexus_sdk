(function () {
  let PORTAL_ORIGIN = "https://neuralnexus.games";
  try {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      PORTAL_ORIGIN = "*";
    }
  } catch (e) { }

  // --- 1. Генерация sessionId (UUID v4) ---
  function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const sessionId = generateUUID();

  // --- 2. Определение gameId ---
  let gameId = "unknown";
  try {
    const scriptEl = document.currentScript;
    if (scriptEl && scriptEl.getAttribute('data-game-id')) {
      gameId = scriptEl.getAttribute('data-game-id');
    }
  } catch (e) {}

  if (gameId === "unknown") {
    try {
      const path = window.location.pathname;
      const match = path.match(/\/games\/([^\/]+)/);
      if (match && match[1]) {
        gameId = match[1];
      }
    } catch (e) {}
  }

  if (gameId === "unknown") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const gameIdParam = urlParams.get('gameId');
      if (gameIdParam) {
        gameId = gameIdParam;
      }
    } catch (e) {}
  }

  // --- 3. Отправка событий аналитики ---
  function sendAnalytics(actionType) {
    const payload = {
      action: "track_analytics",
      gameId: gameId,
      sessionId: sessionId,
      referrer: document.referrer || window.location.href,
      actionType: actionType
    };

    const url = "https://api.neuralnexus.games";

    if (typeof fetch === 'function') {
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function (e) {
        // Тихо подавляем ошибки
      });
    }
  }

  // --- 4. Проверка Domain Lock ---
  const ALLOWED_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'neuralnexus.games',
    'www.neuralnexus.games',
    'api.neuralnexus.games'
  ];

  function isDomainAllowed(hostname) {
    const lowerHostname = hostname.toLowerCase();
    for (let i = 0; i < ALLOWED_DOMAINS.length; i++) {
      const allowed = ALLOWED_DOMAINS[i];
      if (lowerHostname === allowed || lowerHostname.endsWith('.' + allowed)) {
        return true;
      }
    }
    return false;
  }

  let isLocked = false;
  try {
    const currentHost = window.location.hostname;
    if (currentHost && !isDomainAllowed(currentHost)) {
      isLocked = true;
      sendAnalytics('lock_trigger');
      setTimeout(function () {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = "https://neuralnexus.games";
          } else {
            window.location.href = "https://neuralnexus.games";
          }
        } catch (e) {
          window.location.href = "https://neuralnexus.games";
        }
      }, 300);
    }
  } catch (e) {}

  if (!isLocked) {
    sendAnalytics('game_start');

    // Пинг каждые 60 секунд, если окно активно
    setInterval(function () {
      if (!document.hidden) {
        sendAnalytics('game_ping');
      }
    }, 60000);
  }

  const NeuralNexusSDK = {
    getSessionId: function () {
      return sessionId;
    },

    getGameId: function () {
      return gameId;
    },

    saveProgress: function (data) {
      window.parent.postMessage({
        source: 'neuralnexus-sdk',
        action: 'SAVE_PROGRESS',
        payload: data
      }, PORTAL_ORIGIN);
    },

    unlockAchievement: function (achievementId) {
      window.parent.postMessage({
        source: 'neuralnexus-sdk',
        action: 'UNLOCK_ACHIEVEMENT',
        payload: { id: achievementId }
      }, PORTAL_ORIGIN);
    },

    submitScore: function (data) {
      // data can be a number (legacy) or an object (universal)
      let payload = data;
      if (typeof data === 'number' || typeof data === 'string') {
        payload = { score: Number(data) };
      }
      window.parent.postMessage({
        source: 'neuralnexus-sdk',
        action: 'SUBMIT_SCORE',
        payload: payload
      }, PORTAL_ORIGIN);
    },

    saveRecord: function (data) {
      this.submitScore(data);
    },

    loadProgress: function () {
      return new Promise((resolve) => {
        const uniqueId = Math.random().toString(36).substring(7);
        const handler = (event) => {
          if (PORTAL_ORIGIN !== "*" && event.origin !== PORTAL_ORIGIN) return;
          if (event.data && event.data.action === 'LOAD_PROGRESS_RESPONSE' && event.data.requestId === uniqueId) {
            window.removeEventListener('message', handler);
            resolve(event.data.payload);
          }
        };
        window.addEventListener('message', handler);
        window.parent.postMessage({
          source: 'neuralnexus-sdk',
          action: 'LOAD_PROGRESS',
          requestId: uniqueId
        }, PORTAL_ORIGIN);
      });
    },

    showAd: function () {
      return new Promise((resolve) => {
        const uniqueId = Math.random().toString(36).substring(7);
        const handler = (event) => {
          if (PORTAL_ORIGIN !== "*" && event.origin !== PORTAL_ORIGIN) return;
          if (event.data && event.data.action === 'SHOW_AD_RESPONSE' && event.data.requestId === uniqueId) {
            window.removeEventListener('message', handler);
            resolve(event.data.payload);
          }
        };
        window.addEventListener('message', handler);
        window.parent.postMessage({
          source: 'neuralnexus-sdk',
          action: 'SHOW_AD',
          requestId: uniqueId
        }, PORTAL_ORIGIN);
      });
    }
  };

  window.NeuralNexus = NeuralNexusSDK;
  console.log("NeuralNexus SDK successfully initialized.");
})();
