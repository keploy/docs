import React, { useState } from "react";
import ArrowUpRight from "../../static/img/ArrowUpRight.svg";

const GlossaryCard = ({ name, description, link }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        tabIndex={0}
        role="button"
        onClick={() => setOpen(true)}
        onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && setOpen(true)}
        className="group flex h-full flex-col rounded-xl border border-transparent bg-[var(--ifm-card-background-color)] p-6 shadow-[0_4px_12px_var(--ifm-card-shadow-color)] transition-all duration-300 hover:border-[var(--ifm-color-primary)] hover:shadow-[0_8px_20px_var(--ifm-card-shadow-color)] focus:outline-none focus:ring-2 focus:ring-[var(--ifm-color-primary)] focus:ring-offset-2 cursor-pointer"
        aria-label={`Show definition for ${name}`}
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="pr-4 text-xl font-bold text-[var(--ifm-color-primary)]">
            {name}
          </h3>
          <ArrowUpRight
            className=" flex-shrink-0 text-[var(--ifm-color-emphasis-500)] transition-all duration-300 ease-in-out group-hover:rotate-45 group-hover:text-[var(--ifm-color-primary)]"
            size={22}
          />
        </div>
        <p className="text-sm leading-relaxed text-[var(--ifm-color-emphasis-700)]">
          {description}
        </p>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[var(--ifm-color-primary)]">{name}</h2>
            <p className="mb-6 text-[var(--ifm-color-emphasis-700)]">{description}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-[var(--ifm-color-primary)] px-4 py-2 font-semibold text-white hover:bg-[var(--ifm-color-primary-darker)] transition-colors"
            >
              Read more
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default GlossaryCard;
