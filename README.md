# Test Drive React
[![npm version](https://badge.fury.io/js/test-drive-react.svg)](https://www.npmjs.com/package/test-drive-react)
[![Build Status](https://travis-ci.org/wix/test-drive-react.svg?branch=master)](https://travis-ci.org/wix/test-drive-react)

Opinionated library for Test-Driven Development of React components, extending
[Test Drive](https://github.com/wix/test-drive) and providing its
[timing functions](https://github.com/wix/test-drive#waitfor-waitfordom),
[DOM parts lookup](https://github.com/wix/test-drive#locating-your-dom-parts-selectdom),
[presence/absence matchers](https://github.com/wix/test-drive#the-present-and-absent-matchers) and
[event triggering](https://github.com/wix/test-drive#event-triggering)
[layout matchers](https://github.com/wix/test-drive#layout-matchers).

In addition, it reexports [React simulate](https://facebook.github.io/react/docs/test-utils.html#simulate)
testing utility and [integrated renderer](https://github.com/wix/test-drive-react#clientrenderer)


# ClientRenderer

`ClientRenderer` provides a utility for rendering React components in consistent
and convenient way. It creates the holding container, if necessary, with uniform positioning,
automatically binds to it all important Test Drive helper functions, and proivides clean-up
mechanism.

For a typical use, see the [end-to-end test](./test/e2e.spec.tsx).

The renderer is created simply by invoking `new ClientRenderer()`.

## `render(element, container?)`

Renders the `element` React component. If `container` is not specified, a new one is created.
Returns `RenderingContext` with following fields:

 - `container`
 - `result` - rendered root component (either DOM Element or React component instance)
 - `select` - [DOM selector](https://github.com/wix/test-drive#locating-your-dom-parts-selectdom)
pre-bound to the container
 - `waitForDom` - [DOM timing function](https://github.com/wix/test-drive#waitfor-waitfordom)
pre-bound to the container

## `cleanup()`

Unmounts the root component and removes any container that had been created by the renderer.

# Component Drivers

Test Drive React provides additional layer of abstraction over the basic assertion tools. In order to keep
the intended behavior of a component separated from the actual implementation (DOM structure, particular
DOM events, etc.), every component should provide it's "driver". Component driver translates meaningful
actions and getters into specific DOM details.

All drivers should extend the `DriverBase` class. The basic (and recommended) way of creating drivers is to use 
`.withDriver(DriverClass)` method which is part of the `RenderingContext` interface.

For [example](.test/drivers.fixture.tsx), consider a `TestComponent`. There should be always
relevant implementation of its driver, e.g.:

```tsx
export class TestComponentDriver extends DriverBase {

    static ComponentClass = TestComponent;

    get samplePart(): HTMLDivElement {
        return this.select('SAMPLE_PART') as HTMLDivElement;
    }

    doAction() {
        (this.root as HTMLElement).click();
    }
}
```

The `ComponentClass` points to the component for which is the driver relevant. It is used by the
`ClientRenderer` for validation of a component/driver match during the rendering. (This validation
is intended to prevent using a wrong driver on top of a DOM generated by a component.)

The getter `.samplePart` provides access (via `data-automation-id`) to specific parts of
the component's shadow DOM, while keeping this detail  encapsulated. Similarly,
the `.doAction()` method represents specific methods, while keeping the technicalities (event type)
private.

The driver then should be instantiated and used through `ClientRenderer`, e.g.:

```tsx
const {driver, waitForDom} = clientRenderer.render(<TestComponent />).withDriver(TestComponentDriver);
expect(driver.samplePart).to.be.present();
```

Note that the `.withDriver()` function returns `RenderingContextWithDriver`, which has following
members:

 - `driver` - instance of the component driver
 
 - `waitForDom` - [DOM timing function](https://github.com/wix/test-drive#waitfor-waitfordom)
pre-bound to the container (passed from the original rendering result).

In the case of composite components, the drivers should mirror their structure as well. `.samplePart` in
the above example should, therefore, reference another (relevant) component driver, rather than plain DOM Element,
if it corresponds to custom component. 

