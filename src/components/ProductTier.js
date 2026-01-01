import React from "react";

const ProductTier = ({tiers, offerings}) => {
  return (
    <div className="my-4 rounded-lg border border-gray-300 bg-[#fff8f5] p-4 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-[#23272f] dark:text-gray-100">
      <div className="flex flex-col gap-2">
        {tiers && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Tier:</span>
            <span>{Array.isArray(tiers) ? tiers.join(", ") : tiers}</span>
          </div>
        )}
        {offerings && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Offering:</span>
            <span>
              {Array.isArray(offerings) ? offerings.join(", ") : offerings}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTier;
