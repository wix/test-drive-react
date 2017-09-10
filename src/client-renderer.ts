import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { selectDom, waitForDom as _waitForDom } from 'test-drive';
import {DriverBase, DriverConstructor} from "./driver-base";

export interface RenderingContext<P> {
    container: HTMLDivElement;
    result: React.Component<P, React.ComponentState> | Element | void;
    select<T extends Element>(...selectors: string[]): T | null;
    waitForDom(assertion: Function, timeout?: number): Promise<void>;
    withDriver<D extends DriverBase>(DriverClass: DriverConstructor<D>): RenderingContextWithDriver<D>;
}

export interface RenderingContextWithDriver<D extends DriverBase> {
    waitForDom(assertion: Function, timeout?: number): Promise<void>;
    driver: D;
    container: HTMLDivElement;
}

export class ClientRenderer {
    private containers: Element[] = [];

    render<P>(element: React.ReactElement<P>, container?: HTMLDivElement): RenderingContext<P> {
        if (!container) {
            container = document.createElement('div');
            container.setAttribute('style', 'position: fixed; top: 0; left: 0; right: 0;');
            document.body.appendChild(container);

            this.containers.push(container);
        }
        const result = ReactDOM.render(element, container);
        const waitForDom = _waitForDom.bind(null, container);
        return {
            container,
            result,
            select: selectDom(container),
            waitForDom,
            withDriver<D extends DriverBase>(DriverClass: DriverConstructor<D>): RenderingContextWithDriver<D> {
                if(DriverClass.ComponentClass !== element.type) {
                    throw new Error('The driver/component mismatch. Driver creation failed.');
                }
                const driver = new DriverClass(() => container!.firstElementChild!);
                return {
                    waitForDom,
                    driver,
                    container: container!,
                }
            }
        };
    }

    cleanup() {
        this.containers.map(container => {
            ReactDOM.unmountComponentAtNode(container);
            document.body.removeChild(container);
        });
        this.containers = [];
    }
}
