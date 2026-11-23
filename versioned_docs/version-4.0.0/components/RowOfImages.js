import React from "react";

export default function RowOfImages({
  imagePath1,
  imagePath2,
  alt1 = "",
  alt2 = "",
}) {
  return (
    <div className={"docs-centered-image-wrapper"}>
      <div className="row">
        <div className="col col--6">
          <img
            className="docs-centered-image-size-100"
            src={imagePath1}
            alt={alt1}
          />
        </div>
        <div className="col col--6">
          <img
            className="docs-centered-image-size-100"
            src={imagePath2}
            alt={alt2}
          />
        </div>
      </div>
    </div>
  );
}
