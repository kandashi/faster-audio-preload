
Hooks.once('ready', async function() {
    libWrapper.register("faster-audio-preload", "Playlist.prototype._onSoundStart", earlyPreload, "OVERRIDE")

});

function earlyPreload(...args) {
    let sound = args[0]
    if ( ![CONST.PLAYLIST_MODES.SEQUENTIAL, CONST.PLAYLIST_MODES.SHUFFLE].includes(this.mode) ) return;
    const apl = CONFIG.Playlist.autoPreloadSeconds;
    if ( Number.isNumeric(apl) ) {
      setTimeout(() => {
        if ( !sound.playing ) return;
        const next = this._getNextSound(sound.id);
        if ( next ) next.sound.load();
    }, (sound.sound.duration/2) * 1000);
}
  }