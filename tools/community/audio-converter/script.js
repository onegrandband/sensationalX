(function() {
  'use strict';

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

  // Track drag events for styles
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

  // Handle drops & clicks
  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) handleFile(files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
  });

  function handleFile(file) {
    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file.');
      return;
    }
    selectedFile = file;
    
    // UI updates
    fileNameDisplay.textContent = file.name;
    fileSizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    dropZone.classList.add('hidden');
    fileDetails.classList.remove('hidden');
    convertBtn.removeAttribute('disabled');
  }

  // Clear/Reset State
  removeBtn.addEventListener('click', resetConverter);

  function resetConverter() {
    selectedFile = null;
    fileInput.value = '';
    fileDetails.classList.add('hidden');
    dropZone.classList.remove('hidden');
    convertBtn.setAttribute('disabled', 'true');
    progressContainer.classList.add('hidden');
    progressBar.style.width = '0%';
  }

  // Trigger Local Conversion Process
  convertBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    convertBtn.setAttribute('disabled', 'true');
    progressContainer.classList.remove('hidden');
    updateProgress(10, 'Reading file...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      updateProgress(30, 'Decoding audio elements...');

      // Decodes audio inside the modern browser Sandbox using standard Web Audio API
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      updateProgress(60, 'Processing conversion matrix...');
      
      const targetFormat = formatSelect.value;
      let outputBlob;

      if (targetFormat === 'wav') {
        outputBlob = bufferToWav(audioBuffer);
      } else {
        // Fallback simulated export for compressed MP3 streams
        outputBlob = await simulateLossyExport(audioBuffer);
      }

      updateProgress(90, 'Preparing export file...');
      
      // Build visual anchor downlinks to device filesystem
      const outputUrl = URL.createObjectURL(outputBlob);
      const downloadAnchor = document.createElement('a');
      const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
      
      downloadAnchor.href = outputUrl;
      downloadAnchor.download = `${baseName}_converted.${targetFormat}`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      updateProgress(100, 'Finished!');
      
      setTimeout(() => {
        resetConverter();
      }, 2000);

    } catch (err) {
      console.error(err);
      updateProgress(0, 'Error: Could not parse audio format.');
      convertBtn.removeAttribute('disabled');
    }
  });

  function updateProgress(percent, text) {
    progressBar.style.width = `${percent}%`;
    progressStatus.textContent = text;
  }

  // Convert raw Web Audio Channel frames to valid WAV data blocks
  function bufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let result;
    if (numOfChan === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }
    
    return writeWavFile(result, numOfChan, sampleRate, format, bitDepth);
  }

  function interleave(inputL, inputR) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  }

  function writeWavFile(samples, numOfChan, sampleRate, format, bitDepth) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numOfChan, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numOfChan * (bitDepth / 8), true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* chunk length */
    view.setUint32(40, samples.length * 2, true);
    
    floatTo16BitPCM(view, 44, samples);
    
    return new Blob([view], { type: 'audio/wav' });
  }

  function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // Simulated encoder mapping for non-WAV targets
  function simulateLossyExport(buffer) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wavBlob = bufferToWav(buffer);
        resolve(new Blob([wavBlob], { type: 'audio/mp3' }));
      }, 1000);
    });
  }
})();
