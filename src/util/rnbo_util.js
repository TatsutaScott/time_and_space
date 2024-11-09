import { createDevice, TimeNow, MessageEvent } from "@rnbo/js";

class RNBO_device {
  constructor() {
    const WAContext = window.AudioContext || window.webkitAudioContext; // this is what the audio will play through
    this.context = new WAContext({
      latencyHint: "interactive",
      sampleRate: 44100,
    });
    this.gainNode = new GainNode(this.context);
    this.gainNode.connect(this.context.destination);
    //this.gainNode.gain.value = 0;
  }

  async init(patcher, dependencies) {
    this.device = await createDevice({ context: this.context, patcher });
    this.device.node.connect(this.context.destination);

    // Load the dependencies into the device
    if (dependencies) {
      const results = await this.device.loadDataBufferDependencies(
        dependencies
      );
      results.forEach((result) => {
        if (result.type === "success") {
          console.log(`Successfully loaded buffer with id ${result.id}`);
        } else {
          console.log(
            `Failed to load buffer with id ${result.id}, ${result.error}`
          );
        }
      });
    }

    document.addEventListener("click", () => this.context.resume());
  }

  sendMessage(tag, message) {
    const event1 = new MessageEvent(TimeNow, tag, [message]);
    this.device.scheduleEvent(event1);
  }

  setParam(param, value) {
    const p = this.device.parametersById.get(param);
    p.value = value;
  }

  getInput() {
    const handle = (stream) => {
      const input = this.context.createMediaStreamSource(stream);
      input.connect(this.device.node);
      this.mic = stream.getAudioTracks()[0];
    };

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      })
      .then(handle)
      .catch(function (err) {
        console.error("Error accessing the microphone: ", err);
      });
  }

  muteMic() {
    this.mic.stop();
  }

  onMessage(func) {
    // Subscribe method executes code whenever a message is received from the RNBO device
    // Switch statement updates parameters based on the outlet of the RNBO device
    this.device.messageEvent.subscribe((e) => func(e));
  }
}

export default RNBO_device;

// example message function
// (e) => {
//     switch (e.tag) {
//       case "out3":
//         point_arr = e.payload;
//         break;
//       case "out4":
//         dist_arr = e.payload;
//         break;
//       default:
//         console.log(e);
//     }
//   };
