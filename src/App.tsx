import { createSignal } from "solid-js";

function App() {
  const isRecording = createSignal(false);

  let blob: Blob, mediaRecorder: MediaRecorder;
  let chunks: Blob[] = [];

  async function startRecording() {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      //@ts-ignore
      video: { mediaSource: "screen" },
      audio: {
        //@ts-ignore
        suppressLocalAudioPlayback: false,
      },
    });

    stream.getTracks()[0].onended = () => {
      stopRecording();
    };

    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    mediaRecorder.onstop = () => {
      isRecording[1](false);

      let filename = "video";

      blob = new Blob(chunks, { type: "video/webm" });
      chunks = []; // Resetting the data chunks
      let dataDownloadUrl = URL.createObjectURL(blob);

      // Download it onto the user's device
      let a = document.createElement("a");
      a.href = dataDownloadUrl;
      a.download = `${filename}.webm`;
      a.click();

      URL.revokeObjectURL(dataDownloadUrl);
    };
    mediaRecorder.start(250);
  }

  function stopRecording() {
    mediaRecorder.stop(); // Stopping the recording
  }

  return (
    <>
      <div id="audio-recorder">
        <div id="audio-recorder-display">
          {isRecording[0]() ? "Recording" : "--"}
        </div>

        <div class="buttons">
          <button
            id="record"
            onClick={() => {
              isRecording[1]((v) => !v); // Start / Stop recording
              if (isRecording[0]()) {
                startRecording(); // Start the recording
              } else {
                stopRecording(); // Stop screen recording
              }
            }}
            class={"metalbtn " + (isRecording[0]() ? "active" : "")}
          ></button>
        </div>
      </div>
    </>
  );
}

export default App;
