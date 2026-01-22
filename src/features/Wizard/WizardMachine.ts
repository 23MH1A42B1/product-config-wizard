import { createMachine, assign } from 'xstate';

export const wizardMachine = createMachine({
  id: 'wizard',
  initial: 'step1',
  context: {
    globalConfig: {},
    errorMessage: '',
  },

step1: {
  on: {
    NEXT: {
      target: 'step2',
      guard: ({ event }) => {
        return !!event?.data?.productType;
      },
      actions: assign({
        globalConfig: ({ context, event }) => ({
          ...context.globalConfig,
          ...event.data,
        }),
        errorMessage: () => '',
      }),
    },
  },
},


step2: {
  on: {
    PREV: { target: 'step1' },
    NEXT: {
      target: 'summary',
      guard: ({ event }) => {
        return !!event?.data?.ram;
      },
      actions: assign({
        globalConfig: ({ context, event }) => ({
          ...context.globalConfig,
          ...event.data,
        }),
        errorMessage: () => '',
      }),
    },
  },
},


    summary: {
      on: {
        PREV: { target: 'step2' },
      },
    },
  },
});
