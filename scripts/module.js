
Hooks.once('ready', async function () {
  libWrapper.register("faster-audio-preload", "Playlist.prototype._onSoundStart", earlyPreload, "OVERRIDE")

  let preloadPlaylists = game.playlists.filter(i => i.data.flags["faster-audio-preload"]?.auto)
  for( let p of preloadPlaylists) {
    p.data.sounds.forEach(s => {
      s.sound.load()
    })
  }
});

Hooks.on("renderPlaylistConfig", (config, html, css) => {
  const autoPreload = config.object.getFlag("faster-audio-preload", "auto")
  let lastBox = html.find("input[name='fade']").closest(".form-group")
  let checkboxHTML = `
    <div class="form-group">
        <label>Auto Preload</label>
        <input type="checkbox" name="flags.faster-audio-preload.auto" ${autoPreload ? "checked" : ""}>
    </div>
    `
  lastBox.after(checkboxHTML)
})

function earlyPreload(...args) {
  let sound = args[0]
  if (![CONST.PLAYLIST_MODES.SEQUENTIAL, CONST.PLAYLIST_MODES.SHUFFLE].includes(this.mode)) return;
  const apl = CONFIG.Playlist.autoPreloadSeconds;
  if (Number.isNumeric(apl)) {
    setTimeout(() => {
      if (!sound.playing) return;
      const next = this._getNextSound(sound.id);
      if (next) next.sound.load();
    }, (sound.sound.duration / 2) * 1000);
  }
}