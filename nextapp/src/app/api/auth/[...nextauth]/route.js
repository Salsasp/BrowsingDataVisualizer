import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb"
export const authOptions = {
    providers: [
	CredentialsProvider({
	    name: "Credentials",

	    credentials: {
		username: {label: "Username", type: "text"},
		password: {label: "Password", type: "password"}
	    },
	    }
	})
    ],

    theme: {
	colorScheme: "light",
    }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
