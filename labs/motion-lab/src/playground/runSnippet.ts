import { animate, stagger } from 'motion';

type Playback = ReturnType<typeof animate>;

export type SnippetScope = {
  box: HTMLElement;
  dots: HTMLElement[];
  distance: number;
};

/**
 * Runs one playground snippet against the stage elements and returns every
 * animation it started, so the page can pause, change speed or stop them.
 *
 * The snippet is evaluated locally with `new Function` on purpose: the
 * playground is an editor, and the reader's own code is the point. It is never
 * read from the URL or storage, and its result is never sent anywhere, so a
 * shared link cannot execute code on someone else's tab.
 */
export const runSnippet = (code: string, scope: SnippetScope): Playback[] => {
  const controls: Playback[] = [];

  const trackingAnimate = (...args: unknown[]): Playback => {
    const animation = (animate as unknown as (...inner: unknown[]) => Playback)(...args);
    controls.push(animation);
    return animation;
  };

  const runner = new Function(
    'animate',
    'stagger',
    'box',
    'dots',
    'distance',
    `"use strict";\n${code}`,
  ) as (
    animate: typeof trackingAnimate,
    staggerFn: typeof stagger,
    box: HTMLElement,
    dots: HTMLElement[],
    distance: number,
  ) => void;

  runner(trackingAnimate, stagger, scope.box, scope.dots, scope.distance);

  return controls;
};

/** Speed is set outside the component so the React hooks lint can reason about it. */
export const setPlaybackSpeed = (controls: Playback[], speed: number): void => {
  for (const animation of controls) {
    animation.speed = speed;
  }
};
