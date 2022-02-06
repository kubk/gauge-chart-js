import '../index.css';
import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { cubicBezier, Gauge } from '../../../src';

const chartColors = {
  main: 'rgb(255, 105, 38)',
  background: 'rgb(254, 243, 239)',
  white: '#fff',
};

const chartSize = 90;
const chartPadding = 30;

type Props = {
  percentValue: number;
};

export const ProgressWithShadowChart = (props: Props) => {
  const percentValue = props.percentValue;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const fromAngle = 0;
    const toAngle = 360;
    const maxValue = toAngle - fromAngle;
    const value = (maxValue * percentValue) / 100;

    const sharedConfig = {
      lineWidth: 4,
      container: ref.current,
      fromAngle,
      toAngle,
      easing: cubicBezier(0.165, 0.84, 0.44, 1),
    };

    const gaugeBackground = new Gauge({
      ...sharedConfig,
      color: chartColors.background,
    });
    gaugeBackground.setValue(maxValue);

    const gaugeMain = new Gauge({
      ...sharedConfig,
      color: chartColors.main,
    });
    gaugeMain.setValue(value);

    return () => {
      gaugeBackground.dispose();
      gaugeMain.dispose();
    };
  }, []);

  return (
    <div
      className={css({
        backgroundColor: chartColors.white,
        width: chartSize + chartPadding,
        height: chartSize + chartPadding,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      })}
    >
      <div
        ref={ref}
        className={css({
          width: chartSize,
          height: chartSize,
          left: chartPadding / 2,
          right: chartPadding / 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            // Try to make this circle as close to gauge as possible to see the shadow
            width: chartSize * 0.81,
            height: chartSize * 0.81,
            // Draw this white circle on top of gauge to get shadows on gauge
            zIndex: 1,
            boxShadow: '0px 2px 6px rgba(33, 32, 35, 0.1)',
            backgroundColor: chartColors.white,
            fontSize: 20,
            fontWeight: 600,
            color: chartColors.main,
          })}
        >
          &nbsp;{percentValue}%
        </div>
      </div>
    </div>
  );
};
