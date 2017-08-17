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
                            displayClasses='col-md-9'
                            messageBoxClasses='col-md-3'
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
            /*
                <GameContainer class='row'>
                    <Display class='col-md-9'>
                        <Canvas>
                    <MessageBox class'col-md-3'>
                        <MessagesContainer>
                            <Message>
                        <MessagesInputBox class='input-group'>
            */
            constructor(props) {
                super(props)

                this.state = {
                    GAME: undefined,
                    messages: [{text: 'Welcome! ', bold: false, key: Date.now()}],
                    input: '',
                    focus: 'messageBox'
                }
                this.keys = {}
                this.display = {
                    height: undefined,
                    width: undefined
                }
                this.renderer = new THREE.WebGLRenderer()
                this.handlers = {
                    document: {
                        keydown: {
                            gameContainer: undefined,
                            handle: function(e) {
                                let $domNode = $(this.gameContainer.domNode)

                                if (this.gameContainer.state.focus === 'display') {
                                    e.preventDefault()
                                    let currentKeys = Object.assign(
                                        {},
                                        this.gameContainer.keys
                                    )
                                    currentKeys[e.keyCode] = true
                                    this.gameContainer.keys = currentKeys
                                    
                                    let commands = ['/cmd', 'e', e, this.gameContainer.keys]
                                    
                                    this.gameContainer.COMM.trigger('outgoing',{
                                        type: 'array',
                                        data: commands
                                    })
                                }
                                else if (this.gameContainer.state.focus === 'messageBox') ;
                                
                            }
                        },
                        keyup: {
                            gameContainer: undefined,
                            handle: function(e) {
                                let $domNode = $(this.gameContainer.domNode)

                                if (this.gameContainer.state.focus === 'display') {
                                    e.preventDefault()
                                    let currentKeys = Object.assign(
                                        {},
                                        this.gameContainer.keys
                                    )
                                    currentKeys[e.keyCode] = false
                                    this.gameContainer.keys = currentKeys
                                    
                                    let commands = ['/cmd', 'e', e, this.gameContainer.keys]
                                    
                                    this.gameContainer.COMM.trigger('outgoing',{
                                        type: 'array',
                                        data: commands
                                    })
                                }
                                else if (this.gameContainer.state.focus === 'messageBox') ;
                                
                                
                            }
                        },
                        click: {
                            gameContainer: undefined,
                            handle: function(e) {
                                'handle parent'
                                let current = e.target
                                while (current !== null) {
                                    if (current === this.gameContainer.domNode) {
                                        /*
                                        if (this.gameContainer.state.focus === 'display') {
                                            let commands = ['/cmd', 'e', e]
                                    
                                            this.gameContainer.COMM.trigger('outgoing', {
                                                type: 'array',
                                                data: commands
                                            })
                                        }
                                        */
                                        return;
                                    }
                                    current = current.parentNode
                                }
                                this.gameContainer.setState({
                                    focus: undefined
                                })

                            }
                        },
                        mousemove: {
                            gameContainer: undefined,
                            handle: function(e) {
                                let $domNode = $(this.gameContainer.domNode)
                                
                                if (this.gameContainer.state.focus === 'display') {
                                    let commands = ['/cmd', 'e', e]
                                    this.gameContainer.COMM.trigger('outgoing', {
                                        type: 'array',
                                        data: commands
                                    })
                                }
                            }
                        }
                    },
                    window: {
                        resize: {
                            gameContainer: undefined,
                            handle: function(e) {
                                let commands = ['/cmd', 'e', e]
                                
                                this.gameContainer.COMM.trigger('outgoing', {
                                    type: 'text',
                                    data: commands
                                })
                            }    
                        }
                    }
                }
                
                let $document = $(document),
                    $window = $(window)
                for (let event in this.handlers.document) {
                    this.handlers.document[event].gameContainer = this
                    let handler = this.handlers.document[event].handle.bind(this.handlers.document[event])
                    $document.on(event, handler)
                }
                for (let event in this.handlers.window) {
                    this.handlers.window[event].gameContainer = this
                    let handler = this.handlers.window[event].handle.bind(this.handlers.window[event])
                    $window.on(event, handler)
                }
                
                this.handleLoadGame = this.handleLoadGame.bind(this)
                this.handleInputChange = this.handleInputChange.bind(this)
                this.handleInput = this.handleInput.bind(this)
                this.handleIncomingData = this.handleIncomingData.bind(this)
                this.handleDisplayResize = this.handleDisplayResize.bind(this)
                this.handleFocus = this.handleFocus.bind(this)
                
                this.COMM = new UTIL.COMM('game_container')
                this.COMM.on('incoming', this.handleIncomingData)
            }
            
            handleFocus(focusedElement, e) {
                this.setState({
                    focus: focusedElement
                })
                
                if (focusedElement === 'messageBox') return;
                let commands = ['/cmd', 'e', e]
                                    
                this.COMM.trigger('outgoing', {
                    type: 'array',
                    data: commands
                })
            }
            
            handleIncomingData(data) {
                if (data.type === 'text') {
                    const capacity = 30
                    let newMessage = data.data
                    let messages = this.state.messages.length === capacity ?
                        this.state.messages.slice(1, capacity) :
                        this.state.messages.slice()
                    messages.push({
                        bold: data.bold,
                        text: data.from + ': ' + newMessage,
                        key: Date.now()
                    })
                    
                    this.setState({
                        messages: messages
                    })
                } 
            }
            
            handleLoadGame(title) {
                let initData = {
                    renderer: this.renderer,
                    height: this.display.height,
                    width: this.display.width
                }
                if (GAMES[title] === undefined) return;
                
                if (this.state.GAME !== undefined) {
                    this.state.GAME.gameWillUnmount()
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
                            if (this.state.GAME && (commands[2] === this.state.GAME.TITLE || commands[2] === this.state.GAME._title)) {
                                
                                this.COMM.trigger('outgoing', {
                                    type: 'array',
                                    data: commands.slice(3)//    inputValue.substring(index)
                                })
                            } else if (commands[2] === 'quit') {
                                if (this.state.GAME !== undefined) {
                                    this.state.GAME.gameWillUnmount()
                                    this.COMM.disconnect(this.state.GAME.COMM)
                                }
                                this.setState({
                                    GAME: undefined
                                })
                            }
                        } else if (commands[1] == 'req') {
                            let message = commands[2];
                            $.ajax({
                                url: 'test.php',
                                method: 'POST',
                                data: {
                                  message: message  
                                },
                                dataType: 'json',
                                complete: (data) => {
                                    console.log(JSON.parse(data.responseText))
                                }
                            })
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
            
            handleDisplayResize(info) {
                this.display.height = info.height
                this.display.width = info.width
            }
            
            componentDidMount() {
                let $domNode = $(this.domNode)
                $domNode.css({
                    height: $(window).innerHeight() * 0.8,
                    'max-height': $(window).innerHeight() * 0.8
                })
            }
            
            componentWillUnmount() {
                
            }
            
            
            componentDidUpdate() {
                
            }
            
            render() {
                const id = this.props.id
                const game = this.state.GAME
                const titles = this.props.titles
                const messages = this.state.messages
                const input = this.state.input
                const classes = this.props.className
                const displayClasses = this.props.displayClasses,
                    messageBoxClasses = this.props.messageBoxClasses
                
                return (
                    <div 
                        id={id} 
                        className={classes} 
                        ref={el => this.domNode = el}
                        onClick={this.handleClick}
                    >
                        <Display 
                            id='display' 
                            className={displayClasses}
                            renderer={this.renderer} 
                            game={game}
                            handleDisplayResize={this.handleDisplayResize}
                            handleFocus={this.handleFocus}
                        />
                        
                        <MessageBox
                            id='message_box'
                            className={messageBoxClasses}
                            handleChange={this.handleInputChange}
                            handleInput={this.handleInput}
                            messages={messages}
                            input={input}
                            handleFocus={this.handleFocus}
                            focused={this.state.focus}
                        />
                    </div>
                )
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
                this.handleClick = this.handleClick.bind(this)
            }
            
            handleClick(e) {
                this.props.handleFocus('display', e)
            }
            
            componentDidUpdate() {
                let $domNode = $(this.domNode)
                this.props.handleDisplayResize({
                    height: $domNode.height(),
                    width: $domNode.width()
                })
                
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
            
            render() {
                const id = this.props.id
                
                return (
                    <div 
                        id={id} 
                        className={this.props.className} 
                        ref={ disp => this.domNode = disp }
                        onClick={this.handleClick}
                    />
                )
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
                
                this.handleClick = this.handleClick.bind(this)
            }
            
            
            componentDidUpdate() {
                let $domNode = $(this.domNode)
                let height = $domNode.height()
                let offset = 1000
                $domNode.scrollTop(height + $domNode.scrollTop() + offset)
            }
            
            handleClick(e) {
                this.props.handleFocus('messageBox', e)
            }
            
            render() {
                const id = this.props.id
                const classes = this.props.className
                let focusInputBox = false
                
                return (
                    <div 
                        id={id} 
                        className={classes} 
                        ref={el => this.domNode = el}
                        onClick={this.handleClick}
                    >
                        <MessagesContainer
                            id='message_container'
                            messages = {this.props.messages}
                            input={this.props.input}
                        />
                        <MessagesInputBox 
                            input={this.props.input}
                            handleChange={this.props.handleChange}
                            handleInput={this.props.handleInput}
                            isFocused={this.props.focused === 'messageBox'}
                        />
                        
                    </div>
                )
            }
        }
        
        class MessagesContainer extends React.Component {
            constructor(props) {
                super(props)
            }
            
            render() {
                const id = this.props.id
                const messages = this.props.messages.map((message, index, arr) => {
                    return (
                        <Message 
                            message={message.text} 
                            bold={message.bold} 
                            key={message.key}
                            timeStamp={true}
                        />
                    )
                })
                
                return (
                    <div id={id}>
                        {messages}
                        <Message
                            message={this.props.input}
                        />
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
                
                const prefix = '--> '
                const message = this.props.message || this.props.children
                const classes = this.props.className + ' message'
                const timeStamp =  addParenthesis(this.created.toLocaleTimeString()) + ' '
                
                return (
                    <div className={classes}>
                        {prefix}
                        {!this.props.timeStamp ? undefined : timeStamp}
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
            
            componentDidUpdate() {
                if (this.props.isFocused) $(this.domNode).trigger('focus')
            }
            
            render() {
                const classes = this.props.className
                
                return (
                    <div className={classes + ' input-group fglab_inputbox'}>
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