import { createMachine, assign, fromPromise } from 'xstate';
import { PRODUCT_REQUIRED_FIELDS, FIELD_LABELS } from './productConfig';

export const WIZARD_STEPS = ['step1', 'step2', 'summary'] as const;

export const wizardMachine = createMachine({
  id: 'wizard',
  initial: 'step1',

  context: {
    globalConfig: {} as Record<string, string>,
    errorMessage: '',
  },

  states: {
    step1: {
      on: {
        NEXT: [
          {
            target: 'step2',
            guard: ({ event }: { event: any }) => !!event?.data?.productType,
            actions: assign({
              globalConfig: ({ context, event }: { context: any; event: any }) => {
                const newProductType = event.data?.productType;
                const oldProductType = context.globalConfig.productType;
                if (newProductType !== oldProductType) {
                  return { productType: newProductType };
                }
                return { ...context.globalConfig, productType: newProductType };
              },
              errorMessage: () => '',
            }),
          },
          {
            actions: assign({
              errorMessage: () => 'Please select a product type',
            }),
          },
        ],
      },
    },

    step2: {
      on: {
        PREV: {
          target: 'step1',
          actions: assign({
            globalConfig: ({ context, event }: { context: any; event: any }) => ({
              ...context.globalConfig,
              ...(event.data || {}),
            }),
            errorMessage: () => '',
          }),
        },
        NEXT: [
          {
            target: 'summary',
            guard: ({ context, event }: { context: any; event: any }) => {
              const data = event?.data || {};
              const productType = context.globalConfig.productType;
              const requiredFields = PRODUCT_REQUIRED_FIELDS[productType] || ['ram', 'storage'];
              return requiredFields.every((field: string) => !!data[field]);
            },
            actions: assign({
              globalConfig: ({ context, event }: { context: any; event: any }) => ({
                ...context.globalConfig,
                ...event.data,
              }),
              errorMessage: () => '',
            }),
          },
          {
            actions: assign({
              errorMessage: ({ context, event }: { context: any; event: any }) => {
                const data = event?.data || {};
                const productType = context.globalConfig.productType;
                const requiredFields = PRODUCT_REQUIRED_FIELDS[productType] || ['ram', 'storage'];
                const missingField = requiredFields.find((field: string) => !data[field]);
                if (missingField) {
                  return `Please select ${FIELD_LABELS[missingField] || missingField}`;
                }
                return 'Please fill in all required fields';
              },
            }),
          },
        ],
      },
    },

    summary: {
      on: {
        PREV: {
          target: 'step2',
          actions: assign({ errorMessage: () => '' }),
        },
        SUBMIT: {
          target: 'submitting',
        },
      },
    },

    submitting: {
      invoke: {
        src: fromPromise(async ({ input }: { input: Record<string, unknown> }) => {
          const response = await fetch('/api/configurations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });
          if (!response.ok) {
            throw new Error('Submission failed. Please try again.');
          }
          return response.json();
        }),
        input: ({ context }: { context: any }) => context.globalConfig,
        onDone: {
          target: 'success',
          actions: assign({ errorMessage: () => '' }),
        },
        onError: {
          target: 'summary',
          actions: assign({
            errorMessage: () => 'Submission failed. Please try again.',
          }),
        },
      },
    },

    success: {
      on: {
        RESTART: {
          target: 'step1',
          actions: assign({
            globalConfig: () => ({}),
            errorMessage: () => '',
          }),
        },
      },
    },
  },
});
