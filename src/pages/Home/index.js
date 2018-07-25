import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import Helmet from 'react-helmet'


class Home extends Component {
    constructor() {
        super()
        this.state = {
            novoTweet: '',
            tweets: []
        }
        // this.adicionarTweet = this.adicionarTweet.bind(this)
    }

    componentDidMount() {
        fetch(`http://localhost:3001/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
            .then((respostaDoServidor) => {
                return respostaDoServidor.json()
            })
            .then((tweetsVindoDoServidor) => {
                this.setState({
                    tweets: tweetsVindoDoServidor,
                    bolinha: 'xablau'
                })
            })
    }

    adicionarTweet = (event) => {
        // Previne o carregamento
        event.preventDefault()
        // Adicionar na tela: O conteudo do tweet no formato de um <Tweet />


        const novoTweet = this.state.novoTweet // Copia do valor¸        

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
            console.log('Tweets chegaram')
            this.setState({
                novoTweet: '',
                tweets: [tweetVindoDoServidor ,...this.state.tweets]
            })
            console.log(tweetVindoDoServidor)
        })

        // function setState() {
            // this.state.tweets.push('Texto qualquer')
            // this.render()
        // }
    }

    removerTweet = (idDoTweetQueVaiSumir) => {

        fetch(`http://localhost:3001/tweets/${idDoTweetQueVaiSumir}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'DELETE'
        })
        .then(( respostaDoServidor ) => respostaDoServidor.json() )
        .then(( respostaEmObjeto ) => {
            const listaAtualizada = this.state.tweets.filter((tweetInteiro) => {
                return tweetInteiro._id !== idDoTweetQueVaiSumir
            })
            this.setState({
                tweets: listaAtualizada
            })  
        })
    }

  render() {
    return (
      <Fragment>
        <Helmet title={`Home (${this.state.tweets.length}) - Twitelum`} />
        <Cabecalho>
            <NavMenu usuario="@omariosouto" />
        </Cabecalho>
        <div className="container">
            <Dashboard>
                <Widget>
                    <form className="novoTweet" onSubmit={this.adicionarTweet}>
                        <div className="novoTweet__editorArea">
                            <span
                                className={`
                                    novoTweet__status 
                                    ${this.state.novoTweet.length > 140
                                        ? 'novoTweet__status--invalido'
                                        : ''
                                    }
                                    `}>
                                {this.state.novoTweet.length}/140
                            </span>
                            
                            <textarea
                                    className="novoTweet__editor"
                                    onChange={ (evento) => { this.setState({ novoTweet: evento.target.value }) } }
                                    value={this.state.novoTweet}
                                    placeholder="O que está acontecendo?"></textarea>
                        </div>
                        <button type="submit" disabled={this.state.novoTweet.length > 140} className="novoTweet__envia">Tweetar</button>
                    </form>
                </Widget>
                <Widget>
                    <TrendsArea />
                </Widget>
            </Dashboard>
            <Dashboard posicao="centro">
                <Widget>
                    <div className="tweetsArea">
                        {   
                            // Dados passados para o map: ['Tweet 1', 'Tweet 2']
                            this.state.tweets.map((tweetAtual, indice) => {
                                // console.log(tweetAtual)
                                return <Tweet
                                            key={indice}
                                            _id={tweetAtual._id}
                                            totalLikes={tweetAtual.totalLikes}
                                            texto={tweetAtual.conteudo}
                                            likeado={tweetAtual.likeado}
                                            removeHandler={this.removerTweet}
                                            removivel={tweetAtual.removivel}
                                            usuario={tweetAtual.usuario} />
                            }) 
                            
                            // Retorno do Map:
                            // [
                            //     <Tweet texto={'Tweet 1'}/>,
                            //     <Tweet texto={'Tweet 2'}/>
                            // ]
                        }
                    </div>
                </Widget>
            </Dashboard>
        </div>

        <Widget>
            <Tweet
                _id={'XPOASOSPDJAS'}
                texto={ 'Xablau' }
                usuario={ {foto: 'x', nome: 'ansan', login:'x'} }/>
        </Widget>
      </Fragment>
    );
  }
}

export default Home;
