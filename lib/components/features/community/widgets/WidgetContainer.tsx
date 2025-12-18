'use client';

import { ASSET_PREFIX } from '$lib/utils/constants';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { WidgetPassport } from './WidgetPassport';

const layout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
  { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  { i: 'c', x: 4, y: 0, w: 1, h: 2 },
];

const config = {
  widgets: [
    {
      i: 'passport',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      component: WidgetPassport,
      props: {
        defaultImage: `${ASSET_PREFIX}/assets/images/zugrama-passport-placeholder.png`,
      },
    },
  ],
};

export function WidgetContainer() {
  return (
    <GridLayout className="layout" layout={layout} width={1200}>
      <div key="a">a</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
  );
}
