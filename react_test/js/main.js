/* global THREE */
/* global $ */
/* global React */
/* global ReactDOM */ 
/* global GAMES */

;$(function(){
    'use strict'
    var GAME;
    
    initial_setup()    //  setup dom, etc.
    setup_react_components()     //  setup react components
    loop()

    function initial_setup() {
        //  todo
    }
    function games_setup() {

    }
    function loop(callbacks) {
        
        requestAnimationFrame(loop)
    }
    
    function setup_react_components() {
        const root = $('#root')[0]
        var lab;
        
        class FGLab extends React.Component {
            constructor(props) {
                super(props)
                
                this.state = {
                    starting: true
                }
            }
            
            render() {
                
                const lab_title = 'F.G. Laboratory'
                const titles = Object.keys(this.props.GAMES)
                
                if (this.state.starting) {
                    return (
                        <FGLabStartup
                            id='startup'
                        />
                    )
                }
                return (
                    <div className='container-fluid'>
                        <div className='row'>
                            <LabHeader title={lab_title} id='lab_header' className='col text-center'/>
                        </div>
                        <GameContainer 
                            id='game_container'
                            className='row'
                            titles={titles}
                        />
                        <LabFooter id='lab_footer' className='row'>
                        </LabFooter>

                    </div>
                )
            }
            
            componentDidMount() {
                console.log('FGLab component mounted')
                this.setState({
                    starting: false
                })
            }

        }
        
        class FGLabStartup extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                
                return (
                    <div id={id} className={classes}>
                        <div id='startup_content'>
                            <FGLabStartupMsg className='text-center' />
                            <FGLabStartupBar id='startup_bar' />
                        </div>
                    </div>
                )
            }
        }
        
        class FGLabStartupMsg extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                
                return (
                    <h2 {...this.props}>
                        Entering <br />
                        Future Gadgets <br />
                        Laboratory
                    </h2>
                )
            }
        }
        
        class FGLabStartupBar extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                return (
                    <div {...this.props}>
                        
                    </div>
                )
            }

        }
        
        class LabHeader extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                const title = this.props.title
                
                return (
                    <div id={id} className={classes}>
                        <h1>
                            {title}
                        </h1>
                    </div>
                )
            }
        }
        
        class GameContainer extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    GAME: undefined,
                    messages: [{text: 'Welcome!', bold: false, key: Date.now()}],
                    input: ''
                }
                this.display = {
                    height: undefined,
                    width: undefined
                }
                this.renderer = new THREE.WebGLRenderer()
                
                this.handleGameClick = this.handleGameClick.bind(this)
                this.handleLoadGame = this.handleLoadGame.bind(this)
                this.canvasDidMount = this.canvasDidMount.bind(this)
                this.handleInputChange = this.handleInputChange.bind(this)
                this.handleInput = this.handleInput.bind(this)
                this.handleIncomingData = this.handleIncomingData.bind(this)
                
                this.COMM = new UTIL.COMM('game_container')
                this.COMM.on('incoming', this.handleIncomingData)
            }
            
            handleIncomingData(data) {
                if (data.type === 'text') {
                    const capacity = 30
                    let newMessage = data.data
                    let messages = this.state.messages.length === capacity ?
                        this.state.messages.slice(1, capacity) :
                        this.state.messages.slice()
                    messages.push({
                        bold: true,
                        text: data.from + ': ' + newMessage,
                        key: Date.now()
                    })
                    
                    this.setState({
                        messages: messages
                    })
                }
            }
            
            handleGameClick(title) {
                this.handleLoadGame(title)
            }
            
            handleLoadGame(title) {
                let initData = {
                    renderer: this.renderer,
                    height: this.display.height,
                    width: this.display.width
                }
                if (GAMES[title] === undefined) return;
                
                if (this.state.GAME !== undefined) {
                    this.state.GAME.onRemoval()
                    this.COMM.disconnect(this.state.GAME.COMM)
                }
                let newgame = new GAMES[title](initData)
                this.COMM.connect(newgame.COMM)
                
                this.setState({
                    GAME: newgame
                })
            }
            
            handleInputChange(inputValue) {
                this.setState({
                    input: inputValue
                })
            }
            
            handleInput(inputValue) {
                const firstSpace = inputValue.indexOf(' ')
                const capacity = 30
                
                if (firstSpace !== -1) {
                    let command = inputValue.substring(0, firstSpace)
                    if (command === '/cmd') {
                        let regex = / /g
                        let commands = inputValue.split(regex)
                        if (commands[1] === 'load' && commands[2]) {
                            this.handleLoadGame(commands[2])
                        } else if (commands[1] === 'game' && commands[2]) {
                            if (this.state.GAME && commands[2] === this.state.GAME.TITLE) {
                                this.COMM.trigger('outgoing', {
                                    type: 'command',
                                    data: commands.slice(3)
                                })
                            } else if (commands[2] === 'quit') {
                                if (this.state.GAME !== undefined) {
                                    this.state.GAME.onRemoval()
                                    this.COMM.disconnect(this.state.GAME.COMM)
                                }
                                this.setState({
                                    GAME: undefined
                                })
                            }
                        }
                    }
                }
                let messages = this.state.messages.length === capacity ? 
                                this.state.messages.slice(1, capacity) :
                                this.state.messages.slice()
                messages.push({
                    text: inputValue,
                    bold: false,
                    key: Date.now()
                })
                
                this.setState({
                    input: '',
                    messages: messages
                })
            }
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                const game = this.state.GAME
                const titles = this.props.titles
                const messages = this.state.messages
                const input = this.state.input
                
                if (this.state.GAME !== undefined && this.state.GAME.COMMUNICATION && this.state.GAME.COMMUNICATION.out) 
                    console.log(this.state.GAME.COMMUNICATION.out)
                
                const menu = (
                    <Menu 
                        id='menu' 
                        className='col-md-3'
                        game={game}
                        titles={titles}
                        handleGameClick={this.handleGameClick}
                    />
                )
                
                return (
                    <div id={id} className={classes} ref={el => this.domNode = el}>
                        <Display 
                            id='display' 
                            className='col-md-9' 
                            renderer={this.renderer} 
                            game={game}
                            handleCanvasMount={this.canvasDidMount}
                        />
                        
                        <MessageBox
                            id='message_box'
                            className='col-md-3'
                            handleChange={this.handleInputChange}
                            handleInput={this.handleInput}
                            messages={messages}
                            input={input}
                        />
                    </div>
                )
            }
            
            canvasDidMount(info) {
                this.display.height = info.height
                this.display.width = info.width
            }
            

        }
        
        class Display extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    animation_frame_id: undefined,
                    game: undefined
                }
                
                this.loop = this.loop.bind(this)
            }
            
            render() {
                const id = this.props.id
                /*
                if (this.props.game &&  this.props.game !== this.state.game) {
                    this.mountCanvas()
                    window.cancelAnimationFrame(this.state.animation_frame_id)
                    this.loop()
                }
                */
                return (
                    <div 
                        id={id} 
                        className={this.props.className} 
                        ref={ disp => this.domNode = disp }
                    />
                )
            }
            
            componentDidMount() {
                let $domNode = $(this.domNode)
                let info = {
                    height: $domNode.height(),
                    width: $domNode.width()
                }
                this.props.handleCanvasMount(info)
            }
            
            componentDidUpdate() {
                if (this.props.game === undefined) {
                    $(this.domNode).empty()
                    window.cancelAnimationFrame(this.state.animation_frame_id)
                } else if (this.props.game !== this.state.game) {
                    this.mountCanvas()
                    window.cancelAnimationFrame(this.state.animation_frame_id)
                    this.loop()
                }
            }
            
            mountCanvas() {
                $(this.domNode).empty()
                $(this.domNode).html(this.props.game.DISPLAY)
                this.setState({
                    game: this.props.game
                })
            }
            
            loop() {
                if (this.props.game) this.props.game.update()
                this.setState({
                    animation_frame_id: requestAnimationFrame(this.loop)
                })

            }

        }
        
        class Menu extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                let game_titles = this.props.titles
                let game_options = game_titles.map((title, index) => {
                    let game;
                    if (this.props.game && this.props.game.TITLE === title) game = this.props.game;
                    return (
                        <MenuOption 
                            game={game} 
                            title={title} 
                            key={title}
                            handleGameClick={this.props.handleGameClick}
                            id={"option"+index}
                        />
                    )
                })
                
                return (
                    <div id={this.props.id} className={this.props.className}>
                        {game_options}
                    </div>
                )
            }
        }
        
        class MenuOption extends React.Component {
            constructor(props) {
                super(props)
                
                this.handleClick = this.handleClick.bind(this)
            }
            
            handleClick(e) {
                this.props.handleGameClick(this.props.title)
            }
            
            render() {
                let menu_option = (
                    <div className='card' ref={ el => this.domNode = el}>
                        <div className='card-header'>
                            <h5 className='mb-0'>
                                <a data-toggle='collapse' data-parent='#menu' href={'#'+this.props.id} onClick={this.handleClick}>
                                    {this.props.title}
                                </a>
                            </h5>
                        </div>
                        <div id={this.props.id} className='collapse'>
                            <div className='card-block'>

                            </div>
                        </div>
                    </div>
                )
                this.mountMenu()
                return menu_option;
                
                /*
                if (this.props.game) {
                    return (
                        <div className={this.props.className} ref={ el => this.domNode = el}>
                            <h2>
                                <a href='#' onClick={this.handleClick}>
                                    {this.props.title}
                                </a>
                            </h2>
                            <div>
                            </div> 
                        </div>
                    )
                }
                */
            }
            
            mountMenu() {
                /*
                let $container = $(this.domNode).children(':last')
                $container.empty()
                if (this.props.game) $container.append(this.props.game.MENU)
                */
                let $container = $(this.domNode).find('.card-block')
                $container.empty()
                if (this.props.game) $container.append(this.props.game.MENU)
            }
        }

        class LabFooter extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                const content = this.props.children
                
                return (
                    <div id={id} className={classes}>
                        {this.props.children}
                    </div>
                )
            }
        }
        
        class MessageBox extends React.Component {
            constructor(props) {
                super(props)
                
            }
            
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                
                return (
                    <div id={id} className={classes} ref={el => this.domNode = el}>
                        <MessagesContainer
                            id='message_container'
                            messages = {this.props.messages}
                        />
                        <MessagesInputBox 
                            input={this.props.input}
                            handleChange={this.props.handleChange}
                            handleInput={this.props.handleInput}
                        />
                    </div>
                )
            }
            
            componentDidUpdate() {
                let $domNode = $(this.domNode)
                $domNode.scrollTop(1000)
            }
        }
        
        class MessagesContainer extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                const messages = this.props.messages.map((message, index, arr) => {
                    return (
                        <Message 
                            message={message.text} 
                            bold={message.bold} 
                            key={message.key} 
                        />
                    )
                })
                
                return (
                    <div id={id} className={classes}>
                        {messages}
                    </div>
                )
            }
        }
        
        class Message extends React.Component {
            constructor(props) {
                super(props)
                this.created = new Date()
            }
            
            render() {
                function addParenthesis(s) {return '(' + s + ')';}
                
                const prefix = '--> ' + addParenthesis(this.created.toLocaleTimeString()) + ' '
                const message = this.props.message || this.props.children
                const classes = this.props.className + ' message'
                return (
                    <div className={classes}>
                        <b>{prefix}</b>
                        {
                            this.props.bold ?
                                <b>{message}</b> :
                                message
                        }
                    </div>
                )
            }

        }
        
        class MessagesInputBox extends React.Component {
            constructor(props) {
                super(props)
                
                this.handleChange = this.handleChange.bind(this)
                this.handleInput = this.handleInput.bind(this)
                this.handleKeyDown = this.handleKeyDown.bind(this)
            }
            
            handleChange(e) {
                let value = e.target.value
                this.props.handleChange(value)
            }
            
            handleInput(e) {
                let inputValue = e.target.value
                this.props.handleInput(inputValue)
            }
            
            handleKeyDown(e) {
                const keyCode = e.keyCode
                if (keyCode === 13) this.handleInput(e)
            }
            
            componentDidMount() {
                $(this.domNode).trigger('focus')
            }
            
            render() {
                const classes = this.props.className
                
                return (
                    <div className={classes + ' input-group'}>
                        <span className='input-group-addon'><b>--></b></span>
                        <input 
                            value={this.props.input} 
                            type='text' 
                            className='form-control'
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                            ref={ el => this.domNode = el}
                        />
                    </div>
                )
            }
        }
        
        lab = (
            <FGLab
                GAMES={GAMES}
            />
        )
        
        ReactDOM.render(
            lab,
            root
        )
    }
})