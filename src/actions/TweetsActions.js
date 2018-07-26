
export const adicionaTweet = function (novoTweet) {
    return function (dispatch) {
        fetch(`http://localhost:3001/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ conteudo: novoTweet })
        })
        .then((respostaDoServidor) => {
            console.log(respostaDoServidor.status)
            if(respostaDoServidor.status === 201) {
                return respostaDoServidor.json()
            }
        })
        .then((tweetVindoDoServidor) => {
            console.log('Tweet chegou', tweetVindoDoServidor)
            dispatch({ type: 'ADICIONA_TWEET', novoTweetLindinho: tweetVindoDoServidor })
            // this.setState({
            //     novoTweet: '',
            //     tweets: [tweetVindoDoServidor ,...this.state.tweets]
            // })
        })
    }
}

export const carregaTweets = function() {
    console.log('ta pegando aqui')
    return (dispatch) => {
        fetch(`http://localhost:3001/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
        .then((respostaDoServidor) => {
            return respostaDoServidor.json()
        })
        .then((tweetsVindoDoServidor) => {
            dispatch({ type: 'CARREGA_TWEETS', tweets: tweetsVindoDoServidor })
        })
    }
}


export const removeTweet = function(idDoTweetQueVaiSumir) {
    console.log(idDoTweetQueVaiSumir)
    return function(dispatch) {
        fetch(`http://localhost:3001/tweets/${idDoTweetQueVaiSumir}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'DELETE'
        })
        .then(( respostaDoServidor ) => respostaDoServidor.json() )
        .then(( respostaEmObjeto ) => {
            dispatch( { type: 'REMOVE_TWEET', idDoTweet: idDoTweetQueVaiSumir } )
            dispatch( { type: 'SHOW_NOTIFICACAO', texto: 'Tweet apagado com sucessinhos!' } )
        })

    }
}