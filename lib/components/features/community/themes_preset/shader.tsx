import React from 'react';
import { ShaderGradientCanvas, ShaderGradient as ReactShaderGradient } from '@shadergradient/react';

export function ShaderGradient({ colors }: { colors: { color1: string; color2: string; color3: string } }) {
  return (
    <>
      <div className="absolute inset-0 bg-black/10 z-10" />
      <ShaderGradientCanvas className="absolute! backdrop-blur-lg top-0 z-0" style={{ width: '250%', height: '250%' }}>
        <ReactShaderGradient
          brightness={30}
          uSpeed={0.3}
          type="waterPlane"
          grain="off"
          color1={colors.color1}
          color2={colors.color2}
          color3={colors.color3}
          lightType="env"
        />
      </ShaderGradientCanvas>
    </>
  );
}
