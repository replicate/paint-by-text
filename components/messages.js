import Image from "next/future/image";
import { useEffect, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";

export default function Messages({ events, isProcessing }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (events.length > 2) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <section className="w-full">
      {events.map((ev, index) => {
        if (ev.image) {
          return (
            <div key={"image-" + index} className="w-full">
              <div className="mb-2 mr-16 bg-gray-200 p-3 rounded-lg">
                <Image
                  alt={
                    ev.prompt
                      ? `The result of the prompt "${ev.prompt}" on the previous image`
                      : "The source image"
                  }
                  width="512"
                  height="512"
                  priority={true}
                  className="w-full h-auto rounded-lg"
                  src={ev.image}
                />
              </div>

              {(isProcessing || index < events.length - 1) && (
                <div>
                  <div className="inline-block text-black bg-gray-200 p-3 rounded-lg mb-8">
                    What should we change?
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (ev.prompt) {
          return (
            <div key={"prompt-" + index} className="text-right ml-16">
              <div className="inline-block bg-blue-600 text-right text-white p-3 rounded-lg mb-8">
                {ev.prompt}
              </div>
            </div>
          );
        }
      })}

      {isProcessing && (
        <div className="mr-16">
          <div className="inline-block text-black bg-gray-200 p-3 rounded-lg mb-8">
            <PulseLoader color="#999" size={7} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </section>
  );
}
