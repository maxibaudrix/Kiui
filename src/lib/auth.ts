import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";


export const authConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/onboarding/step-1-biometrics", // Redirige aquí después del registro
  },
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Permite vincular cuentas con mismo email
    }),
    
    // Email/Password (Credentials)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email as string 
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        // ✅ FIX PRINCIPAL: Cast explícito de user.password
        if (!user.password) {
          throw new Error("Usuario sin contraseña configurada");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password! // Ahora TypeScript sabe que NO es null
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Redirigir usuarios nuevos al onboarding
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        // Verificar si es la primera vez que inicia sesión
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { profile: true },
        });

        // Si no tiene perfil, es un usuario nuevo
        if (existingUser && !existingUser.profile) {
          // La redirección al onboarding se maneja en pages.signIn
          return true;
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
