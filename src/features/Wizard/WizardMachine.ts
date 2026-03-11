import { createMachine, assign, fromPromise } from 'xstate';

export interface WizardContext {
  globalConfig: {
    productType?: string;
    ram?: string;
    storage?: string;
    color?: string;
    screenSize?: string;
  };
  errorMessage: string;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

type WizardEvent =
  | { type: 'NEXT'; data: Record<string, unknown> }
  | { type: 'PREV' }
  | { type: 'SUBMIT' }
  | { type: 'RETRY' };

export const wizardMachine = createMachine(
  {
    id: 'wizard',
    initial: 'step1',
    types: {} as { context: WizardContext; events: WizardEvent },

    context: {
      globalConfig: {},
      errorMessage: '',
      isSubmitting: false,
      submitSuccess: false,
    },

    states: {
      step1: {
        entry: assign({ errorMessage: '' }),
        on: {
          NEXT: [
            {
              guard: 'isStep1Valid',
              target: 'step2',
              actions: 'saveStep1Data',
            },
            {
              actions: 'setStep1Error',
            },
          ],
        },
      },

      step2: {
        on: {
          PREV: { target: 'step1', actions: 'clearError' },
          NEXT: [
            {
              guard: 'isStep2Valid',
              target: 'summary',
              actions: 'saveStep2Data',
            },
            {
              actions: 'setStep2Error',
            },
          ],
        },
      },

      summary: {
        entry: assign({ errorMessage: '' }),
        on: {
          PREV: { target: 'step2', actions: 'clearError' },
          SUBMIT: { target: 'submitting' },
        },
      },

      submitting: {
        entry: assign({ isSubmitting: true, errorMessage: '' }),
        invoke: {
          id: 'submitConfig',
          src: 'submitConfigurationService',
          onDone: {
            target: 'success',
            actions: assign({ isSubmitting: false, submitSuccess: true }),
          },
          onError: {
            target: 'failure',
            actions: assign({
              isSubmitting: false,
              errorMessage: ({ event }: any) =>
                (event.error as Error)?.message || 'Submission failed. Please try again.',
            }),
          },
        },
      },

      success: {
        type: 'final',
      },

      failure: {
        on: {
          RETRY: { target: 'submitting' },
          PREV: { target: 'summary', actions: 'clearError' },
        },
      },
    },
  },
  {
    guards: {
      isStep1Valid: ({ event }: any) =>
        typeof event.data?.productType === 'string' &&
        event.data.productType.trim() !== '',
      isStep2Valid: ({ event }: any) =>
        typeof event.data?.ram === 'string' && event.data.ram.trim() !== '',
    },
    actions: {
      saveStep1Data: assign({
        globalConfig: ({ context, event }: any) => ({
          ...context.globalConfig,
          ...event.data,
        }),
        errorMessage: '',
      }),
      saveStep2Data: assign({
        globalConfig: ({ context, event }: any) => ({
          ...context.globalConfig,
          ...event.data,
        }),
        errorMessage: '',
      }),
      setStep1Error: assign({
        errorMessage: 'Please select a product type before continuing.',
      }),
      setStep2Error: assign({
        errorMessage: 'Please enter the RAM size before continuing.',
      }),
      clearError: assign({ errorMessage: '' }),
    },
    actors: {
      submitConfigurationService: fromPromise(
        async ({ input }: { input: WizardContext }) => {
          console.log('Submitting configuration:', input.globalConfig);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return { success: true, config: input.globalConfig };
        }
      ),
    },
  }
);