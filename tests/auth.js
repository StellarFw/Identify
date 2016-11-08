const jwt = require('jsonwebtoken')

// will contain the Stellar API object
let api = null

// data for the valid user
const validUser = {
  email: 'valid_user@example.com',
  password: 'valid_password',
  password_confirmation: 'valid_password'
}

let disabledUserId = ''
const disabledUser = {
  email: 'disabled@example.com',
  password: 'valid_password',
  active: false
}

let activeUserId = ''
const activeUser = {
  email: 'active@example.com',
  password: 'valid_password',
  active: false
}

describe('Authentication', () => {

  before(done => {
    // start a Stellar instance
    engine.start((error, a) => {
      api = a
      done()
    })
  })

  after(done => {
    // finish the Stellar instance execution
    engine.stop(() => { done() })
  })

  beforeEach(done => {
    // create a new user model instance
    let newModel = new(api.models.get('user'))(disabledUser)
    let newModel2 = new(api.models.get('user'))(activeUser)

    // save the new model and return the promise
    newModel.save()
      .then(user => {
        // save the user id
        disabledUserId = user._id
      })
      .then(_ => newModel2.save())
      .catch(e => { console.log('>>', e) })
      .then(user => {
        activeUserId = user._id

        done()
      })
  })

  afterEach(done => {
    // remove the disabled user
    api.models.get('user').findByIdAndRemove(disabledUserId)
      .then(_ => api.models.get('user').findByIdAndRemove(activeUserId))
      .then(_ => done())
  })

  describe('auth.register', () => {
    it('fail with no arguments', done => {
      api.actions.call('auth.register').should.be.rejected().then(_ => { done() })
    })

    it('fail without email', done => {
      api.actions.call('auth.register', { password: '123456', password_confirmation: '123456' }).should.be.rejected().then(_ => { done() })
    })

    it('password needs at least six characters', done => {
      api.actions.call('auth.register', { email: 'user@email.com', password: 'asd', password_confirmation: 'asd' }).should.be
        .rejected()
        .then(_ => api.actions.call('auth.register', { email: 'some@email.com', password: '123456', password_confirmation: '123456' }))
        .should.be.fulfilled()
        .then(_ => { done() })
    })

    it('password needs confirmation', done => {
      api.actions.call('auth.register', { email: 'user@email.com', password: 'valid_password', }).should.be
        .rejected()
        .then(_ => { done() })
    })

    it('create a new user', done => {
      api.actions.call('auth.register', validUser)
        .then(response => {
          Should.exist(response.user)
          Should.exist(response.user.email)
          response.user.email.should.be.an.String()
          response.user.password.should.be.an.String()
          Should.exist(response.user.password)

          done()
        })
    })
  })

  describe('auth.login', () => {
    it('need arguments', done => {
      api.actions.call('auth.login').should.be
        .rejected()
        .then(_ => { done() })
    })

    it('must require the email parameter', done => {
      api.actions.call('auth.login', { password: 'something' }).should.be
        .rejected()
        .then(_ => { done() })
    })

    it('must require the password parameter', done => {
      api.actions.call('auth.login', { email: 'someuser' }).should.be
        .rejected()
        .then(_ => { done() })
    })

    it('user needs exists', done => {
      api.actions.call('auth.login', { email: 'some_rand@user.com', password: 'valid_password' }).should.be
        .rejectedWith({ code: 'invalid_credentials' })
        .then(_ => { done() })
    })

    it('password needs match with the user', done => {
      api.actions.call('auth.login', { email: 'user@example.com', password: 'some_password' }).should.be
        .rejectedWith({ code: 'invalid_credentials' })
        .then(_ => { done() })
    })

    it('must generate a token', done => {
      api.actions.call('auth.login', validUser)
        .then(response => {
          response.token.should.be.an.instanceOf(String)
          done()
        })
    })

    it('can modify the response', done => {
      // register a new event
      api.events.listener('auth.loginResponse', (api, params, next) => {
        params.custom = 'param'
        next()
      })

      // call the login action
      api.actions.call('auth.login', validUser)
        .then(response => {
          response.custom.should.be.equal('param')
          done()
        })
    })

    it('disable user can not make login', done => {
      api.actions.call('auth.login', disabledUser).should.be
        .rejectedWith({ message: 'The user are disable' })
        .then(_ => { done() })
    })
  })

  describe('auth.checkSession', () => {
    it ('returns an error when the token is not present', done => {
      api.actions.call('auth.checkSession').should.be
        .rejected()
        .then(_ => { done() })
    })

    it ('returns an error when the token is invalid', done => {
      api.actions.call('auth.checkSession', { token: 'invalid_token' }).should.be
        .rejectedWith({ code: 'malformed_token' })
        .then(_ => { done() })
    })

    it ('do not return an error when the token is valid', done => {
      let token = null

      // get a valid token
      api.actions.call('auth.login', validUser)
        .then(response => api.actions.call('auth.checkSession', { token: response.token }))
        .then(response => {
          Should.exist(response.expiresAt)
          response.expiresAt.should.be.a.Number

          Should.exist(response.user)
          response.expiresAt.should.be.an.Object

          done()
        })
    })
  })

  it('can disable an user account', done => {
    api.actions.call('auth.disableUser', { id: activeUserId })
      .then(response => api.models.get('user').findById(activeUserId) )
      .then(user => {
        user.active.should.be.equal(false)
        done()
      })
      .catch(done)
  })

  it('can enable a disabled user account ', done => {
    api.actions.call('auth.activateUser', { id: disabledUserId })
      .then(response => api.models.get('user').findById(disabledUserId))
      .then(user => {
        user.active.should.be.equal(true)
        done()
      })
      .catch(done)
  })
})
