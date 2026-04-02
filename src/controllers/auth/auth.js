import bcrypt from 'bcrypt'
import { findUserByEmail, createUser } from '../../models/auth/users.js'

export function buildRegister(req, res) {
  res.render('pages/auth/register', {
    title: 'Register',
    pageTitle: 'Create an Account'
  })
}

export function buildLogin(req, res) {
  res.render('pages/auth/login', {
    title: 'Login',
    pageTitle: 'Login'
  })
}

export async function registerUser(req, res, next) {
  try {
    const { firstName, lastName, email, password, confirmPassword, gender } = req.body

    if (password !== confirmPassword) {
      const err = new Error('Passwords do not match.')
      err.status = 400
      return next(err)
    }

    const existingUser = await findUserByEmail(email)

    if (Object.keys(existingUser).length > 0) {
      const err = new Error('That email is already registered.')
      err.status = 400
      return next(err)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      role: 'player',
      gender
    })

    req.session.user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role
    }

    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await findUserByEmail(email)

    if (Object.keys(user).length === 0) {
      const err = new Error('Invalid email or password.')
      err.status = 401
      return next(err)
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      const err = new Error('Invalid email or password.')
      err.status = 401
      return next(err)
    }

    req.session.user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role
    }

    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

export function logoutUser(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err)
    res.redirect('/')
  })
}