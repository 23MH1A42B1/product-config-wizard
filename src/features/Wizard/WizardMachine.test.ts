import { createActor } from 'xstate';
import { wizardMachine } from './WizardMachine';

describe('WizardMachine', () => {
  it('goes to step2 when step1 data is valid', () => {
    const actor = createActor(wizardMachine);
    actor.start();

    actor.send({ type: 'START_WIZARD' });
    actor.send({
      type: 'NEXT',
      data: { productType: 'Laptop' },
    });

    expect(actor.getSnapshot().value).toBe('step2');
  });

  it('stays on step1 when data is invalid', () => {
    const actor = createActor(wizardMachine);
    actor.start();

    actor.send({ type: 'START_WIZARD' });
    actor.send({
      type: 'NEXT',
      data: { productType: '' },
    });

    expect(actor.getSnapshot().value).toBe('step1');
  });
});
