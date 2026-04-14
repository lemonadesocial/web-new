'use client';

import React from 'react';

type ShaderGradientModule = typeof import('@shadergradient/react');

export function ShaderGradient({
  mode = 'dark',
  scoped = false,
  scopeSelector,
}: {
  mode?: 'dark' | 'light' | 'auto';
  scoped?: boolean;
  scopeSelector?: string;
}) {
  const [colors, setColors] = React.useState({ color1: '#e1dbfc', color2: '#ebd0fa', color3: '#ddf9fe' });
  const [shaderModule, setShaderModule] = React.useState<ShaderGradientModule | null>(null);
  const shaderSelector = scopeSelector ? `${scopeSelector} .shader` : '.shader';

  const getCSSVariable = React.useCallback(
    (variable: string) => {
      const el = document.querySelector(shaderSelector);
      return el ? getComputedStyle(el).getPropertyValue(variable).trim() : '';
    },
    [shaderSelector],
  );

  const updateColorsFromCSS = React.useCallback(() => {
    const color1 = getCSSVariable('--shader-color-1');
    const color2 = getCSSVariable('--shader-color-2');
    const color3 = getCSSVariable('--shader-color-3');
    if (color1 && color2 && color3) setColors({ color1, color2, color3 });
  }, [getCSSVariable]);

  React.useEffect(() => {
    let cancelled = false;

    import('@shadergradient/react')
      .then((mod) => {
        if (!cancelled) setShaderModule(mod);
      })
      .catch((error) => {
        console.error('Failed to load shader gradient module', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    updateColorsFromCSS();

    const observer = new MutationObserver(() => {
      updateColorsFromCSS();
    });

    const targetNode = document.querySelector(shaderSelector);
    if (targetNode) {
      observer.observe(targetNode, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [shaderSelector, updateColorsFromCSS]);

  if (!shaderModule) {
    return null;
  }

  const { ShaderGradientCanvas, ShaderGradient: ReactShaderGradient } = shaderModule;

  return (
    <ShaderGradientCanvas
      pointerEvents="none"
      className={scoped ? 'absolute! top-0 left-0 right-0 bottom-0 z-0' : 'fixed! top-0 left-0 right-0 bottom-0 z-0'}
      style={scoped ? { width: '100%', height: '100%' } : { width: '100vw', height: '100dvh' }}
      fov={10}
      pixelDensity={1}
    >
      <ReactShaderGradient
        type="waterPlane"
        animate="on"
        cAzimuthAngle={180}
        brightness={mode === 'dark' ? 1 : 1.2}
        cDistance={18}
        cPolarAngle={90}
        cameraZoom={1}
        envPreset="city"
        grain="off"
        uDensity={1.2}
        uSpeed={0.1}
        uStrength={2.4}
        rotationZ={90}
        lightType="3d"
        color1={getCSSVariable('--shader-color-1') || colors.color1}
        color2={getCSSVariable('--shader-color-2') || colors.color2}
        color3={getCSSVariable('--shader-color-3') || colors.color3}
      />
    </ShaderGradientCanvas>
  );
}
