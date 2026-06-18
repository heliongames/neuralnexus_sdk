(function () {
  let PORTAL_ORIGIN = "https://neuralnexus.games";
  try {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      PORTAL_ORIGIN = "*";
    }
  } catch (e) { }

  const NeuralNexusSDK = {
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
