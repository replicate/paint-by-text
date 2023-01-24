import React from "react";
import Image from "next/image";
import { ReactSketchCanvas } from "react-sketch-canvas";
import Spinner from "components/spinner";

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  onChange = async () => {
    const paths = await this.canvas.current.exportPaths();

    // only respond if there are paths to draw (don't want to send a blank canvas)
    if (paths.length) {
      const data = await this.canvas.current.exportImage("svg");
      this.props.onDraw(data);
    }
  };

  render() {
    const predictions = this.props.predictions.map((prediction) => {
      prediction.lastImage = prediction.output
        ? prediction.output[prediction.output.length - 1]
        : null;
      return prediction;
    });

    const predicting = predictions.some((prediction) => !prediction.output);
    const lastPrediction = predictions[predictions.length - 1];

    return (
      <div className="relative w-full aspect-square">
        {/* PREDICTION IMAGES */}

        {!this.props.userUploadedImage &&
          predictions
            .filter((prediction) => prediction.output)
            .map((prediction, index) => (
              <Image
                alt={"prediction" + index}
                key={"prediction" + index}
                layout="fill"
                className="absolute animate-in fade-in"
                style={{ zIndex: index }}
                src={prediction.lastImage}
              />
            ))}

        {/* USER UPLOADED IMAGE */}
        {this.props.userUploadedImage && (
          <Image
            src={URL.createObjectURL(this.props.userUploadedImage)}
            alt="preview image"
            layout="fill"
          />
        )}

        {/* SPINNER */}
        {predicting && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: predictions.length + 100 }}
          >
            <div className="p-4 w-40 bg-white text-center rounded-lg animate-in zoom-in">
              <Spinner />
              <p className="pt-3 opacity-30 text-center text-sm">
                {lastPrediction.status}
              </p>
            </div>
          </div>
        )}

        {(predictions.length > 0 || this.props.userUploadedImage) &&
          !predicting && (
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ zIndex: predictions.length + 100 }}
            >
              <ReactSketchCanvas
                ref={this.canvas}
                strokeWidth={80}
                strokeColor="black"
                canvasColor="transparent"
                onChange={this.onChange}
              />
            </div>
          )}
      </div>
    );
  }
}
