import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';

import StateMachine from './index.js';

describe('StateMachine', () => {
  const { triggerEvent, currentState } = StateMachine({
    initial: {
      action: payload => `initial::Payload: "${payload}"`,
      triggers: {
        next: 'tic',
      },
    },
    tic: {
      action: payload => `tic::Payload: "${payload}"`,
      triggers: {
        next: 'tac',
        again: 'tic',
      },
    },
    tac: {
      action: payload => `tac::Payload: "${payload}"`,
      triggers: {
        next: 'toe',
        back: 'tic',
      },
    },
    toe: {
      action: payload => `toe::Payload: "${payload}"`,
      triggers: {},
    },
  });

  test('can provide the initial state', () => {
    assert.equal(currentState(), 'initial');
  });

  test('throws an exception for unrecognised trigger', () => {
    assert.throws(
      () => triggerEvent('start'),
      Error("Unable to locate trigger 'start' for current state (initial).")
    );
  });

  test('can provide the updated state', () => {
    assert.equal(currentState(), 'initial');
    const result = triggerEvent('next', 'next from initial to tic');
    assert.equal(result, 'initial::Payload: "next from initial to tic"');
    assert.equal(currentState(), 'tic');

    triggerEvent('again', 'again from tic to tic');
    assert.equal(currentState(), 'tic');

    triggerEvent('next', 'next from tic to tac');
    assert.equal(currentState(), 'tac');

    triggerEvent('back', 'back from tac to tic');
    assert.equal(currentState(), 'tic');

    triggerEvent('next', 'next from tic to tac');
    assert.equal(currentState(), 'tac');

    triggerEvent('next', 'next from tac to toe');
    assert.equal(currentState(), 'toe');
  });
});
