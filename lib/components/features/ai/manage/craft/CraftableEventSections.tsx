'use client';
import React from 'react';
import GridLayout from 'react-grid-layout';
import clsx from 'clsx';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { useContainerWidth } from 'react-grid-layout';
import { gridLayoutActions, useGridState, useGridSelectedId } from '../layoutStore';
import { resolver } from './resolver';

// Import V2 Styles
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export function CraftableEventSections({ event, attending }: { event: Event; attending: boolean }) {
  const state = useGridState();
  const selectedId = useGridSelectedId();
  const { width, containerRef, mounted } = useContainerWidth();

  const handleLayoutChange = (currentLayout: any) => {
    gridLayoutActions.updateLayout(currentLayout);
  };

  return (
    <div ref={containerRef} className="w-full min-h-dvh">
      {mounted && (
        <GridLayout
          className="layout"
          layout={state.layout}
          cols={12}
          rowHeight={30}
          width={width || 1200}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
          compactType="vertical"
        >
          {state.layout.map((item) => {
            const compData = state.components[item.i];
            if (!compData) return null;

            const Component = (resolver as any)[compData.type];
            if (!Component) return null;

            const isSelected = selectedId === item.i;

            return (
              <div key={item.i}>
                <div
                  className={clsx(
                    'h-full bg-background border border-card-border shadow-sm rounded-lg overflow-hidden group/item relative transition-all',
                    isSelected && 'border-primary shadow-lg',
                    !isSelected && 'hover:border-primary/50'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    gridLayoutActions.selectNode(item.i);
                  }}
                >
                  {/* Drag Handle */}
                  <div className="drag-handle absolute top-2 right-2 z-50 cursor-move opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 bg-overlay-primary border border-card-border rounded-md shadow-lg hover:bg-accent-400/10">
                    <i className="icon-grid size-4 text-primary" />
                  </div>

                  {/* Resize Indicator */}
                  <div className="absolute bottom-0 right-0 z-50 pointer-events-none opacity-0 group-hover/item:opacity-40 p-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-tertiary">
                      <path d="M11 1L1 11M11 5L5 11M11 9L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>

                  <div className="h-full overflow-auto no-scrollbar pointer-events-none group-hover/item:pointer-events-auto relative">
                    {/* Delete button (only show on hover/select) */}
                    <div className="absolute top-2 left-2 z-50 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gridLayoutActions.removeSection(item.i);
                        }}
                        className="p-1.5 bg-danger-500/10 text-danger-500 rounded-md hover:bg-danger-500 hover:text-white transition-colors"
                      >
                        <i className="icon-delete size-4" />
                      </button>
                    </div>
                    
                    <div className="p-4 h-full pointer-events-none">
                       {/* Render the actual resolved component */}
                       <Component {...compData.props} event={event} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </GridLayout>
      )}
    </div>
  );
}
