import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

function PaginatorNavLink({permalink, title, subLabel, isNext}) {
  return (
    <Link
      className={`
        flex flex-1 flex-col rounded-lg border border-orange-200 p-3 transition-all hover:border-orange-500 hover:bg-gray-50 hover:no-underline dark:border-orange-200 dark:hover:border-orange-500 dark:hover:bg-neutral-900
        ${isNext ? 'items-end text-right' : 'items-start text-left'}
      `}
      to={permalink}
    >
      {subLabel && (
        <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-orange-500 dark:text-orange-500">
          {subLabel}
        </div>
      )}
      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
        {title}
      </div>
    </Link>
  );
}

export default function DocPaginator(props) {
  const {previous, next} = props;
  if (!previous && !next) {
    return null;
  }
  return (
    <nav
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages navigation',
        description: 'The ARIA label',
      })}>
      {previous && (
        <PaginatorNavLink
          {...previous}
          subLabel={
            <Translate
              id="theme.docs.paginator.previous"
              description="Used for the previous link">
              Previous
            </Translate>
          }
        />
      )}
      {/* Used for last navigation page*/}
      {!previous && next && <div className="flex-1" />}
      
      {next && (
        <PaginatorNavLink
          {...next}
          subLabel={
            <Translate
              id="theme.docs.paginator.next"
              description="Used for the next link">
              Next
            </Translate>
          }
          isNext
        />
      )}
    </nav>
  );
}