import React from 'react';

interface TagProps extends React.PropsWithChildren {
  variant?: 'primary' | 'success' | 'danger';
}

export function Tag({ children }: TagProps) {
  return <div className="py-1 px-4 w-fit border rounded-lg font-medium inline-flex gap-1">{children}</div>;
}
