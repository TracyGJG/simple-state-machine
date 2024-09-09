export default function StateMachine(stateModel) {
  let _currentState = Object.keys(stateModel)[0];

  return {
    triggerEvent(trigger, payload) {
      if (stateModel[_currentState].triggers[trigger]) {
        const activeState = _currentState;
        _currentState = stateModel[activeState].triggers[trigger];
        return stateModel[activeState].action(payload);
      }
      throw Error(
        `Unable to locate trigger '${trigger}' for current state (${_currentState}).`
      );
    },
    currentState: () => _currentState,
  };
}
