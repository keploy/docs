import React from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

function PaginatorNavLink({permalink, title, subLabel, isNext}) {
  return (
    <Link
      className={`
        flex flex-1 flex-col rounded-lg border border-gray-200 p-3 transition-all hover:border-orange-300 hover:bg-orange-50 hover:no-underline dark:border-gray-700 dark:hover:border-orange-500/50 dark:hover:bg-orange-900/20
        ${isNext ? 'items-end text-right' : 'items-start text-left'}
      `}
      to={permalink}
    >
      {subLabel && (
        <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {subLabel}
        </div>
      )}
      <div className="text-sm font-semibold text-orange-600 dark:text-orange-500">
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
        description: 'The ARIA label for the docs pagination',
      })}>
      {previous && (
        <PaginatorNavLink
          {...previous}
          subLabel={
            <Translate
              id="theme.docs.paginator.previous"
              description="The label used for the previous link in the docs pagination">
              Previous
            </Translate>
          }
        />
      )}
      {/* Spacer if only one item exists to push next to right - actually flex handles this if we use just flex-1 */}
      {!previous && next && <div className="flex-1" />}
      
      {next && (
        <PaginatorNavLink
          {...next}
          subLabel={
            <Translate
              id="theme.docs.paginator.next"
              description="The label used for the next link in the docs pagination">
              Next
            </Translate>
          }
          isNext
        />
      )}
    </nav>
  );
}
