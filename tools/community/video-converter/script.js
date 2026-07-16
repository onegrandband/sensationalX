(function() {
  'use strict';

  // Constants for CDN dependencies (FFmpeg WebAssembly)
  const FFMPEG_CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js';

  // Elements
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileDetails = document.getElementById('file-details');
  const fileNameDisplay = document.getElementById('file-name');
  const fileSizeDisplay = document.getElementById('file-size');
  const removeBtn = document.getElementById('remove-btn');
  const convertBtn = document.getElementById('convert-btn');
  const formatSelect = document.getElementById('format-select');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressStatus = document.getElementById('progress-status');

  let selectedFile = null;
  let ffmpegInstance = null;

  // Track Drag Event States
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt.files.length) handleFileSelection(dt.files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileSelection(e.target.files[0]);
  });

  function handleFileSelection(file) {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file format.');
      return;
    }
    selectedFile = file;
    
    // Manage UI Displays
    fileNameDisplay.textContent = file.name;
    fileSizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    dropZone.classList.add('hidden');
    fileDetails.classList.remove('hidden');
    convertBtn.removeAttribute('disabled');
  }

  // Clear App State
  removeBtn.addEventListener('click', resetTranscoder);

  function resetTranscoder() {
    selectedFile = null;
    fileInput.value = '';
    fileDetails.classList.add('hidden');
    dropZone.classList.remove('hidden');
    convertBtn.setAttribute('disabled', 'true');
    progressContainer.classList.add('hidden');
    progressBar.style.width = '0%';
  }

  convertBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    convertBtn.setAttribute('disabled', 'true');
    progressContainer.classList.remove('hidden');
    updateProgress(15, 'Loading transcoding scripts...');

    try {
      // 1. Load FFmpeg.wasm if not already initialized
      if (!ffmpegInstance) {
        await loadFFmpegScripts();
        ffmpegInstance = FFmpeg.createFFmpeg({ 
          log: true,
          corePath: FFMPEG_CORE_URL
        });
        await ffmpegInstance.load();
      }

      updateProgress(35, 'Writing video source to sandboxed filesystem...');
      const { name } = selectedFile;
      const extension = name.substring(name.lastIndexOf('.') + 1);
      const inputFilename = `input.${extension}`;
      const outputFormat = formatSelect.value;
      const outputFilename = `output.${outputFormat}`;

      const fileData = await selectedFile.arrayBuffer();
      ffmpegInstance.FS('writeFile', inputFilename, new Uint8Array(fileData));

      updateProgress(50, 'Converting video frames... (This may take a moment)');

      let ffmpegArgs = [];
      if (outputFormat === 'mp4') {
        ffmpegArgs = ['-i', inputFilename, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac', outputFilename];
      } else if (outputFormat === 'webm') {
        ffmpegArgs = ['-i', inputFilename, '-c:v', 'libvpx', '-b:v', '1M', '-c:a', 'libvorbis', outputFilename];
      } else if (outputFormat === 'gif') {
        ffmpegArgs = ['-i', inputFilename, '-vf', 'fps=10,scale=320:-1:flags=lanczos', '-gifflags', '+transdiff', outputFilename];
      }

      ffmpegInstance.setProgress(({ ratio }) => {
        const percent = Math.min(50 + Math.floor(ratio * 40), 90);
        updateProgress(percent, `Processing: ${Math.floor(ratio * 100)}% complete...`);
      });

      await ffmpegInstance.run(...ffmpegArgs);
      
      updateProgress(95, 'Finalizing download stream...');

      const processedData = ffmpegInstance.FS('readFile', outputFilename);
      const outputBlob = new Blob([processedData.buffer], { type: `video/${outputFormat}` });
      const downloadUrl = URL.createObjectURL(outputBlob);
      
      const downloadAnchor = document.createElement('a');
      const baseName = name.substring(0, name.lastIndexOf('.'));
      
      downloadAnchor.href = downloadUrl;
      downloadAnchor.download = `${baseName}_converted.${outputFormat}`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      ffmpegInstance.FS('unlink', inputFilename);
      ffmpegInstance.FS('unlink', outputFilename);

      updateProgress(100, 'Finished!');
      setTimeout(resetTranscoder, 2500);

    } catch (err) {
      console.error(err);
      updateProgress(0, 'An error occurred during transcoding. Please try a smaller file.');
      convertBtn.removeAttribute('disabled');
    }
  });

  function updateProgress(percent, text) {
    progressBar.style.width = `${percent}%`;
    progressStatus.textContent = text;
  }

  // Helpers to dynamically load external FFmpeg scripts safely
  function loadFFmpegScripts() {
    return new Promise((resolve, reject) => {
      if (window.FFmpeg) return resolve();
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.0/dist/ffmpeg.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
})();
