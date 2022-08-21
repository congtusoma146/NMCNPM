const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
const userM = require('../models/users');

module.exports = app => {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'pwd'
    },
        async (username, password, done) => {
            let user;
            try {
                user = await userM.get(username);          
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                const challengeResult = await bcrypt.compare(password, user.f_password);               
                if (!challengeResult) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } catch (error) {
                return done(error);
            }
            return done(null,username);
        }

    ));
    
    
    
    passport.serializeUser(async (user, done) => {
        /* try {
            const u = await userM.get(user.f_username);
            done(null, u);
        } catch (error) {
            done(new Error('error'), null);
        } */
        done(null, user);
    });

    passport.deserializeUser(async (user, done) => {
        /* try {
            const u = await userM.get(user.f_username);
            done(null, u);
        } catch (error) {
            done(new Error('error'), null);
        } */
        done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());
};