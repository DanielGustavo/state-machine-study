type Transition = {
  onDone?: string
  onError?: string
  action: (...args: any[]) => unknown
}

type Listener = (from: string, to: string) => void

type ConstructorArgs = {
  initialState: string
  states: {
    [stateName: string]: {
      [transitionName: string]: Transition
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

  dispatch = (transitionName: string, ...args: unknown[]) => {
    const availableTransitions = this._states[this.state]

    const transition = availableTransitions[transitionName];

    if (transition) {
      const currentState = this.state

      let returnValue

      try {
        returnValue = transition.action(...args)
      } catch {
        this.setState(transition?.onError)

        if (this._transitionListener) {
          this._transitionListener(currentState, this.state)
        }

        return returnValue
      }

      this.setState(transition?.onDone)

      if (this._transitionListener) {
        this._transitionListener(currentState, this.state)
      }

      return returnValue
    } else {
      throw new Error(`Action "${transitionName}" is not available in state "${this.state}"`)
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
