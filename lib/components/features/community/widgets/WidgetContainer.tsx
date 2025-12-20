'use client';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { WidgetPassport } from './WidgetPassport';
import { WidgetCommunityCoin } from './WidgetCommunityCoin';

const layout = [
  {
    i: 'a',
    x: 0,
    y: 0,
    w: 1,
    h: 2,
    static: true,
    component: WidgetPassport,
    props: {
      provider: 'drip-nation',
      title: 'Become a Citizen',
      subtitle: 'Mint your Vinyl Passport and join a community built by music lovers, collectors, and creators.',
    },
  },
  {
    i: 'b',
    x: 1,
    y: 0,
    w: 1,
    h: 1,
    component: WidgetCommunityCoin,
    props: {
      provider: 'drip-nation',
    },
  },
  {
    i: 'c',
    x: 3,
    y: 0,
    w: 1,
    h: 1,
    component: WidgetCommunityCoin,
    props: {
      provider: 'drip-nation',
    },
  },
];

const config = {
  widgets: [
    {
      i: 'a',
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      static: true,
      component: WidgetPassport,
      props: {
        provider: 'drip-nation',
        title: 'Become a Citizen',
        subtitle: 'Mint your Vinyl Passport and join a community built by music lovers, collectors, and creators.',
      },
    },
    {
      i: 'b',
      x: 1,
      y: 0,
      w: 1,
      h: 1,
      component: WidgetCommunityCoin,
      props: {
        provider: 'drip-nation',
        title: '$VINYL',
        subtitle: 'Launching soon',
      },
    },
  ],
};

export function WidgetContainer() {
  return (
    <GridLayout
      className="layout"
      layout={layout}
      gridConfig={{ containerPadding: [0, 0], cols: 2, margin: [32, 32] }}
      width={1080}
    >
      {config.widgets.map((w) => {
        const Comp = w.component;

        return (
          <div key={w.i}>
            <Comp {...w.props} />
          </div>
        );
      })}
    </GridLayout>
  );
}
