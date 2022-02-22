type Action = {
  onDone?: string
  onError?: string
  execute: (...args: any[]) => unknown
}

type Listener = (from: string, to: string) => void

type ConstructorArgs = {
  initialState: string
  states: {
    [stateName: string]: {
      [actionName: string]: Action
    }
  }
}

export default class StateMachine {
  private _state = ''
  private _transitionListener?: Listener
  private _states

  constructor({ initialState, states  }: ConstructorArgs) {
    this._states = states
    this.setState(initialState)
  }

  dispatch = (actionName: string, ...args: unknown[]) => {
    const availableActions = this._states[this.state]

    const action = availableActions[actionName];

    if (action) {
      const currentState = this.state

      let returnValue

      try {
        returnValue = action.execute(...args)
      } catch {
        this.setState(action?.onError)

        if (this._transitionListener) {
          this._transitionListener(currentState, this.state)
        }

        return returnValue
      }

      this.setState(action?.onDone)

      if (this._transitionListener) {
        this._transitionListener(currentState, this.state)
      }

      return returnValue
    } else {
      throw new Error(`Action "${actionName}" is not available in state "${this.state}"`)
    }
  }

  private setState = (state?: string) => {
    if (state === undefined) return

    const stateExists = !!this._states[state]

    if (stateExists) {
      this._state = state
    } else {
      throw new Error(`State "${state}" does not exist`)
    }
  }

  get state() {
    return this._state
  }

  public onTransition(listener: Listener) {
    this._transitionListener = listener
  }
}
