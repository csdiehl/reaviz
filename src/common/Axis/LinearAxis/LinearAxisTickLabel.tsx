import React, { Component, ReactElement } from 'react';
import { LinearAxisTickLine, LinearAxisTickLineProps } from './LinearAxisTickLine';

export interface LinearAxisTickLabelProps {
  text: string;
  fullText: string;
  angle: number;
  orientation: 'horizontal' | 'vertical';
  half: 'start' | 'end' | 'center';
  line: ReactElement<LinearAxisTickLineProps, typeof LinearAxisTickLine>;
  format?: (v) => any;
  fill: string;
  fontSize?: number;
  fontFamily: string;
  rotation: boolean | number;
  padding: number | { fromAxis: number; alongAxis: number };
  textAnchor?: 'start' | 'end' | 'middle';
  position: 'start' | 'end' | 'center';
  align: 'start' | 'end' | 'center' | 'inside' | 'outside';
  className?: any;
}

export const LinearAxisTickLabel = ({ text, fullText, angle, orientation, half, line, format, fill = '#8F979F', fontSize = 11, fontFamily = 'sans-serif', rotation = true, padding = 0, textAnchor, position, align = 'center', className }: LinearAxisTickLabelProps) => {
  function getAlign() {
    if ((align === 'inside' || align === 'outside') && half === 'center') {
      return 'center';
    }

    if (align === 'inside') {
      return half === 'start' ? 'end' : 'start';
    }

    if (align === 'outside') {
      return half === 'start' ? 'start' : 'end';
    }

    return align;
  }

  function getTickLineSpacing() {
    if (!line) {
      return [0, 0];
    }

    const size = line.props.size;
    const position = line.props.position;

    if (position === 'start') {
      return [size * -1, 0];
    } else if (position === 'end') {
      return [0, size];
    } else {
      return [size * -0.5, size * 0.5];
    }
  }

  // bug in this function
  function getOffset() {
    const adjustedPadding = typeof padding === 'number' ? { fromAxis: padding as number, alongAxis: padding as number } : (padding as { fromAxis: number; alongAxis: number });

    const spacing = getTickLineSpacing();
    const offset1 = position === 'start' ? spacing[0] - adjustedPadding.fromAxis : position === 'end' ? spacing[1] + adjustedPadding.fromAxis : 0;

    const align = getAlign();
    let offset2 = rotation === true ? -5 : 0;
    offset2 += align === 'center' ? 0 : align === 'start' ? -adjustedPadding.alongAxis : adjustedPadding.alongAxis;

    const horz = orientation === 'horizontal';
    return {
      [horz ? 'x' : 'y']: offset2,
      [horz ? 'y' : 'x']: offset1
    };
  }

  function getTextPosition() {
    let transform = '';
    let newtextAnchor = '';
    let alignmentBaseline = 'middle' as 'middle' | 'baseline' | 'hanging';

    if (angle !== 0) {
      transform = `rotate(${angle})`;
      newtextAnchor = 'end';
    } else {
      const align = getAlign();
      if (orientation === 'horizontal') {
        newtextAnchor = align === 'center' ? 'middle' : align === 'start' ? 'end' : 'start';
        if (position === 'start') {
          alignmentBaseline = 'baseline';
        } else if (position === 'end') {
          alignmentBaseline = 'hanging';
        }
      } else {
        alignmentBaseline = align === 'center' ? 'middle' : align === 'start' ? 'baseline' : 'hanging';
        if (position === 'start') {
          newtextAnchor = 'end';
        } else if (position === 'end') {
          newtextAnchor = 'start';
        } else {
          newtextAnchor = 'middle';
        }
      }
    }

    return {
      transform,
      textAnchor: textAnchor || newtextAnchor,
      alignmentBaseline
    };
  }

  const { x, y } = getOffset();
  const textPosition = getTextPosition();

  console.log(getOffset());

  return (
    <g transform={`translate(${x}, ${y})`} fontSize={fontSize} fontFamily={fontFamily}>
      <title>{fullText}</title>
      <text {...textPosition} fill={fill} className={className}>
        {text}
      </text>
    </g>
  );
};
