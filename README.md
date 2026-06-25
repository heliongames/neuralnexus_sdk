# NeuralNexus SDK

Lightweight integration bridge for HTML5 games hosted on the [NeuralNexus Games](https://neuralnexus.games) portal. It allows games to easily save progress, unlock achievements, submit universal leaderboard records, and display ads using simple JavaScript promises.

---

## Setup

### Option 1: Local Setup
Download `neuralnexus-sdk.js` and save it to the root directory of your game project. Then, include the script in your `index.html` before your main game code:
```html
<script src="neuralnexus-sdk.js"></script>
```

### Option 2: CDN Setup
You can also connect the SDK directly from the jsDelivr CDN without downloading any files. Place the following script tag in your `index.html` before your main game code:
```html
<script src="https://cdn.jsdelivr.net/gh/heliongames/neuralnexus_sdk@main/neuralnexus-sdk.js"></script>
```

---

## API Reference

### 1. Save Progress
Sends an arbitrary JSON object containing player state or progress to the portal. Call this when the player finishes a level, gains items, or changes settings.
```javascript
window.NeuralNexus.saveProgress({
    level: 3,
    score: 1250,
    inventory: ['laser_gun', 'shield']
});
```

### 2. Load Progress
Requests previously saved user data from the portal. Returns a `Promise` resolving to the saved data object, or `null` if no save state exists yet.
```javascript
window.NeuralNexus.loadProgress().then((saveData) => {
    if (saveData) {
        game.stats = saveData.stats;
        game.equippedSkinId = saveData.equippedSkinId;
        console.log("Progress successfully loaded!");
    } else {
        console.log("No save state found. Starting fresh.");
    }
});
```

### 3. Unlock Achievement
Unlocks an achievement in the player's profile by sending its unique string identifier.
```javascript
window.NeuralNexus.unlockAchievement('boss_defeated_level_1');
```

### 4. Submit Score / Record
Submits a high score or record to the leaderboards. Supports multiple leaderboard keys per game, custom sorting orders, formatted display strings, and metadata.
```javascript
window.NeuralNexus.submitScore({
    score: 84.503,                      // Numeric value for database sorting (Required)
    recordKey: 'lap_time',              // Leaderboard key (Optional, default: 'score')
    displayValue: '1:24.503',           // Formatted string to display in UI (Optional)
    sortOrder: 'ASC',                   // Sorting direction: 'ASC' (lower is better, e.g. time) or 'DESC' (default, higher is better)
    metadata: { car: 'Tesla Roadster' } // Additional custom metadata object (Optional)
});

// You can also use the alias:
window.NeuralNexus.saveRecord({ ... });
```

### 5. Show Interstitial Ad
Requests a full-screen interstitial ad overlay. The portal will pause game interaction and overlay a countdown timer. Returns a `Promise` resolving to `{ success: true }` after the ad finishes, allowing you to easily resume the game.
```javascript
// 1. Pause game loop
game.pause();

// 2. Request ad
window.NeuralNexus.showAd().then((result) => {
    console.log("Ad finished:", result); // { success: true }
    // 3. Resume game loop
    game.resume();
});
```

### 6. Get Player Info
Requests the username, avatar URL, and secure public ID (`public_id`) of the active player. Useful for multiplayer matching, displaying profiles, or custom player identification. Returns a `Promise` resolving to the player data object (or guest details if the player is not logged in).
```javascript
window.NeuralNexus.getPlayerInfo().then((player) => {
    console.log(player.username);   // Username (e.g. 'JohnDoe' or 'Guest_a4d2e1')
    console.log(player.avatar_url); // Avatar URL string (or null)
    console.log(player.public_id);  // Secure public player ID (UUID v4 or guest token)
});
```
