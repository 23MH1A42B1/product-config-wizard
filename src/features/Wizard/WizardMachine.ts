import { createMachine, assign } from 'xstate';
import { WizardContext } from './types';

export const wizardMachine = createMachine<WizardContext>({
  id: 'wizard',
  initial: 'step1',
  context: {
    globalConfig: {},
    errorMessage: undefined,
  },
  states: {
    step1: {
      on: {
        NEXT: {
          target: 'step2',
          cond: 'isProductSelected',
          actions: 'saveData',
        },
      },
    },
    step2: {
      on: {
        PREV: 'step1',
        NEXT: {
          target: 'summary',
          cond: 'isOptionsValid',
          actions: 'saveData',
        },
      },
    },
    summary: {
      on: {
        PREV: 'step2',
      },
    },
  },
}, {
  guards: {
    isProductSelected: (_, event: any) => !!event.data?.productType,
    isOptionsValid: (_, event: any) => !!event.data?.ram,
  },
  actions: {
    saveData: assign({
      globalConfig: (ctx, event: any) => ({
        ...ctx.globalConfig,
        ...event.data,
      }),
    }),
  },
});
