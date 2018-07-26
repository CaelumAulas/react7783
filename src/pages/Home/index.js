import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import Modal from '../../components/Modal'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import * as TweetsActions from '../../actions/TweetsActions'

class Home extends Component {
    constructor() {
        super()
        this.state = {
            novoTweet: '',
            tweets: [],
            tweetAtivo: {}
        }
        // this.adicionarTweet = this.adicionarTweet.bind(this)
    }

    static contextTypes = {
        store: PropTypes.object
    }

    componentDidMount() {
        this.context.store.subscribe(() => {
            // console.log('To só de olho nesse dispatch feito na store')
            const tweetsVindoDaStore = this.context.store.getState().tweets
            this.setState({
                tweets: tweetsVindoDaStore
            })
        })
        // TweetsActions.carregaTweets(this.context.store.dispatch)
        this.context.store.dispatch(TweetsActions.carregaTweets())
        // Testem esse aqui
        // this.context.store.dispatch({ type: 'tudomais' })
        // this.context.store.dispatch(function(dispatch) {
        //     console.log(dispatch)
        // })

    }

    adicionarTweet = (event) => {
        // Previne o carregamento
        event.preventDefault()
        const novoTweet = this.state.novoTweet // Copia do valor¸        
        this.context.store.dispatch(TweetsActions.adicionaTweet(novoTweet))
    }

    // removerTweet = (idDoTweetQueVaiSumir) => {
    //     fetch(`http://localhost:3001/tweets/${idDoTweetQueVaiSumir}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
    //         method: 'DELETE'
    //     })
    //     .then(( respostaDoServidor ) => respostaDoServidor.json() )
    //     .then(( respostaEmObjeto ) => {
    //         const listaAtualizada = this.state.tweets.filter((tweetInteiro) => {
    //             return tweetInteiro._id !== idDoTweetQueVaiSumir
    //         })
    //         this.setState({
    //             tweets: listaAtualizada
    //         })  
    //     })
    // }

    fechaModal = (evento) => {
        console.log('que q taonteceno', )
        const isModal = evento.target.classList.contains('modal')
        if(isModal) {
            this.setState({
                tweetAtivo: {}
            })
        }
    }

    abreModal = (idDoTweetQueVaiNoModal, evento) => { 
        
        const isDentroDoTweetFooter = evento.target.closest('.tweet__footer')

        if(!isDentroDoTweetFooter) {
            // Filtrar qual item vai ficar no tweetAtivo
            const tweetQueVaiNoModal = this.state.tweets.find( (tweetAtual) => { 
                return tweetAtual._id === idDoTweetQueVaiNoModal
            })
            console.log(tweetQueVaiNoModal)
            this.setState({
                tweetAtivo: tweetQueVaiNoModal
            })            
        }
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
                        { Boolean(this.state.tweets.length) || 'Carregando...' }
                        {   
                            // Dados passados para o map: ['Tweet 1', 'Tweet 2']
                            this.state.tweets.map((tweetAtual, indice) => {
                                // console.log(tweetAtual)
                                return <Tweet
                                            key={tweetAtual._id}
                                            _id={tweetAtual._id}
                                            totalLikes={tweetAtual.totalLikes}
                                            texto={tweetAtual.conteudo}
                                            likeado={tweetAtual.likeado}
                                            removeHandler={this.removerTweet}
                                            abreModalHandler={(event) => this.abreModal(tweetAtual._id, event)}
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

        <Modal
                isAberto={Boolean(this.state.tweetAtivo._id)}
                fechaModalHandler={this.fechaModal}>
            {
                this.state.tweetAtivo._id &&
                    <Widget>
                        <Tweet 
                            _id={this.state.tweetAtivo._id}
                            texto={this.state.tweetAtivo.conteudo}
                            likeado={this.state.tweetAtivo.likeado}
                            removivel={this.state.tweetAtivo.removivel}
                            totalLikes={this.state.tweetAtivo.totalLikes}
                            usuario={this.state.tweetAtivo.usuario}/>
                    </Widget>
            }
        </Modal>

        {
            this.context.store.getState().notification &&
            <div
                className="notificacaoMsg"
                onAnimationEnd={ () => this.context.store.dispatch({ type: 'LIMPA_NOTIFICACAO' }) }>
                {this.context.store.getState().notification}
            </div>
        }

      </Fragment>
    );
  }
}



export default Home;
