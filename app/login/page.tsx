import Link from 'next/link'
import { ArrowLeft, Wallet, ShieldCheck, Mail, Lock } from 'lucide-react'
import { login, signInWithGoogle } from './actions'
import { BackgroundWaves } from '@/components/BackgroundWaves'

export default async function LoginPage(props: { searchParams?: Promise<{ message?: string }> }) {
    const searchParams = await props.searchParams;
    const message = searchParams?.message;

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#090909] bg-cover bg-center" style={{ backgroundImage: "url('/login_bg.jpg')" }}>
            <BackgroundWaves />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl w-full items-center p-6 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-md z-10">

                {/* Left column - Login Form */}
                <div className="max-w-md mx-auto lg:mx-0 w-full">
                    <div className="flex flex-col items-center lg:items-start mb-2">
                        <Link href="/" className="flex items-center group transition-all duration-300 transform hover:scale-110 mb-2">
                            <img src="/logo_v2.png" alt="Flo Logo" className="h-24 w-auto object-contain drop-shadow-2xl" />
                        </Link>
                    </div>

                    <h1 className="text-4xl lg:text-5xl leading-tight font-black text-white tracking-tight mb-4 text-center lg:text-left">
                        WELCOME BACK
                    </h1>

                    <p className="text-lg leading-relaxed text-zinc-400 mb-8 text-center lg:text-left">
                        Access your economic flow
                    </p>

                    {message && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                            <p className="text-xs font-bold text-red-500 text-center">{message}</p>
                        </div>
                    )}

                    <form className="space-y-6" action={login}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-lg bg-[#181818] border border-[#2d2d2d] px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-lg bg-[#181818] border border-[#2d2d2d] px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    Remember me
                                </label>
                            </div>

                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            <span>Sign In</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline underline-offset-4">
                            Create one now
                        </Link>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-all">
                            <ArrowLeft className="w-4 h-4" /> Back to home
                        </Link>
                    </div>
                </div>

                {/* Right visualization */}
                <div className="relative hidden lg:block h-full">
                    <div className="h-[600px] flex items-end p-12 bg-[url(https://images.unsplash.com/photo-1709706696753-1dc4f13d0cc4?w=1080&q=80)] bg-cover bg-center rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="relative z-10 w-full">
                            <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-6 backdrop-blur-md bg-white/5 border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                                <Wallet className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-3xl font-normal text-white tracking-tight uppercase">Economic Flow Dashboard</h3>
                            <p className="text-gray-400 mt-2 max-w-sm">Manage your global financial operations with precision and clarity.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
