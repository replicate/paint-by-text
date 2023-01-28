import React from "react";
import Image from "next/future/image";
import PulseLoader from "react-spinners/PulseLoader";

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="canvas w-full">
        {this.props.events.map((ev, index) => {
          if (ev.image) {
            return (
              <div key={"event-" + index} className="w-full">
                <Image
                  alt={"event" + index}
                  width="512"
                  height="512"
                  priority={true}
                  className="w-full h-auto mb-10 rounded-lg"
                  src={ev.image}
                />
              </div>
            );
          }

          if (ev.prompt) {
            return (
              <div key={"event-" + index} className="text-right">
                <div className="inline-block bg-blue-600 text-right text-white p-3 rounded-lg mb-8">
                  {ev.prompt}
                </div>
              </div>
            );
          }
        })}

        {this.props.isProcessing && (
          <div>
            <div className="inline-block text-black bg-gray-200 p-3 rounded-lg mb-8">
              <PulseLoader color="#999" size={7} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
