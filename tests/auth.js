'use strict'

// will contain the Stellar API object
let api = null

// data for the valid user
const validUser = {
  email: 'valid_user@example.com',
  password: 'valid_password',
  password_confirmation: 'valid_password'
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

  describe('auth.register', () => {
    it('fail with no arguments', done => {
      api.actions.call('auth.register', error => {
        Should.exist(error)
        done()
      })
    })

    it('fail without email', done => {
      api.actions.call('auth.register', { password: '123456', password_confirmation: '123456' }, error => {
        Should.exist(error)
        done()
      })
    })

    it('password needs at least six characters', done => {
      api.actions.call('auth.register', { email: 'user@email.com', password: 'asd', password_confirmation: 'asd' }, error => {
        Should.exist(error)

        api.actions.call('auth.register', { email: 'some@email.com', password: '123456', password_confirmation: '123456' }, error => {
          Should.not.exist(error)
          done()
        })
      })
    })

    it('password needs confirmation', done => {
      api.actions.call('auth.register', { email: 'user@email.com', password: 'valid_password', }, error => {
        Should.exist(error)
        done()
      })
    })

    it('create a new user', done => {
      api.actions.call('auth.register', validUser, (error, response) => {
        Should.not.exist(error)
        Should.exist(response)

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
      api.actions.call('auth.login', (error, response) => {
        Should.exist(error)
        done()
      })
    })

    it('must require the email parameter', done => {
      api.actions.call('auth.login', { password: 'something' }, (error, response) => {
        Should.exist(error)
        done()
      })
    })

    it('must require the password parameter', done => {
      api.actions.call('auth.login', { email: 'someuser' }, (error, response) => {
        Should.exist(error)
        done()
      })
    })

    it('user needs exists', done => {
      api.actions.call('auth.login', { email: 'some_rand@user.com', password: 'valid_password' }, error => {
        Should.exist(error)
        error.message.should.be.equal(api.config.auth.errors.invalidCredentials())
        done()
      })
    })

    it('password needs match with the user', done => {
      api.actions.call('auth.login', { email: 'user@example.com', password: 'some_password' }, (error, response) => {
        Should.exist(error)
        error.should.be.an.instanceOf(Error)
        error.message.should.equal(api.config.auth.errors.invalidCredentials())
        done()
      })
    })

    it('must generate a token', done => {
      api.actions.call('auth.login', validUser, (error, response) => {
        Should.not.exist(error)
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
      api.actions.call('auth.login', validUser, (error, response) => {
        Should.exist(response.custom)
        response.custom.should.be.equal('param')
        done()
      })
    })
  })
})
