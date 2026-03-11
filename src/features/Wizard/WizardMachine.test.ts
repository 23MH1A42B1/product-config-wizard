import { createActor, waitFor } from 'xstate';
import { wizardMachine, WIZARD_STEPS } from './WizardMachine';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

describe('WizardMachine', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('WIZARD_STEPS constant', () => {
    it('exports the correct step names', () => {
      expect(WIZARD_STEPS).toEqual(['step1', 'step2', 'summary']);
    });
  });

  describe('initial state', () => {
    it('starts at step1 with empty context', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('step1');
      expect(snapshot.context.globalConfig).toEqual({});
      expect(snapshot.context.errorMessage).toBe('');
    });
  });

  describe('step1', () => {
    it('transitions to step2 with valid productType', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('step2');
      expect(snapshot.context.globalConfig.productType).toBe('Laptop');
      expect(snapshot.context.errorMessage).toBe('');
    });

    it('stays on step1 with empty productType and sets error', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: '' } });
      expect(actor.getSnapshot().value).toBe('step1');
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select a product type');
    });

    it('stays on step1 with missing data and sets error', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: {} });
      expect(actor.getSnapshot().value).toBe('step1');
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select a product type');
    });

    it('clears error on successful navigation', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: {} });
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select a product type');
      actor.send({ type: 'NEXT', data: { productType: 'Mobile' } });
      expect(actor.getSnapshot().context.errorMessage).toBe('');
      expect(actor.getSnapshot().value).toBe('step2');
    });

    it('resets step2 data when productType changes', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: 'NVIDIA RTX 3060' },
      });
      actor.send({ type: 'PREV' }); // back to step2
      actor.send({ type: 'PREV' }); // back to step1
      actor.send({ type: 'NEXT', data: { productType: 'Mobile' } });
      // step2 data should be cleared because product changed
      expect(actor.getSnapshot().context.globalConfig).toEqual({ productType: 'Mobile' });
    });

    it('preserves step2 data when productType stays the same', () => {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      actor.send({ type: 'PREV', data: { ram: '16GB' } });
      // Go forward again with same product
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      expect(actor.getSnapshot().context.globalConfig.ram).toBe('16GB');
    });
  });

  describe('step2', () => {
    function goToStep2(productType = 'Laptop') {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType } });
      return actor;
    }

    it('transitions to summary with all valid Laptop data', () => {
      const actor = goToStep2('Laptop');
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: 'NVIDIA RTX 3060' },
      });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('summary');
      expect(snapshot.context.globalConfig).toEqual({
        productType: 'Laptop',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'NVIDIA RTX 3060',
      });
    });

    it('transitions to summary with all valid Mobile data', () => {
      const actor = goToStep2('Mobile');
      actor.send({
        type: 'NEXT',
        data: { ram: '8GB', storage: '128GB', battery: '5000mAh' },
      });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('summary');
      expect(snapshot.context.globalConfig).toEqual({
        productType: 'Mobile',
        ram: '8GB',
        storage: '128GB',
        battery: '5000mAh',
      });
    });

    it('stays on step2 with missing RAM and sets error', () => {
      const actor = goToStep2('Laptop');
      actor.send({
        type: 'NEXT',
        data: { ram: '', storage: '512GB SSD', graphics: 'NVIDIA RTX 3060' },
      });
      expect(actor.getSnapshot().value).toBe('step2');
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select RAM');
    });

    it('stays on step2 with missing storage and sets error', () => {
      const actor = goToStep2('Laptop');
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '', graphics: 'NVIDIA RTX 3060' },
      });
      expect(actor.getSnapshot().value).toBe('step2');
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select Storage');
    });

    it('stays on step2 with missing graphics for Laptop and sets error', () => {
      const actor = goToStep2('Laptop');
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: '' },
      });
      expect(actor.getSnapshot().value).toBe('step2');
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select Graphics Card');
    });

    it('stays on step2 with missing battery for Mobile and sets error', () => {
      const actor = goToStep2('Mobile');
      actor.send({
        type: 'NEXT',
        data: { ram: '8GB', storage: '128GB', battery: '' },
      });
      expect(actor.getSnapshot().value).toBe('step2');
      expect(actor.getSnapshot().context.errorMessage).toBe('Please select Battery Capacity');
    });

    it('navigates back to step1 and clears error', () => {
      const actor = goToStep2('Laptop');
      actor.send({ type: 'NEXT', data: {} });
      expect(actor.getSnapshot().context.errorMessage).not.toBe('');
      actor.send({ type: 'PREV' });
      expect(actor.getSnapshot().value).toBe('step1');
      expect(actor.getSnapshot().context.errorMessage).toBe('');
    });

    it('preserves form data when navigating back', () => {
      const actor = goToStep2('Laptop');
      actor.send({ type: 'PREV', data: { ram: '16GB', storage: '512GB SSD' } });
      expect(actor.getSnapshot().context.globalConfig.ram).toBe('16GB');
      expect(actor.getSnapshot().context.globalConfig.storage).toBe('512GB SSD');
    });

    it('clears error on successful navigation to summary', () => {
      const actor = goToStep2('Laptop');
      actor.send({ type: 'NEXT', data: {} });
      expect(actor.getSnapshot().context.errorMessage).not.toBe('');
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: 'Integrated' },
      });
      expect(actor.getSnapshot().value).toBe('summary');
      expect(actor.getSnapshot().context.errorMessage).toBe('');
    });
  });

  describe('summary', () => {
    function goToSummary() {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: 'NVIDIA RTX 3060' },
      });
      return actor;
    }

    it('navigates back to step2', () => {
      const actor = goToSummary();
      actor.send({ type: 'PREV' });
      expect(actor.getSnapshot().value).toBe('step2');
    });

    it('clears error when navigating back', () => {
      const actor = goToSummary();
      // Simulate having an error from failed submission
      actor.send({ type: 'PREV' });
      expect(actor.getSnapshot().context.errorMessage).toBe('');
    });

    it('transitions to submitting on SUBMIT', () => {
      mockFetch.mockReturnValue(new Promise(() => {}));
      const actor = goToSummary();
      actor.send({ type: 'SUBMIT' });
      expect(actor.getSnapshot().value).toBe('submitting');
    });
  });

  describe('submitting', () => {
    function goToSummary() {
      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: 'NVIDIA RTX 3060' },
      });
      return actor;
    }

    it('transitions to success on successful submission', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });
      const actor = goToSummary();
      actor.send({ type: 'SUBMIT' });

      const successState = await waitFor(actor, (state) => state.value === 'success');
      expect(successState.value).toBe('success');
      expect(successState.context.errorMessage).toBe('');
    });

    it('calls fetch with correct data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });
      const actor = goToSummary();
      actor.send({ type: 'SUBMIT' });

      await waitFor(actor, (state) => state.value === 'success');
      expect(mockFetch).toHaveBeenCalledWith('/api/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: 'Laptop',
          ram: '16GB',
          storage: '512GB SSD',
          graphics: 'NVIDIA RTX 3060',
        }),
      });
    });

    it('returns to summary with error on failed submission', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      const actor = goToSummary();
      actor.send({ type: 'SUBMIT' });

      const summaryState = await waitFor(actor, (state) =>
        state.value === 'summary' && state.context.errorMessage !== ''
      );
      expect(summaryState.value).toBe('summary');
      expect(summaryState.context.errorMessage).toBe('Submission failed. Please try again.');
    });

    it('returns to summary with error on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const actor = goToSummary();
      actor.send({ type: 'SUBMIT' });

      const summaryState = await waitFor(actor, (state) =>
        state.value === 'summary' && state.context.errorMessage !== ''
      );
      expect(summaryState.value).toBe('summary');
      expect(summaryState.context.errorMessage).toBe('Submission failed. Please try again.');
    });
  });

  describe('success', () => {
    it('restarts wizard on RESTART event', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

      const actor = createActor(wizardMachine);
      actor.start();
      actor.send({ type: 'NEXT', data: { productType: 'Laptop' } });
      actor.send({
        type: 'NEXT',
        data: { ram: '16GB', storage: '512GB SSD', graphics: 'NVIDIA RTX 3060' },
      });
      actor.send({ type: 'SUBMIT' });

      await waitFor(actor, (state) => state.value === 'success');

      actor.send({ type: 'RESTART' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('step1');
      expect(snapshot.context.globalConfig).toEqual({});
      expect(snapshot.context.errorMessage).toBe('');
    });
  });
});
