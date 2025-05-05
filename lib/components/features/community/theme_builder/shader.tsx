import React from 'react';
import { ShaderGradientCanvas, ShaderGradient as ReactShaderGradient } from '@shadergradient/react';

export function ShaderGradient({ mode = 'dark' }: { mode?: 'dark' | 'light' | 'system' }) {
  const [colors, setColors] = React.useState({ color1: '#e1dbfc', color2: '#ebd0fa', color3: '#ddf9fe' });

  const getCSSVariable = (variable: string) => {
    const el = document.querySelector('.shader');
    return el ? getComputedStyle(el).getPropertyValue(variable).trim() : '';
  };

  const updateColorsFromCSS = () => {
    const color1 = getCSSVariable('--shader-color-1');
    const color2 = getCSSVariable('--shader-color-2');
    const color3 = getCSSVariable('--shader-color-3');
    if (color1 && color2 && color3) setColors({ color1, color2, color3 });
  };

  React.useEffect(() => {
    updateColorsFromCSS();

    const observer = new MutationObserver(() => {
      updateColorsFromCSS();
    });

    const targetNode = document.querySelector('.shader');
    if (targetNode) {
      observer.observe(targetNode, {
        attributes: true,
        attributeFilter: ['class'], // Watch for style attribute changes
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <ShaderGradientCanvas
        pointerEvents="none"
        className="fixed! top-0 left-0 right-0 bottom-0 z-0"
        style={{ width: '100vw', height: '100dvh' }}
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
    </>
  );
}

// brightness={1.2}
//          uSpeed={0.1}
//          grain="off"
//          cAzimuthAngle={180}
//          cPolarAngle={90}
//          rotationZ={90}
//          uStrength={2.4}
//          uDensity={1.2}
//          cDistance={18}
