import React from 'react';
import { ShaderGradientCanvas, ShaderGradient as ReactShaderGradient } from '@shadergradient/react';

export function ShaderGradient() {
  const [colors, setColors] = React.useState({ color1: '#e1dbfc', color2: '#f0a7fa', color3: '#ddf9fe' });

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
      <ShaderGradientCanvas className="absolute! top-0 z-0" style={{ width: '250%', height: '250%' }}>
        <ReactShaderGradient
          type="waterPlane"
          brightness={1.2}
          uSpeed={0.2}
          cDistance={4.4}
          grain="off"
          color1={colors.color1}
          color2={colors.color2}
          color3={colors.color3}
          zoomOut={false}
        />
      </ShaderGradientCanvas>
    </>
  );
}
