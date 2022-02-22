import StateMachine from './StateMachine'
import wait from './utils/wait';

const product = {
  stateMachine: new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        order: {
          execute: () => console.log('...order'),
          onDone: 'ordered'
        }
      },

      ordered: {
        cancel: {
          execute: () => console.log('...cancel'),
          onDone: 'cancelled'
        },
        requestShipment: {
          execute: () => console.log('...request shipment'),
          onDone: 'shipping'
        }
      },

      shipping: {
        deliver: {
          execute: () => console.log('...deliver'),
          onDone: 'delivered'
        }
      },

      delivered: {
        confirmDelivery: {
          execute: () => console.log('...confirm delivery'),
          onDone: 'closed'
        }
      },

      closed: {},

      cancelled: {
        order: {
          execute: () => console.log('...order'),
          onDone: 'ordered'
        }
      }
    }
  })
}

product.stateMachine.onTransition((from, to) => {
  console.log(`[DEBUG] ${from} ====> ${to}\n`)
})

;(async () => {
  try {
    product.stateMachine.dispatch('order')

    await wait(600)
    product.stateMachine.dispatch('cancel')

    console.log('==================')

    await wait(600)
    product.stateMachine.dispatch('order')

    await wait(600)
    product.stateMachine.dispatch('requestShipment')

    await wait(600)
    product.stateMachine.dispatch('deliver')

    await wait(600)
    product.stateMachine.dispatch('confirmDelivery')

    await wait(600)
    product.stateMachine.dispatch('cancel')
  } catch (error) {
    console.log('!!!!!! ' + (error as any).message)
  }
})()
