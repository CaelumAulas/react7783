import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

function tweetsReducer(stateDaStore = [], action) {
    if(action.type === 'CARREGA_TWEETS') {
        return action.tweets
    }

    if(action.type === 'ADICIONA_TWEET') {
        return [ action.novoTweetLindinho, ...stateDaStore ]
    }

    if(action.type === 'REMOVE_TWEET') {
        // Vai fazer um filter no state dos tweets
        const listaAtualizadaDeTweets = stateDaStore.filter((tweetAtual) => {
            return tweetAtual._id !== action.idDoTweet
        })

        return listaAtualizadaDeTweets
    }

    if(action.type === 'LIKE_TWEET') {

        return stateDaStore.map((tweetAtual) => {
            console.log('asdsd')
            if(tweetAtual._id === action.idDoTweetLikeado) {
                const { likeado, totalLikes } = tweetAtual
                
                tweetAtual.totalLikes = likeado ? totalLikes - 1 : totalLikes + 1
                tweetAtual.likeado = !likeado
            }

            return tweetAtual
        })
    }

    return stateDaStore // tweets
}


function notificationReducer(state = '', action) {
    if(action.type === 'SHOW_NOTIFICACAO') {
        return action.texto
    }

    if(action.type === 'LIMPA_NOTIFICACAO') {
        return ''
    }

    return state // notification
}

export default createStore(
    combineReducers({
        tweets: tweetsReducer,
        notification: notificationReducer
    }),
    applyMiddleware(thunkMiddleware)
)





// const createStore = (funcaoReducer) => {
//     let state
//     const subscribers = []


//     const dispatch = (action) => {
//         if(typeof action === 'function') {
//             action(dispatch)
//         } else {
//             state = funcaoReducer(state, action)
//             subscribers.forEach((funcaoDaVoltaAtual) => {
//                 funcaoDaVoltaAtual()
//             })
//         }
//     } 

//     const subscribe  = (funcao) => {
//         subscribers.push(funcao)
//     } 

//     dispatch({ type: 'redux iniciou porra!' })

//     return {
//         getState: () => {
//             return state
//         },
//         dispatch: dispatch,
//         subscribe: subscribe
//     }
// }