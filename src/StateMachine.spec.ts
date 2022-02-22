import assert from 'assert'

import StateMachine from './StateMachine';

const tests = [] as Function[];

// ================================================= //

it('should be able to set a initial state', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {}
    }
  })

  assert.equal(stateMachine.state, 'idle')
})

it('should not be able to set a initial state that does not exist', () => {
  function createMachine() {
    return new StateMachine({
      initialState: 'idle',
      states: {}
    })
  }

  assert.throws(createMachine, 'The initial state of a state machine must exist')
})

it('Should be able to execute actions that are available in the current state', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        walk: {
          execute: () => console.log('walk...'),
          onDone: 'walking',
          onError: 'idle'
        }
      },
      walking: {}
    }
  })

  assert.equal(stateMachine.state, 'idle')
  stateMachine.dispatch('walk')
  assert.equal(stateMachine.state, 'walking')
})

it('Should not be able to execute actions that are not available in the current state', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        walk: {
          execute: () => console.log('walk...'),
          onDone: 'walking',
          onError: 'idle'
        }
      },
    }
  })

  assert.equal(stateMachine.state, 'idle')

  assert.throws(() => {
    stateMachine.dispatch('walk')
  })
})

it('Should be able to pass params to actions functions', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        welcome: {
          execute: (name) => `Hello ${name}!`,
        }
      },
    }
  })

  const welcomeMsg = stateMachine.dispatch('welcome', 'Daniel')

  assert.equal(welcomeMsg, 'Hello Daniel!')
})

it('Actions "onError" must change state when an error happens', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        error: {
          execute: () => { throw new Error('error') },
          onError: 'failed',
          onDone: 'idle'
        }
      },

      failed: {}
    }
  })

  assert.equal(stateMachine.state, 'idle')
  stateMachine.dispatch('error')
  assert.equal(stateMachine.state, 'failed')
})

it('When action fails, it should not set state to "onDone" value', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        error: {
          execute: () => { throw new Error('error') },
          onDone: 'done'
        }
      },

      done: {}
    }
  })

  assert.equal(stateMachine.state, 'idle')
  stateMachine.dispatch('error')
  assert.equal(stateMachine.state, 'idle')
})

it('Should be able to add a listener to state transitions', () => {
  const stateMachine = new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        walk: {
          execute: (shouldFail) => {
            if (shouldFail) {
              throw new Error('fail')
            }

            console.log('walk...')
          },
          onDone: 'walking',
          onError: 'fail'
        }
      },
      walking: {
        stop: {
          execute: () => console.log('stopping...'),
          onDone: 'idle'
        }
      },
      fail: {}
    }
  })

  assert.equal(stateMachine.state, 'idle')

  let msg = ''

  stateMachine.onTransition((from, to) => {
    msg = `${from} => ${to}`
  })

  stateMachine.dispatch('walk')

  assert.equal(msg, 'idle => walking')

  stateMachine.dispatch('stop')
  stateMachine.dispatch('walk', true)

  assert.equal(msg, 'idle => fail')
})

// ================================================= //

function it(testDescription: string, testFunction: Function) {
  tests.push(() => {
    try {
      testFunction()
      console.log(`\n ✅ "${testDescription}" passed!`)
    } catch (error) {
      console.log(`\n ❌ "${testDescription}" failed!`)
      throw error;
    }
  })
}

function runTests() {
  tests.forEach(test => {
    test()
  })
}

try {
  runTests()
} catch (error) {
  console.log(error)
}
