import StateMachine from './StateMachine'
import wait from './utils/wait';

const product = {
  stateMachine: new StateMachine({
    initialState: 'idle',
    states: {
      idle: {
        order: {
          action: () => console.log('...order'),
          onDone: 'ordered'
        }
      },

      ordered: {
        cancel: {
          action: () => console.log('...cancel'),
          onDone: 'cancelled'
        },
        requestShipment: {
          action: () => console.log('...request shipment'),
          onDone: 'shipping'
        }
      },

      shipping: {
        deliver: {
          action: () => console.log('...deliver'),
          onDone: 'delivered'
        }
      },

      delivered: {
        confirmDelivery: {
          action: () => console.log('...confirm delivery'),
          onDone: 'closed'
        }
      },

      closed: {},

      cancelled: {
        order: {
          action: () => console.log('...order'),
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
