import {Simulate, SyntheticEventData} from "react-addons-test-utils";
export type EventSimulator = (element: Element | null, eventData?: SyntheticEventData) => void;

// We're changing only the typing of Simulate: allows null, doesn't expect React comp
export interface CustomSimulate {
    blur: EventSimulator;
    change: (element: Element | null, newValue?: string | SyntheticEventData) => void;
    click: EventSimulator;
    copy: EventSimulator;
    cut: EventSimulator;
    doubleClick: EventSimulator;
    drag: EventSimulator;
    dragEnd: EventSimulator;
    dragEnter: EventSimulator;
    dragExit: EventSimulator;
    dragLeave: EventSimulator;
    dragOver: EventSimulator;
    dragStart: EventSimulator;
    drop: EventSimulator;
    focus: EventSimulator;
    input: EventSimulator;
    keyDown: EventSimulator;
    keyPress: EventSimulator;
    keyUp: EventSimulator;
    mouseDown: EventSimulator;
    mouseEnter: EventSimulator;
    mouseLeave: EventSimulator;
    mouseMove: EventSimulator;
    mouseOut: EventSimulator;
    mouseOver: EventSimulator;
    mouseUp: EventSimulator;
    paste: EventSimulator;
    scroll: EventSimulator;
    submit: EventSimulator;
    touchCancel: EventSimulator;
    touchEnd: EventSimulator;
    touchMove: EventSimulator;
    touchStart: EventSimulator;
    wheel: EventSimulator;
}

function getGlobalsOf(element: Element): any {
    if(element.ownerDocument && element.ownerDocument.defaultView) {
        return element.ownerDocument.defaultView;
    } else {
        return window;
    }
}

export interface GenericInputElement {
    value: string;
}

function isInputElement(element: any): element is GenericInputElement {
    const globalScope = getGlobalsOf(element);
    const HTMLInputElement = globalScope['HTMLInputElement'];
    const HTMLTextAreaElement = globalScope['HTMLTextAreaElement'];
    const HTMLSelectElement = globalScope['HTMLSelectElement'];
    return element instanceof  HTMLInputElement ||
            element instanceof HTMLTextAreaElement ||
            element instanceof HTMLSelectElement;
}

function change(element: Element, newValue?: string | SyntheticEventData) {
    if(isInputElement(element)) {
        if(typeof newValue === 'string') {
            element.value = newValue;
            Simulate.change(element);
        } else {
            Simulate.change(element, newValue);
        }
    } else {
        throw new Error(`Cannot simulate "change" event on "${element.tagName}" element.`);
    }
}

const ModifiedSimulate = {...Simulate, change} as CustomSimulate;

export { ModifiedSimulate as simulate };
