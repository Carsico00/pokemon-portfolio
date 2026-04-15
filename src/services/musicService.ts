// Chiptune Music Engine - Web Audio API
// Original 8-bit style melodies for each game phase
// Battle track: Cynthia's Champion Battle Theme (D/P) chiptune arrangement

type Note = [number, number]; // [frequency Hz, duration in beats] — 0 freq = rest

// Note frequencies (equal temperament)
const N = {
  _: 0, // rest
  C3: 130.81, Db3: 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Gb3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Gb4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Db5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Gb5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50, Db6: 1108.73, D6: 1174.66, Eb6: 1244.51, E6: 1318.51, F6: 1396.91, G6: 1567.98,
};

interface Track {
  melody: Note[];
  bass: Note[];
  tempo: number; // BPM
  wave: OscillatorType;
  bassWave: OscillatorType;
  melodyVol: number;
  bassVol: number;
}

// ====== TRACKS ======

const CHAMPION_ROOM: Track = {
  tempo: 115,
  wave: 'square',
  bassWave: 'triangle',
  melodyVol: 0.08,
  bassVol: 0.06,
  melody: [
    // Regal, majestic march — C major / A minor feel
    [N.E5, 1], [N.G5, 1], [N.C6, 2],
    [N.B5, 1], [N.A5, 1], [N.G5, 2],
    [N.A5, 1], [N.G5, 1], [N.F5, 1], [N.E5, 1],
    [N.D5, 2], [N._, 2],

    [N.E5, 1], [N.G5, 1], [N.C6, 2],
    [N.D6, 1], [N.C6, 1], [N.B5, 1], [N.A5, 1],
    [N.G5, 2], [N.E5, 2],
    [N.C5, 3], [N._, 1],

    [N.F5, 1], [N.A5, 1], [N.C6, 2],
    [N.B5, 1], [N.A5, 1], [N.G5, 2],
    [N.E5, 1], [N.F5, 1], [N.G5, 1], [N.A5, 1],
    [N.G5, 2], [N._, 2],

    [N.C5, 1], [N.E5, 1], [N.G5, 2],
    [N.A5, 1], [N.G5, 1], [N.F5, 1], [N.E5, 1],
    [N.D5, 1], [N.E5, 1], [N.C5, 2],
    [N.C5, 3], [N._, 1],
  ],
  bass: [
    [N.C3, 2], [N.G3, 2], [N.C3, 2], [N.G3, 2],
    [N.F3, 2], [N.C3, 2], [N.G3, 2], [N._, 2],
    [N.C3, 2], [N.G3, 2], [N.C3, 2], [N.G3, 2],
    [N.A3, 2], [N.E3, 2], [N.C3, 2], [N._, 2],
    [N.F3, 2], [N.C3, 2], [N.F3, 2], [N.G3, 2],
    [N.C3, 2], [N.G3, 2], [N.C3, 2], [N._, 2],
    [N.C3, 2], [N.E3, 2], [N.F3, 2], [N.G3, 2],
    [N.G3, 2], [N.F3, 2], [N.C3, 2], [N._, 2],
  ],
};

const TEAM_SELECT: Track = {
  tempo: 128,
  wave: 'square',
  bassWave: 'triangle',
  melodyVol: 0.07,
  bassVol: 0.05,
  melody: [
    // Upbeat, techy feel — like a PC storage system
    [N.C5, 0.5], [N.E5, 0.5], [N.G5, 1], [N.E5, 0.5], [N.C5, 0.5], [N.D5, 1],
    [N.E5, 0.5], [N.G5, 0.5], [N.A5, 1], [N.G5, 0.5], [N.E5, 0.5], [N.D5, 1],
    [N.C5, 0.5], [N.D5, 0.5], [N.E5, 0.5], [N.G5, 0.5], [N.A5, 1], [N.G5, 1],
    [N.E5, 2], [N._, 1], [N._, 1],

    [N.A5, 0.5], [N.G5, 0.5], [N.E5, 1], [N.D5, 0.5], [N.C5, 0.5], [N.D5, 1],
    [N.E5, 0.5], [N.D5, 0.5], [N.C5, 1], [N.D5, 0.5], [N.E5, 0.5], [N.G5, 1],
    [N.A5, 0.5], [N.G5, 0.5], [N.E5, 0.5], [N.D5, 0.5], [N.C5, 1], [N.D5, 1],
    [N.C5, 2], [N._, 1], [N._, 1],
  ],
  bass: [
    [N.C3, 2], [N.G3, 2], [N.A3, 2], [N.G3, 2],
    [N.C3, 2], [N.E3, 2], [N.F3, 2], [N.G3, 2],
    [N.A3, 2], [N.G3, 2], [N.F3, 2], [N.E3, 2],
    [N.C3, 2], [N.G3, 2], [N.C3, 2], [N._, 2],
  ],
};

// ====== CYNTHIA'S BATTLE THEME — Pokémon Diamond/Pearl Champion ======
// Chiptune arrangement of the iconic E minor theme
const BATTLE: Track = {
  tempo: 175,
  wave: 'square',
  bassWave: 'sawtooth',
  melodyVol: 0.09,
  bassVol: 0.045,
  melody: [
    // ---- Intro riff (iconic opening) ----
    [N.E5, 0.5], [N.B5, 0.5], [N.E5, 0.5], [N.B5, 0.5],
    [N.E5, 0.5], [N.B5, 0.5], [N.E5, 0.5], [N.B5, 0.5],
    [N.Eb5, 0.5], [N.Bb5, 0.5], [N.Eb5, 0.5], [N.Bb5, 0.5],
    [N.Eb5, 0.5], [N.Bb5, 0.5], [N.Eb5, 0.5], [N.Bb5, 0.5],

    // ---- Main melody A (Cynthia's signature phrase) ----
    [N.E5, 1], [N.G5, 0.5], [N.B5, 0.5],
    [N.A5, 0.5], [N.G5, 0.5], [N.E5, 1],
    [N.D5, 0.5], [N.E5, 0.5], [N.G5, 0.5], [N.A5, 0.5],
    [N.B5, 1], [N._, 1],

    [N.B5, 0.5], [N.A5, 0.5], [N.G5, 0.5], [N.E5, 0.5],
    [N.D5, 0.5], [N.E5, 0.5], [N.G5, 1],
    [N.A5, 0.5], [N.G5, 0.5], [N.Gb5, 0.5], [N.E5, 0.5],
    [N.E5, 1], [N._, 1],

    // ---- Melody B (rising tension) ----
    [N.E5, 0.5], [N.Gb5, 0.5], [N.G5, 0.5], [N.A5, 0.5],
    [N.B5, 1], [N.C6, 0.5], [N.B5, 0.5],
    [N.A5, 0.5], [N.G5, 0.5], [N.Gb5, 0.5], [N.E5, 0.5],
    [N.D5, 1], [N.E5, 1],

    [N.E5, 0.5], [N.G5, 0.5], [N.B5, 0.5], [N.D6, 0.5],
    [N.E6, 1], [N.D6, 0.5], [N.B5, 0.5],
    [N.C6, 0.5], [N.B5, 0.5], [N.A5, 0.5], [N.G5, 0.5],
    [N.B5, 1], [N._, 1],

    // ---- Melody C (climactic, dramatic octave jumps) ----
    [N.E6, 0.5], [N.D6, 0.5], [N.B5, 0.5], [N.G5, 0.5],
    [N.E5, 0.5], [N.G5, 0.5], [N.B5, 0.5], [N.D6, 0.5],
    [N.E6, 1], [N.D6, 0.5], [N.C6, 0.5],
    [N.B5, 1], [N.A5, 1],

    [N.G5, 0.5], [N.A5, 0.5], [N.B5, 0.5], [N.C6, 0.5],
    [N.D6, 0.5], [N.C6, 0.5], [N.B5, 0.5], [N.A5, 0.5],
    [N.G5, 0.5], [N.Gb5, 0.5], [N.E5, 0.5], [N.D5, 0.5],
    [N.E5, 2],

    // ---- Melody D (driving repeat of main motif, higher intensity) ----
    [N.B5, 0.5], [N.E6, 0.5], [N.B5, 0.5], [N.E6, 0.5],
    [N.B5, 0.5], [N.E6, 0.5], [N.D6, 0.5], [N.B5, 0.5],
    [N.A5, 0.5], [N.B5, 0.5], [N.A5, 0.5], [N.G5, 0.5],
    [N.Gb5, 0.5], [N.E5, 0.5], [N.D5, 0.5], [N.E5, 0.5],

    [N.Gb5, 0.5], [N.A5, 0.5], [N.B5, 0.5], [N.Db6, 0.5],
    [N.D6, 1], [N.E6, 0.5], [N.D6, 0.5],
    [N.B5, 0.5], [N.A5, 0.5], [N.G5, 0.5], [N.Gb5, 0.5],
    [N.E5, 2],

    // ---- Coda / turnaround ----
    [N.E5, 0.5], [N.G5, 0.5], [N.B5, 0.5], [N.E6, 0.5],
    [N.D6, 0.5], [N.B5, 0.5], [N.G5, 0.5], [N.B5, 0.5],
    [N.A5, 0.5], [N.Gb5, 0.5], [N.E5, 0.5], [N.Gb5, 0.5],
    [N.E5, 1], [N._, 1],

    [N.B4, 0.5], [N.E5, 0.5], [N.Gb5, 0.5], [N.G5, 0.5],
    [N.A5, 0.5], [N.B5, 0.5], [N.D6, 0.5], [N.E6, 0.5],
    [N.D6, 0.5], [N.B5, 0.5], [N.A5, 0.5], [N.G5, 0.5],
    [N.E5, 1], [N._, 1],
  ],
  bass: [
    // ---- Intro bass (driving E minor pedal) ----
    [N.E3, 0.5], [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5],
    [N.E3, 0.5], [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5],
    [N.Eb3, 0.5], [N.Eb3, 0.5], [N.Bb3, 0.5], [N.Eb3, 0.5],
    [N.Eb3, 0.5], [N.Eb3, 0.5], [N.Bb3, 0.5], [N.Eb3, 0.5],

    // ---- Main section bass (E minor chord progression) ----
    [N.E3, 0.5], [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5],
    [N.A3, 0.5], [N.A3, 0.5], [N.E3, 0.5], [N.A3, 0.5],
    [N.G3, 0.5], [N.G3, 0.5], [N.D3, 0.5], [N.G3, 0.5],
    [N.B3, 0.5], [N.B3, 0.5], [N.E3, 0.5], [N.B3, 0.5],

    [N.E3, 0.5], [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5],
    [N.D3, 0.5], [N.D3, 0.5], [N.A3, 0.5], [N.D3, 0.5],
    [N.C3, 0.5], [N.C3, 0.5], [N.G3, 0.5], [N.C3, 0.5],
    [N.E3, 0.5], [N.B3, 0.5], [N.E3, 1],

    // ---- B section bass (Gb minor tension) ----
    [N.E3, 0.5], [N.E3, 0.5], [N.Gb3, 0.5], [N.E3, 0.5],
    [N.G3, 0.5], [N.G3, 0.5], [N.B3, 0.5], [N.G3, 0.5],
    [N.A3, 0.5], [N.A3, 0.5], [N.Gb3, 0.5], [N.A3, 0.5],
    [N.D3, 0.5], [N.D3, 0.5], [N.E3, 0.5], [N.D3, 0.5],

    [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5], [N.B3, 0.5],
    [N.C3, 0.5], [N.G3, 0.5], [N.C3, 0.5], [N.G3, 0.5],
    [N.A3, 0.5], [N.E3, 0.5], [N.A3, 0.5], [N.E3, 0.5],
    [N.B3, 0.5], [N.B3, 0.5], [N.E3, 1],

    // ---- C section bass (dramatic descent) ----
    [N.E3, 0.5], [N.E3, 0.5], [N.G3, 0.5], [N.B3, 0.5],
    [N.E3, 0.5], [N.G3, 0.5], [N.B3, 0.5], [N.E3, 0.5],
    [N.C3, 0.5], [N.C3, 0.5], [N.E3, 0.5], [N.G3, 0.5],
    [N.B3, 0.5], [N.B3, 0.5], [N.A3, 0.5], [N.A3, 0.5],

    [N.G3, 0.5], [N.G3, 0.5], [N.E3, 0.5], [N.G3, 0.5],
    [N.D3, 0.5], [N.D3, 0.5], [N.A3, 0.5], [N.D3, 0.5],
    [N.C3, 0.5], [N.C3, 0.5], [N.G3, 0.5], [N.C3, 0.5],
    [N.E3, 1], [N.E3, 1],

    // ---- D section bass (relentless octave pattern) ----
    [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5], [N.B3, 0.5],
    [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5], [N.B3, 0.5],
    [N.A3, 0.5], [N.A3, 0.5], [N.E3, 0.5], [N.A3, 0.5],
    [N.Gb3, 0.5], [N.Gb3, 0.5], [N.D3, 0.5], [N.E3, 0.5],

    [N.Gb3, 0.5], [N.Gb3, 0.5], [N.A3, 0.5], [N.Gb3, 0.5],
    [N.D3, 0.5], [N.D3, 0.5], [N.E3, 0.5], [N.D3, 0.5],
    [N.B3, 0.5], [N.B3, 0.5], [N.Gb3, 0.5], [N.B3, 0.5],
    [N.E3, 1], [N.E3, 1],

    // ---- Coda bass ----
    [N.E3, 0.5], [N.E3, 0.5], [N.B3, 0.5], [N.E3, 0.5],
    [N.G3, 0.5], [N.G3, 0.5], [N.D3, 0.5], [N.G3, 0.5],
    [N.A3, 0.5], [N.A3, 0.5], [N.E3, 0.5], [N.A3, 0.5],
    [N.E3, 0.5], [N.B3, 0.5], [N.E3, 1],

    [N.E3, 0.5], [N.E3, 0.5], [N.Gb3, 0.5], [N.G3, 0.5],
    [N.A3, 0.5], [N.B3, 0.5], [N.D3, 0.5], [N.E3, 0.5],
    [N.G3, 0.5], [N.E3, 0.5], [N.A3, 0.5], [N.G3, 0.5],
    [N.E3, 0.5], [N.B3, 0.5], [N.E3, 1],
  ],
};

const VICTORY: Track = {
  tempo: 140,
  wave: 'square',
  bassWave: 'triangle',
  melodyVol: 0.08,
  bassVol: 0.06,
  melody: [
    // Triumphant fanfare — C major, bright
    [N.C5, 0.5], [N.E5, 0.5], [N.G5, 1],
    [N.C6, 2],
    [N.B5, 0.5], [N.A5, 0.5], [N.G5, 0.5], [N.A5, 0.5],
    [N.G5, 2],

    [N.E5, 0.5], [N.G5, 0.5], [N.A5, 0.5], [N.B5, 0.5],
    [N.C6, 2],
    [N.D6, 1], [N.C6, 0.5], [N.B5, 0.5],
    [N.C6, 3], [N._, 1],

    [N.G5, 0.5], [N.A5, 0.5], [N.B5, 0.5], [N.C6, 0.5],
    [N.D6, 1], [N.E6, 1],
    [N.D6, 0.5], [N.C6, 0.5], [N.B5, 0.5], [N.A5, 0.5],
    [N.G5, 2],

    [N.C5, 0.5], [N.E5, 0.5], [N.G5, 0.5], [N.C6, 0.5],
    [N.E6, 2],
    [N.D6, 0.5], [N.C6, 0.5],
    [N.C6, 3], [N._, 1],
  ],
  bass: [
    [N.C3, 2], [N.G3, 2], [N.F3, 2], [N.G3, 2],
    [N.A3, 2], [N.E3, 2], [N.G3, 2], [N.C3, 2],
    [N.C3, 2], [N.G3, 2], [N.G3, 2], [N.C3, 2],
    [N.C3, 2], [N.E3, 2], [N.G3, 2], [N.C3, 2],
  ],
};

const DEFEAT: Track = {
  tempo: 80,
  wave: 'triangle',
  bassWave: 'sine',
  melodyVol: 0.07,
  bassVol: 0.05,
  melody: [
    // Somber, minor key — A minor descending
    [N.A5, 2], [N.G5, 2],
    [N.F5, 2], [N.E5, 2],
    [N.D5, 1], [N.E5, 1], [N.F5, 1], [N.E5, 1],
    [N.D5, 2], [N._, 2],

    [N.C5, 2], [N.D5, 1], [N.E5, 1],
    [N.F5, 2], [N.E5, 1], [N.D5, 1],
    [N.C5, 1], [N.D5, 1], [N.C5, 2],
    [N.A4, 3], [N._, 1],

    [N.E5, 2], [N.D5, 2],
    [N.C5, 2], [N.B4, 2],
    [N.A4, 2], [N._, 2],
    [N.A4, 3], [N._, 1],
  ],
  bass: [
    [N.A3, 4], [N.F3, 4],
    [N.D3, 4], [N._, 4],
    [N.C3, 4], [N.F3, 4],
    [N.A3, 4], [N._, 4],
    [N.E3, 4], [N.C3, 4],
    [N.A3, 4], [N._, 4],
  ],
};

const TRACKS: Record<string, Track> = {
  'champion-room': CHAMPION_ROOM,
  'team-select': TEAM_SELECT,
  'battle': BATTLE,
  'victory': VICTORY,
  'defeat': DEFEAT,
};

// Tracks that use an MP3 file instead of chiptune synthesis
const MP3_TRACKS: Record<string, string> = {
  'intro': '/music/poke-and-chill.mp3',
  'champion-room': '/music/battle-gym-leader.mp3',
};

export type TrackName = keyof typeof TRACKS;

// ====== ENGINE ======

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private melodyGain: GainNode | null = null;
  private bassGain: GainNode | null = null;
  private scheduledSources: AudioBufferSourceNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private currentTrack: string | null = null;
  private _muted = false;
  private _volume = 0.5;
  private loopTimer: ReturnType<typeof setTimeout> | null = null;
  private playing = false;

  // MP3 playback
  private audioElement: HTMLAudioElement | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this._muted ? 0 : this._volume;
      this.gainNode.connect(this.ctx.destination);

      this.melodyGain = this.ctx.createGain();
      this.melodyGain.connect(this.gainNode);

      this.bassGain = this.ctx.createGain();
      this.bassGain.connect(this.gainNode);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private scheduleNotes(
    notes: Note[],
    startTime: number,
    beatDuration: number,
    waveform: OscillatorType,
    gainNode: GainNode,
    volume: number,
  ): number {
    const ctx = this.getContext();
    let time = startTime;

    for (const [freq, beats] of notes) {
      const dur = beats * beatDuration;
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = waveform;
        osc.frequency.value = freq;

        // Envelope: quick attack, sustain, quick release
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(volume, time + 0.01);
        noteGain.gain.setValueAtTime(volume, time + dur - 0.02);
        noteGain.gain.linearRampToValueAtTime(0, time + dur);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(time);
        osc.stop(time + dur);
        this.oscillators.push(osc);
      }
      time += dur;
    }

    return time; // total end time
  }

  play(trackName: string) {
    // Don't restart the same track
    if (this.currentTrack === trackName && this.playing) return;

    this.stopInternal();
    this.currentTrack = trackName;
    this.playing = true;

    // Check if this track has an MP3 file
    const mp3Url = MP3_TRACKS[trackName];
    if (mp3Url) {
      this.playMp3(mp3Url);
      return;
    }

    const track = TRACKS[trackName];
    if (!track) return;

    const ctx = this.getContext();
    const beatDuration = 60 / track.tempo;

    const scheduleLoop = () => {
      if (!this.playing || this.currentTrack !== trackName) return;

      const startTime = ctx.currentTime + 0.05;

      this.melodyGain!.gain.value = 1;
      this.bassGain!.gain.value = 1;

      const melodyEnd = this.scheduleNotes(
        track.melody, startTime, beatDuration,
        track.wave, this.melodyGain!, track.melodyVol,
      );

      this.scheduleNotes(
        track.bass, startTime, beatDuration,
        track.bassWave, this.bassGain!, track.bassVol,
      );

      // Schedule next loop
      const loopDuration = (melodyEnd - startTime) * 1000;
      this.loopTimer = setTimeout(() => {
        // Clean up old oscillators
        this.oscillators = this.oscillators.filter(o => {
          try { o.disconnect(); } catch { /* already stopped */ }
          return false;
        });
        scheduleLoop();
      }, loopDuration - 50);
    };

    scheduleLoop();
  }

  private stopInternal() {
    this.playing = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    // Stop chiptune oscillators
    for (const osc of this.oscillators) {
      try { osc.stop(); osc.disconnect(); } catch { /* already stopped */ }
    }
    this.oscillators = [];
    for (const src of this.scheduledSources) {
      try { src.stop(); src.disconnect(); } catch { /* already stopped */ }
    }
    this.scheduledSources = [];
    // Stop MP3
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
  }

  private playMp3(url: string) {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this._muted ? 0 : this._volume;
    audio.play().catch(() => { /* autoplay blocked, will resume on interaction */ });
    this.audioElement = audio;
  }

  stop() {
    this.currentTrack = null;
    this.stopInternal();
  }

  get muted() { return this._muted; }

  setMuted(muted: boolean) {
    this._muted = muted;
    if (this.gainNode) {
      this.gainNode.gain.value = muted ? 0 : this._volume;
    }
    if (this.audioElement) {
      this.audioElement.volume = muted ? 0 : this._volume;
    }
  }

  toggleMute() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  get volume() { return this._volume; }

  setVolume(vol: number) {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && !this._muted) {
      this.gainNode.gain.value = this._volume;
    }
    if (this.audioElement && !this._muted) {
      this.audioElement.volume = this._volume;
    }
  }

  get isPlaying() { return this.playing; }
  get track() { return this.currentTrack; }
}

// Singleton instance
export const musicEngine = new ChiptuneEngine();
