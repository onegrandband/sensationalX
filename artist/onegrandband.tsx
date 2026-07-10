"use client"

import { useState, useRef, useEffect, ChangeEvent } from "react"
import { Play, Pause, Music, Download, Rewind, FastForward, SkipBack, SkipForward, Volume2, X, ListMusic } from "lucide-react"

// 1. Track interface with Key and Time Signature
interface Track {
  id: string;
  title: string;
  genre: string;
  bpm: string;
  musicKey: string;
  timeSignature: string;
  streamUrl: string;
  downloadUrl: string;
}

// 2. Catalog Interface to group albums vs singles
interface CatalogItem {
  id: string;
  title: string;
  type: "single" | "album";
  genre: string;
  coverLabel: string;
  tracks: Track[];
}

// --- DATA DEFINITION ---

// Explicitly listed 11 tracks for the July Fun album
const julyFunTracks: Track[] = [
  {
    id: "jf-1",
    title: "Good Times",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/kaxem8.wav", 
    downloadUrl: "" 
  },
  {
    id: "jf-2",
    title: "One Grand Afternoon",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/yijftf.wav",
    downloadUrl: ""
  },
  {
    id: "jf-3",
    title: "In Monopoly",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "",
    downloadUrl: ""
  },
  {
    id: "jf-4",
    title: "Brown Eyed Boy",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "",
    downloadUrl: ""
  },
  {
    id: "jf-5",
    title: "Flowers for GMA",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/zl7fq6.wav",
    downloadUrl: ""
  },
  {
    id: "jf-6",
    title: "RIBALICIOUS",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/0uwnjg.wav",
    downloadUrl: ""
  },
  {
    id: "jf-7",
    title: "discoparty",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/4nift9.wav",
    downloadUrl: ""
  },
  {
    id: "jf-8",
    title: "where joy lives",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/u0q0n9.wav",
    downloadUrl: ""
  },
  {
    id: "jf-9",
    title: "doodle down",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "https://files.catbox.moe/wbzujf.wav",
    downloadUrl: ""
  },
  {
    id: "jf-10",
    title: "the days",
    genre: "July Fun",
    bpm: "TBD",
    musicKey: "TBD",
    timeSignature: "TBD",
    streamUrl: "",
    downloadUrl: ""
  },
  {
    id: "jf-11",
    title: "Relaxed Afternoon",
    genre: "July Fun",
    bpm: "110 BPM",
    musicKey: "C Major / 8B Camelot",
    timeSignature: "4/4",
    streamUrl: "https://files.catbox.moe/ndxt0a.wav",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1Dbw6uhVxFItVdXpf8WqSh-WmEpuUFX1P"
  }
]

const catalog: CatalogItem[] = [
  {
    id: "cat-1",
    title: "El Puerto One Mitad",
    type: "single",
    genre: "R&B/Soul",
    coverLabel: "Single",
    tracks: [
      {
        id: "t-1",
        title: "El Puerto One Mitad",
        genre: "Chillhop",
        bpm: "85 BPM",
        musicKey: "B Minor / 10A Camelot",
        timeSignature: "4/4",
        streamUrl: "https://files.catbox.moe/7nfr9e.wav",
        downloadUrl: "https://drive.google.com/uc?export=download&id=17XaPKsPLCTJ48j4Kt-tMcO_SAN6CsdiV"
      }
    ]
  },
  {
    id: "cat-2",
    title: "Relaxed Afternoon",
    type: "single",
    genre: "Chill Out",
    coverLabel: "Single",
    tracks: [
      {
        id: "t-2",
        title: "Relaxed Afternoon",
        genre: "Chill Out",
        bpm: "110 BPM",
        musicKey: "C Major / 8B Camelot",
        timeSignature: "4/4",
        streamUrl: "https://files.catbox.moe/ndxt0a.wav",
        downloadUrl: "https://drive.google.com/uc?export=download&id=1Dbw6uhVxFItVdXpf8WqSh-WmEpuUFX1P"
      }
    ]
  },
  {
    id: "cat-3",
    title: "Plants of GMA",
    type: "single",
    genre: "Acoustic", // Feel free to change this genre!
    coverLabel: "Single",
    tracks: [
      {
        id: "t-3",
        title: "Plants of GMA",
        genre: "Acoustic",
        bpm: "TBD",
        musicKey: "TBD",
        timeSignature: "TBD",
        streamUrl: "https://files.catbox.moe/7du7pj.wav",
        downloadUrl: ""
      }
    ]
  },
  {
    id: "cat-4",
    title: "July Fun",
    type: "album",
    genre: "Acoustic",
    coverLabel: "11 Tracks",
    tracks: julyFunTracks
  }
]

export function MusicSection() {
  // --- STATE ---
  const [activeQueue, setActiveQueue] = useState<Track[]>([])
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0)
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<string>("0:00")
  const [duration, setDuration] = useState<string>("0:00")
  const [volume, setVolume] = useState<number>(1)
  
  // UI State for the Album Modal
  const [selectedAlbum, setSelectedAlbum] = useState<CatalogItem | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeTrack: Track | null = activeQueue.length > 0 ? activeQueue[activeTrackIndex] : null

  // --- AUDIO HELPERS ---
  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handlePlayRequest = (queueToPlay: Track[], trackIndexToPlay: number): void => {
    const track = queueToPlay[trackIndexToPlay]
    
    if (!track || track.streamUrl === "") {
      alert("This track hasn't been uploaded yet!")
      return
    }

    if (activeTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
    } else {
      setActiveQueue(queueToPlay)
      setActiveTrackIndex(trackIndexToPlay)
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (activeTrack && audioRef.current && activeTrack.streamUrl !== "") {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [activeTrackIndex, activeQueue, activeTrack])

  // --- AUDIO EVENTS ---
  const handleTimeUpdate = (): void => {
    const current = audioRef.current?.currentTime || 0
    const total = audioRef.current?.duration || 1
    setProgress((current / total) * 100)
    setCurrentTime(formatTime(current))
  }

  const handleLoadedMetadata = (): void => {
    setDuration(formatTime(audioRef.current?.duration || 0))
  }

  const handleEnded = (): void => {
    if (activeTrackIndex < activeQueue.length - 1) {
      const nextTrack = activeQueue[activeTrackIndex + 1]
      if (nextTrack && nextTrack.streamUrl !== "") {
        setActiveTrackIndex(activeTrackIndex + 1)
      } else {
        setIsPlaying(false)
        setProgress(0)
      }
    } else {
      setIsPlaying(false)
      setProgress(0)
    }
  }

  // --- PLAYER CONTROLS ---
  const handleSeek = (e: ChangeEvent<HTMLInputElement>): void => {
    const seekTime = (Number(e.target.value) / 100) * (audioRef.current?.duration || 0)
    if (audioRef.current) audioRef.current.currentTime = seekTime
    setProgress(Number(e.target.value))
  }

  const handleVolume = (e: ChangeEvent<HTMLInputElement>): void => {
    const vol = Number(e.target.value)
    if (audioRef.current) audioRef.current.volume = vol
    setVolume(vol)
  }

  const skipTime = (amount: number): void => {
    if (audioRef.current) audioRef.current.currentTime += amount
  }

  const skipTrack = (direction: number): void => {
    if (activeQueue.length === 0) return
    const newIndex = activeTrackIndex + direction
    if (newIndex >= 0 && newIndex < activeQueue.length && activeQueue[newIndex]?.streamUrl !== "") {
      setActiveTrackIndex(newIndex)
    }
  }

  return (
    <section id="music" className="relative min-h-screen bg-[#0b0b0c] px-[8%] py-24 pb-48 text-center text-white">
      
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        src={activeTrack?.streamUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <h2 className="mb-12 text-3xl font-bold md:text-4xl">
        The Catalog
        <span className="mx-auto mt-2.5 block h-1 w-12 rounded-sm bg-[#ff3366]" />
      </h2>

      {/* Main Catalog Grid */}
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((item) => {
          const isItemActive = activeQueue.some(t => item.tracks.some(it => it.id === t.id))
          
          return (
            <article
              key={item.id}
              className={`group overflow-hidden rounded-xl border bg-[#1c1c1f] transition-all ${isItemActive ? 'border-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.15)]' : 'border-[#2a2a2e] hover:border-[#ff3366]/50'}`}
            >
              {/* Art Area */}
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-[#251124] to-[#1c1c1f]">
                {item.type === 'album' ? (
                  <ListMusic size={56} className="text-[#ff3366]/70 transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <Music size={56} className="text-[#ff3366]/70 transition-transform duration-500 group-hover:scale-110" />
                )}
                
                {/* Interaction Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  
                  {item.type === 'single' && item.tracks[0] ? (
                    <>
                      <button 
                        onClick={() => handlePlayRequest(item.tracks, 0)}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3366] text-white shadow-lg transition-transform hover:scale-105"
                      >
                        {activeTrack?.id === item.tracks[0].id && isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
                      </button>
                      
                      {item.tracks[0].downloadUrl === "" ? (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2a2e] text-gray-500 shadow-lg cursor-not-allowed">
                          <Download size={26} />
                        </div>
                      ) : (
                        <a 
                          href={item.tracks[0].downloadUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2a2e] text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-500"
                        >
                          <Download size={26} />
                        </a>
                      )}
                    </>
                  ) : (
                    <button 
                      onClick={() => setSelectedAlbum(item)}
                      className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#ff3366] px-6 font-semibold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <ListMusic size={20} />
                      Preview Tracks
                    </button>
                  )}
                </div>
              </div>

              {/* Item Info */}
              <div className="flex flex-col p-5 text-left">
                <h3 className="mb-1 text-lg font-semibold tracking-tight">{item.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="rounded bg-[#2a2a2e] px-2 py-1 font-medium text-[#ff3366]">{item.genre}</span>
                  <span>•</span>
                  <span>{item.coverLabel}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* --- ALBUM PREVIEW MODAL --- */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-[#2a2a2e] bg-[#1c1c1f] shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2a2a2e] bg-[#251124]/30 px-6 py-4">
              <div className="text-left">
                <h3 className="text-xl font-bold">{selectedAlbum.title}</h3>
                <p className="text-sm text-[#ff3366]">{selectedAlbum.coverLabel}</p>
              </div>
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-[#2a2a2e] hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Tracklist */}
            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {selectedAlbum.tracks.map((track, index) => {
                const isThisPlaying = activeTrack?.id === track.id && isPlaying
                const isPlaceholder = track.streamUrl === ""

                return (
                  <div 
                    key={track.id} 
                    className={`group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-[#2a2a2e]/50 ${isPlaceholder ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
                  >
                    {/* Left: Play button & Title */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handlePlayRequest(selectedAlbum.tracks, index)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${isThisPlaying ? 'bg-[#ff3366] text-white' : 'bg-[#2a2a2e] text-gray-400 group-hover:bg-[#ff3366] group-hover:text-white'}`}
                      >
                        {isThisPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                      </button>
                      <div className="text-left">
                        <p className={`font-medium ${isThisPlaying ? 'text-[#ff3366]' : 'text-white'}`}>{track.title}</p>
                        
                        {/* Metadata Tags */}
                        <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-medium sm:text-xs">
                          <span className="rounded bg-[#0b0b0c] px-2 py-0.5 text-gray-400">{track.bpm}</span>
                          <span className="rounded bg-[#0b0b0c] px-2 py-0.5 text-blue-400/80">{track.musicKey}</span>
                          <span className="rounded bg-[#0b0b0c] px-2 py-0.5 text-purple-400/80">{track.timeSignature}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Download Control (Swapped to div when empty to keep Vercel happy) */}
                    {track.downloadUrl === "" ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-transparent bg-transparent cursor-not-allowed">
                        <Download size={18} />
                      </div>
                    ) : (
                      <a 
                        href={track.downloadUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2a2a2e] text-gray-400 transition-all hover:bg-blue-500 hover:text-white"
                      >
                        <Download size={18} />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      )}

      {/* --- STICKY BOTTOM PLAYER --- */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] border-t border-[#2a2a2e] bg-[#0b0b0c]/95 px-4 py-4 backdrop-blur-xl transition-transform duration-500 ${activeTrack ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          
          {/* Player Info & Visualizer */}
          <div className="flex w-full items-center gap-4 md:w-1/4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#ff3366] to-[#251124] shadow-md">
              <Music size={20} className="text-white/80" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-bold text-white">{activeTrack?.title}</h4>
              <p className="truncate text-xs text-[#ff3366]">
                {activeTrack?.genre} • {activeTrack?.bpm} • {activeTrack?.musicKey}
              </p>
            </div>
            
            {/* Visualizer */}
            {isPlaying && (
              <div className="flex h-4 items-end gap-0.5 opacity-70">
                <span className="h-[80%] w-1 animate-[bounce_1s_infinite_ease-in-out] rounded-t-sm bg-[#ff3366]" style={{ animationDelay: '0.0s' }} />
                <span className="h-[100%] w-1 animate-[bounce_1s_infinite_ease-in-out] rounded-t-sm bg-[#ff3366]" style={{ animationDelay: '0.2s' }} />
                <span className="h-[60%] w-1 animate-[bounce_1s_infinite_ease-in-out] rounded-t-sm bg-[#ff3366]" style={{ animationDelay: '0.4s' }} />
                <span className="h-[90%] w-1 animate-[bounce_1s_infinite_ease-in-out] rounded-t-sm bg-[#ff3366]" style={{ animationDelay: '0.1s' }} />
              </div>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex w-full flex-1 flex-col items-center gap-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => skipTrack(-1)} disabled={activeTrackIndex === 0} className="text-gray-400 transition-colors hover:text-white disabled:opacity-30">
                <SkipBack size={20} />
              </button>
              <button onClick={() => skipTime(-10)} className="text-gray-400 transition-colors hover:text-white">
                <Rewind size={20} />
              </button>
              
              <button 
                onClick={() => {
                  if (activeTrack) handlePlayRequest(activeQueue, activeTrackIndex)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 hover:bg-[#ff3366] hover:text-white"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </button>
              
              <button onClick={() => skipTime(10)} className="text-gray-400 transition-colors hover:text-white">
                <FastForward size={20} />
              </button>
              <button onClick={() => skipTrack(1)} disabled={activeTrackIndex === activeQueue.length - 1} className="text-gray-400 transition-colors hover:text-white disabled:opacity-30">
                <SkipForward size={20} />
              </button>
            </div>

            <div className="flex w-full max-w-xl items-center gap-3 text-xs font-medium text-gray-400">
              <span className="w-8 text-right">{currentTime}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[#2a2a2e] accent-[#ff3366]"
              />
              <span className="w-8">{duration}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden w-1/4 justify-end md:flex">
            <div className="flex w-24 items-center gap-2 text-gray-400 hover:text-white">
              <Volume2 size={18} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#2a2a2e] accent-[#ff3366]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
