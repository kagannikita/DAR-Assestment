type EventWithTarget = Event & { target: HTMLElement };

type DelegatedEvent = EventWithTarget & {
  delegateTarget: HTMLElement;
};

export const delegatedHandler = (selector: string,
  handler: (e: DelegatedEvent) => void): ((event: Event) => void) => (event: Event) => {
  const possibleTarget = (event as EventWithTarget)?.target.closest(selector) as HTMLElement;

  if (possibleTarget) {
    const newEvent = event as DelegatedEvent;
    newEvent.delegateTarget = possibleTarget;
    handler(event as DelegatedEvent);
  }
};

export const listenDelegated = (element: HTMLElement, eventName: string,
  selector: string, handler: (e: DelegatedEvent) => void): void => {
  element.addEventListener(eventName, delegatedHandler(selector, handler), false);
};
