import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';

import { Express } from 'express';
import { Config } from '../../config';

export class Auth {
  public static init(express: Express) {
    let jwtOptions = {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeader(),
      secretOrKey: Config.server.jwtSecret,
    };
    let strategy = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
      next(null, { id: 0 });
      /*
      // Insert user validation here
      let users: Users = new Users();
      users.getUser({ id: jwtPayload.data }).then((user) => {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      }).catch((error) => {
        next(error, false);
      });
    */
    });
    passport.use(strategy);
    express.use(passport.initialize());
    express.use(passport.authenticate('jwt', { session: false }));
  }
}
