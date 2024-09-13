export default function StateMachine(stateModel, actions) {
  let _currentState = Object.keys(stateModel)[0];

  return {
    triggerEvent(_trigger, _payload) {
      if (stateModel[_currentState].triggers[_trigger]) {
        _currentState = stateModel[_currentState].triggers[_trigger];
        const _action = stateModel[_currentState].action;

        if (!actions[_action]) {
          throw Error(
            `Unable to locate action '${_action}' for current state (${_currentState}).`
          );
        }
        return actions[_action](_payload);
      }
      throw Error(
        `Unable to locate trigger '${_trigger}' for current state (${_currentState}).`
      );
    },
    currentState: () => _currentState,
  };
}
