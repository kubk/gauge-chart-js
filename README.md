## gauge-chart-js [![NPM version](https://badge.fury.io/js/gauge-chart-js.svg)](https://npmjs.org/package/gauge-chart-js) [![Build Status](https://travis-ci.org/kubk/gauge-chart-js.svg?branch=master)](https://travis-ci.org/kubk/gauge-chart-js) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A tiny (<2kb gzipped) library for rendering gauge charts. Supports conical/polar gradients, animation timing functions, custom labels/tooltips. No external dependencies required.

### Examples
| [Conical (Polar) gradient](example/src/conical-gradient) | [Multiple gauges + labels](example/src/multiple-gauges) | [Countdown circle](example/src/countdown-gauge) |
| ------------- | -------------| -------------|
| <img src="/assets/conical-polar.gif" width="249.2" height="256.2">       | <img src="/assets/multiple-gauges.gif" width="261" height="256.2"> | <img src="/assets/countdown-circle.gif" width="249.2" height="256.2"> |

These are GIFs, therefore FPS is low.

### Installation
`npm install gauge-chart-js`

### Basic usage
```typescript
import { cubicBezier, Gauge } from 'gauge-chart-js';

const gauge = new Gauge({
  container: document.querySelector('.root'),
  color: '#0f0'
});

gauge.setValue(50);

```

### Customise easing
```typescript
import { cubicBezier, Gauge } from 'gauge-chart-js';

const easeIn = cubicBezier(0, 0, 0.2, 1);
const gauge = new Gauge({
  // ...
  easing: easeIn
})
```

Easing functions cheat sheet: https://cubic-bezier.com/#.17,.67,.83,.67

### Options
| Name           | Description                                                      | Required  | Default value     | Type   |
| ---            | ---                                                                                                       | ---       | ---               | ---               |
| `container`      | The HTML element that act as a container for the gauge         | Yes       | -       | `HTMLElement`          |
| `fromAngle`      | Gauge start angle in degrees                                   | No       | 220       | `number`          |
| `toAngle`      | Gauge end angle in degrees                                       | No       | 500       | `number`          |
| `animationDuration`      | Animation duration in milliseconds                     | No       | 600       | `number`          |
| `animationDelay`| Animation delay in milliseconds. Pass 0 for no animation.       | No       | 0       | `number`          |
| `lineWidth`| Thickness of the gauge                                               | No       | 3.5       | `number`          |
| `easing`|  The easing function that will be used when animating                   | No       | linear       | `(timeFraction: number) => number`          |
| `gaugeRadius`|  Gauge radius                                                      | No       | 35       | `number`          |
| `color`|  Gauge color supported by SVG's [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes) attribute                         | No       | -       | `string`          |
| `colors`|  Gauge colors supported by SVG's [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes) attribute                       | No       | -       | `string[]`          |

### Programmatic API
Available methods:
- `setValue(value)` Sets chart value.
- `getElementAtValue(value)` Returns SVG element for given `value` with additional information: angle and relative position to its parent container.
- `insertAdjacentToRoot(where, html)` Inserts HTML to SVG root. Can be used for custom labels.
- `dispose()` Disposes chart.

### How to integrate it with framework X?
The library is framework-agnostic and do not require any framework-specific integration. If you are using Angular make sure chart is rendered outside zone.js:
```typescript
class ExampleComponent implements OnInit {
  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    const gauge = new Gauge({ ... });
    this.ngZone.runOutsideAngular(() => {
      gauge.draw();
    });
  }
}
```

### Run examples:
- `cd example`
- `npm run dev`
- Open demo Conical gauge: http://localhost:3000/conical-gradient/
- Open demo React + shadowed center: http://localhost:3000/progress-with-shadow-chart/
- Open demo Multiple gauges + labels: http://localhost:3000/multiple-gauges/
- Open demo Countdown gauge: http://localhost:3000/countdown-gauge/

