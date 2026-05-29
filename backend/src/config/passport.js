import passport from "passport";
import { Strategy as GoogleStrategy }
from "passport-google-oauth20";

import prisma from "../utils/prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "/api/auth/google/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        let user =
          await prisma.user.findUnique({
            where: {
              email:
                profile.emails[0].value,
            },
          });

        if (!user) {
          user =
            await prisma.user.create({
              data: {
                googleId: profile.id,
                email:
                  profile.emails[0].value,
                name:
                  profile.displayName,
              },
            });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;