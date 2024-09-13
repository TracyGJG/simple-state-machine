import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';

import stateModel from './stateModel.json' with { type:  'json'};

import StateMachine from './index.js';

const actions = {
  initialAction: payload => `initial::Payload: "${payload}"`,
  ticAction: payload => `tic::Payload: "${payload}"`,
  tacAction: payload => `tac::Payload: "${payload}"`,
  tocAction: payload => `toe::Payload: "${payload}"`,
};

describe('StateMachine', () => {
  const { triggerEvent, currentState } = StateMachine(stateModel, actions);

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
    assert.equal(result, 'tic::Payload: "next from initial to tic"');
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

describe('StateMachine (invalid action)', () => {
  const _stateModel = structuredClone(stateModel);
    _stateModel.tic.action = '_';

  const { triggerEvent, currentState } = StateMachine(_stateModel, actions);

  test('throws an exception for unlocated action', () => {
    assert.equal(currentState(), 'initial');
    assert.throws(
      () => triggerEvent('next', 'next from initial to tic'),
      Error("Unable to locate action '_' for current state (tic).")
    );
  })
});
