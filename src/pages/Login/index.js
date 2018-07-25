import React, { Component } from 'react'
import Widget from '../../components/Widget'
import Helmet from 'react-helmet'
import './loginPage.css'


class LoginPage extends Component {

    constructor() {
        super()

        this.state = {
            inputLogin: '',
            inputSenha: ''
        }

        console.log(this)
        // Fazer o bind aqui em cima
    }

    fazLogin = (event) => {
        event.preventDefault()

        console.log("Devemos fazer um login muito louco")
        
        const dadosDeLogin = {
            login: this.inputLogin.value,
            senha: this.inputSenha.value
        }
        
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosDeLogin)
        })
        .then((respostaDoServidor) => {
            // Se basenado nisso, faça validações
            // console.log(respostaDoServidor.status)
            if(respostaDoServidor.status === 200) {
                return respostaDoServidor.json()
            }
            throw new Error('Algum erro aconteceu')
        })
        .then((respostaEmObjeto) => {
            localStorage.setItem('TOKEN', respostaEmObjeto.token)
            localStorage.setItem('LOGIN', dadosDeLogin.login)
            this.props.history.push('/')
        })
    }

    render() {
        console.log('render rodou uma vez :)')
        document.title = 'Login'

        return (
            <div className="loginPage">
                <Helmet title="Login - Twitelum" />
                <div className="container">
                    <Widget>
                        <h1 className="loginPage__title">Twitelum</h1>
                        <form className="loginPage__form" action="/" onSubmit={this.fazLogin}>
                            <div className="loginPage__inputWrap">
                                <label className="loginPage__label" htmlFor="login">Login</label> 
                                {/* Fazer o onChange */}
                                <input ref={ (inputLogin) => this.inputLogin = inputLogin } className="loginPage__input" type="text" id="login" name="login"/>
                            </div>
                            <div className="loginPage__inputWrap">
                                <label className="loginPage__label" htmlFor="senha">Senha</label> 
                                <input ref={ (inputSenha) => this.inputSenha = inputSenha } className="loginPage__input" type="password" id="senha" name="senha"/>
                            </div>
                            {/* <div className="loginPage__errorBox">
                                Mensagem de erro!
                            </div> */}
                            <div className="loginPage__inputWrap">
                                <button className="loginPage__btnLogin" type="submit">
                                    Logar
                                </button>
                            </div>
                        </form>
                    </Widget>
                </div>
            </div>
        )
    }
}


export default LoginPage