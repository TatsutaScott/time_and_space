import RNBO_device from "./util/rnbo_util";

export function init_RNBO(patcher, onload = () => null) {
  const device = new RNBO_device(); //make new device

  device.init(patcher).then(() => {
    console.log(device);

    device.getInput(); //set audio in stream
    console.log("RNBO device loaded successfully");

    device.onMessage((e) => {
      switch (e.tag) {
        case "out3":
          if (e.payload == "1111") {
            // audio is done recording
            console.log("audio recorded successfully");
            device.sendMessage("in3", [0]); // turn off recording

            // console.log("initiating main patch");
            // device.sendMessage("in4", [1]); // start main patch
          }
          break;
        default:
      }
    });

    onload(); // run what ever function needs to be run after loading device
  });

  return device;
}
