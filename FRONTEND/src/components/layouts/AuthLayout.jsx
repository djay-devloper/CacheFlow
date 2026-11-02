import { Link } from 'react-router-dom';
import { LuArrowUpRight, LuCircleDollarSign, LuSparkles, LuTrendingUp } from 'react-icons/lu';

function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14">
        <Link to="/" className="inline-flex w-fit items-center gap-2.5" aria-label="CacheFlow home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
            <LuCircleDollarSign className="text-2xl" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950">CacheFlow</span>
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-slate-400">A clearer view of your finances.</p>
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden bg-[#17122a] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-36 -top-32 h-[440px] w-[440px] rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute -bottom-48 -left-28 h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Your money, in focus</span>
          <LuSparkles className="text-xl text-violet-200" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-xl">
          <p className="mb-4 text-sm font-medium text-violet-200">A more intentional way to manage money</p>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Confidence starts with a clearer picture.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Bring your income, spending, and monthly progress together in one calm workspace.
          </p>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Cash flow</p>
                <p className="mt-1 text-lg font-semibold">Your month at a glance</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <LuTrendingUp className="text-xl" />
              </span>
            </div>
            <div className="mt-7 flex h-36 items-end gap-3">
              {[36, 54, 43, 68, 51, 82, 64, 92, 73, 100, 79, 112].map((height, index) => (
                <div key={index} className="flex flex-1 items-end">
                  <div
                    className={`w-full rounded-t-md ${index === 9 ? 'bg-violet-300' : 'bg-violet-400/35'}`}
                    style={{ height: `${height}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-500">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
              <span className="text-slate-300">Understand your trends</span>
              <LuArrowUpRight className="text-violet-200" />
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">Simple tools for a more confident financial routine.</p>
      </aside>
    </main>
  );
}

export default AuthLayout;
