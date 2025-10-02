'use client';

import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '../card';

interface RootProps<T> extends React.PropsWithChildren {
  loading?: boolean;
  rows?: number;
  data?: Array<T>;
}

function Root<T>({ data = [], loading: fetching, children }: RootProps<T>) {
  const header = React.Children.map(children, (child: any) => {
    if (child.type && child.type.displayName === 'Header') {
      return child;
    }
    return null;
  });

  const loading = React.Children.map(children, (child: any) => {
    if (child.type && child.type.displayName === 'Loading') {
      return child;
    }
    return null;
  });

  const empty = React.Children.map(children, (child: any) => {
    if (child.type && child.type.displayName === 'EmptyState') {
      return child;
    }
    return null;
  });

  const content = React.Children.map(children, (child: any) => {
    if (!['Loading', 'Header', 'EmptyState'].includes(child.type.displayName)) {
      return child;
    }
    return null;
  });

  return (
    <Card.Root>
      {(!!data.length || fetching) && header}

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          className="divide-y-(length:--card-border-width) divide-(--color-divider)"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {fetching ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {loading}
            </motion.div>
          ) : (
            <>
              {empty && <div className="hidden only:block">{empty}</div>}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y-(length:--card-border-width) divide-(--color-divider)"
              >
                {content}
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Card.Root>
  );
}

const Header = ({ children }: React.PropsWithChildren) => {
  return (
    <Card.Header className="flex gap-4 bg-transparent border-b-(length:--card-border-width) border-(--color-divider)">
      {children}
    </Card.Header>
  );
};
Header.displayName = 'Header';

function Row({ children, striped }: React.PropsWithChildren & { striped?: boolean }) {
  return <Card.Content className={clsx('p-0', striped && 'backdrop-blur-sm')}>{children}</Card.Content>;
}

const Loading = ({ children, rows }: React.PropsWithChildren & { rows: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <Card.Content
          key={idx}
          className={clsx('py-3', idx % 2 === 0 && 'backdrop-blur-sm', idx > 4 && 'max-sm:hidden')}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4"
          >
            {children}
          </motion.div>
        </Card.Content>
      ))}
    </>
  );
};
Loading.displayName = 'Loading';

const EmptyState = ({
  title,
  subtile,
  icon,
  children,
}: { title: string; subtile?: string; icon: string } & React.PropsWithChildren) => {
  return (
    <>
      {children || (
        <div className="flex flex-col justify-center items-center aspect-video py-12">
          <i className={twMerge('size-[120px] md:size-[184px] aspect-square text-quaternary', icon)} />
          <div className="space-y-2 text-center">
            <h3 className="text-xl text-tertiary font-semibold">{title}</h3>
            {subtile && <p className="text-tertiary max-sm:text-xs max-sm:w-xs md:w-[480px]">{subtile} </p>}
          </div>
        </div>
      )}
    </>
  );
};
EmptyState.displayName = 'EmptyState';

export const CardTable = {
  Root,
  Header,
  Loading,
  Row,
  EmptyState,
};

// 'use client';
// import React from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Card } from '../card';
// import clsx from 'clsx';
//
// interface CardTableProps<T> {
//   loading?: boolean;
//   rows?: number;
//   data?: Array<T>;
// }
//
// export function Root<T>({ data = [], loading, children, rows = 0 }: CardTableProps<T> & React.PropsWithChildren) {
//   const header = React.Children.map(children, (child: any) => {
//     if (child.type && child.type.displayName === 'Header') {
//       return child;
//     }
//     return null;
//   });
//
//   const loadingLine = React.Children.map(children, (child: any) => {
//     if (child.type && child.type.displayName === 'LoadingLine') {
//       return child;
//     }
//     return null;
//   });
//
//   const row = React.Children.map(children, (child: any) => {
//     if (child.type && child.type.displayName === 'Row') {
//       return child;
//     }
//     return null;
//   });
//
//   const empty = React.Children.map(children, (child: any) => {
//     if (child.type && child.type.displayName === 'EmptyState') {
//       return child;
//     }
//     return null;
//   });
//
//   return (
//     <Card.Root>
//       {header && (!!data.length || loading) && (
//         <Card.Header className="flex gap-4 bg-transparent border-b-(length:--card-border-width) border-(--color-divider)">
//           {header}
//         </Card.Header>
//       )}
//
//       <AnimatePresence mode="wait">
//         <motion.div
//           initial={{ opacity: 0 }}
//           className="divide-y-(length:--card-border-width) divide-(--color-divider)"
//           animate={{ opacity: 1, height: 'auto' }}
//           exit={{ opacity: 0 }}
//         >
//           {loading ? (
//             <>
//               {Array.from({ length: rows }).map((_, idx) => (
//                 <Card.Content
//                   key={idx}
//                   className={clsx('py-3', idx % 2 === 0 && 'backdrop-blur-sm', idx > 4 && 'max-sm:hidden')}
//                 >
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0 }}
//                     className="flex items-center gap-4"
//                   >
//                     {loadingLine}
//                   </motion.div>
//                 </Card.Content>
//               ))}
//             </>
//           ) : (
//             <>
//               {empty && <div className="hidden only:block">{empty}</div>}
//               {data.map((item, idx) => (
//                 <Card.Content key={idx} className={clsx('py-3', idx % 2 === 0 && 'backdrop-blur-sm')}>
//                   <CardTable.Row item={item}>{row}</CardTable.Row>
//                 </Card.Content>
//               ))}
//             </>
//           )}
//         </motion.div>
//       </AnimatePresence>
//     </Card.Root>
//   );
// }
//
// function Header({ children, className }: { className?: string } & React.PropsWithChildren) {
//   return (
//     <Card.Header className="flex gap-4 bg-transparent border-b-(length:--card-border-width) border-(--color-divider)">
//       {children}
//     </Card.Header>
//   );
// }
//
// const Row = ({ children, item }: any) => {
//   return <>{children(item)}</>;
// };
// Row.displayName = 'Row';
//
// const LoadingLine = ({ children }: React.PropsWithChildren) => {
//   return <>{children}</>;
// };
// LoadingLine.displayName = 'LoadingLine';
//
// const EmptyState = ({ children }: React.PropsWithChildren) => {
//   return <>{children}</>;
// };
// EmptyState.displayName = 'EmptyState';
//
// export const CardTable = {
//   Root,
//   Header,
//   Row,
//   LoadingLine,
//   Empty: EmptyState,
// };
