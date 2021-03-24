import { AnimationController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
const animationCtrl = new AnimationController();

// https://github.com/mhartington/v5-animations/blob/master/src/app/animations/index.ts
export const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs');
  if (ionPage) {
    return ionPage;
  }
  // idk, return the original element so at least something animates and we don't have a null pointer
  return element;
};

// https://github.com/ionic-team/ionic-framework/blob/e2d8e5c4dcf893ddd8aaa556c1dd8fcaf52411c9/core/src/utils/transition/index.ts#L239
// https://github.com/ionic-team/ionic-framework/blob/e2d8e5c4dcf893ddd8aaa556c1dd8fcaf52411c9/core/src/components/nav/nav-interface.ts#L27
// https://github.com/ionic-team/ionic-framework/blob/e2d8e5c4dcf893ddd8aaa556c1dd8fcaf52411c9/core/src/components/nav/nav-interface.ts#L41
export interface AnimationOptions {
  mode: 'md' | 'ios';
  animated: boolean;
  direction: 'root' | 'forward' | 'back';
  enteringEl: HTMLElement;
  leavingEl: HTMLElement;
  baseEl: HTMLElement;
  progressAnimation: boolean;
  showGoBack: boolean;
  animationBuilder: (_, opts) => {}
  progressionCallback?: () => {};
  duration?: number;
}

export const customAnimation = (_: HTMLElement, opts: AnimationOptions) => {
  console.log(opts);

  // create root transition
  const rootTransition = animationCtrl
    .create()
    .duration(opts.duration || 333)
    .easing('cubic-bezier(0.7,0,0.3,1)');

  // create enter and exit transition
  const enterTransition = animationCtrl.create().addElement(getIonPageElement(opts.enteringEl));
  const exitTransition = animationCtrl.create().addElement(getIonPageElement(opts.leavingEl));

  // handle animation depending on direction
  if (opts.direction === 'forward') {
    enterTransition.fromTo('opacity', '0', '1');
    exitTransition.fromTo('opacity', '1', '0');
  } else {
    enterTransition.fromTo('opacity', '0', '1');
    exitTransition.fromTo('opacity', '1', '0');
  }

  // add transition to root and return root
  rootTransition.addAnimation([enterTransition, exitTransition]);
  return rootTransition;
};
